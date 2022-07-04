package mandelbrot

import (
	"image/color"
	"math"
	"syscall/js"

	"github.com/konrad-marzec/webassembly-go/utils"
)

type Pix struct {
	x  int
	y  int
	cr uint8
	cg uint8
	cb uint8
}

type WorkItem struct {
	initialX int
	finalX   int
	initialY int
	finalY   int
}

var (
	imgWidth   int
	imgHeight  int
	pixelTotal int
	ratio      float64
)

const (
	posX   = -2
	posY   = -1.2
	height = 2.5

	maxIter = 1000
	samples = 200

	numBlocks  = 64
	numThreads = 5
)

func RunMandelbrot() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {

		id := args[0].String()
		// cb := args[1]

		c, err := utils.InitializeCanvas(id)

		if err != nil {
			return nil
		}

		imgWidth = c.Width()
		imgHeight = c.Height()
		pixelTotal = c.Width() * c.Height()
		ratio = float64(c.Width()) / float64(c.Height())

		draw_buffer := make(chan Pix, pixelTotal)
		thread_buffer := make(chan bool, numThreads)
		work_buffer := make(chan WorkItem, numBlocks)

		workBufferInit(work_buffer)
		go workersInit(draw_buffer, work_buffer, thread_buffer, c)
		go drawThread(draw_buffer, c)

		// time.Sleep(120 * time.Second)
		// c.Render()

		return nil
	})
}

func workBufferInit(work_buffer chan WorkItem) {
	sqrt := int(math.Sqrt(numBlocks))

	for i := sqrt - 1; i >= 0; i-- {
		for j := 0; j < sqrt; j++ {
			initialX := i * (imgWidth / sqrt)
			finalX := (i + 1) * (imgWidth / sqrt)
			initialY := j * (imgHeight / sqrt)
			finalY := (j + 1) * (imgHeight / sqrt)

			work_buffer <- WorkItem{
				initialX: initialX,
				finalX:   finalX,
				initialY: initialY,
				finalY:   finalY,
			}
		}
	}
}

func workersInit(draw_buffer chan Pix, work_buffer chan WorkItem, thread_buffer chan bool, canvas *utils.Canvas) {
	for i := 1; i <= numThreads; i++ {
		thread_buffer <- true
	}

	for range thread_buffer {
		work_item := <-work_buffer

		go workerThread(work_item, draw_buffer, thread_buffer)

		// canvas.Render()
	}
}

func workerThread(work_item WorkItem, draw_buffer chan Pix, thread_buffer chan bool) {
	for x := work_item.initialX; x < work_item.finalX; x++ {
		for y := work_item.initialY; y < work_item.finalY; y++ {
			var colorR, colorG, colorB int

			for k := 0; k < samples; k++ {
				a := height*ratio*((float64(x)+utils.RandFloat64())/float64(imgWidth)) + posX
				b := height*((float64(y)+utils.RandFloat64())/float64(imgHeight)) + posY
				c := pixelColor(mandelbrotIteration(a, b, maxIter))

				colorR += int(c.R)
				colorG += int(c.G)
				colorB += int(c.B)
			}

			cr := uint8(float64(colorR) / float64(samples))
			cg := uint8(float64(colorG) / float64(samples))
			cb := uint8(float64(colorB) / float64(samples))

			draw_buffer <- Pix{
				x, y, cr, cg, cb,
			}

		}
	}

	thread_buffer <- true
}

func drawThread(draw_buffer chan Pix, c *utils.Canvas) {
	for i := range draw_buffer {
		color := color.RGBA{R: i.cr, G: i.cg, B: i.cb, A: 255}
		c.SetRGBA(i.x, i.y, color)

		c.Render()
	}
}

func mandelbrotIteration(a, b float64, maxIter int) (float64, int) {
	var x, y, xx, yy, xy float64

	for i := 0; i < maxIter; i++ {
		xx, yy, xy = x*x, y*y, x*y

		if xx+yy > 4 {
			return xx + yy, i
		}

		x = xx - yy + a
		y = 2*xy + b
	}

	return xx + yy, maxIter
}

func pixelColor(r float64, iter int) color.RGBA {
	inside_set := color.RGBA{R: 0, G: 0, B: 0, A: 255}

	// https://pt.wikipedia.org/wiki/Conjunto_de_Mandelbrot
	if r > 4 {
		return utils.HslToRGB(float64(0.70)-float64(iter)/3500*r, 1, 0.5)
		// return utils.HslToRGB(float64(iter)/100*r, 1, 0.5)
	}

	return inside_set
}
