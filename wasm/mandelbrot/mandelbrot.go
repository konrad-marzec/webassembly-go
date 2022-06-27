package mandelbrot

import (
	"image/color"
	"math"
	"syscall/js"

	"github.com/llgcode/draw2d/draw2dimg"
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
	numThreads = 16
)

func RunMandelbrot() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) {
		c, err := InitializeCanvas(args[0])

		if err != nil {
			return
		}

		imgWidth = c.width
		imgHeight = c.height
		pixelTotal = c.width * c.height
		ratio = float64(c.width) / float64(c.height)

		draw_buffer := make(chan Pix, pixelTotal)
		thread_buffer := make(chan bool, numThreads)
		work_buffer := make(chan WorkItem, numBlocks)

		go workBufferInit(work_buffer, c)
		go workersInit(draw_buffer, work_buffer, thread_buffer)
		go drawThread(draw_buffer, c.gctx)

	})
}

func workBufferInit(work_buffer chan WorkItem) {
	sqrt := int(math.Sqrt(numBlocks))

	for i := sqrt - 1; i >= 0; i-- {
		for j := 0; j < sqrt; j++ {
			work_buffer <- WorkItem{
				initialX: i * (imgWidth / sqrt),
				finalX:   (i + 1) * (imgWidth / sqrt),
				initialY: j * (imgHeight / sqrt),
				finalY:   (j + 1) * (imgHeight / sqrt),
			}
		}
	}
}

func workersInit(draw_buffer chan Pix, work_buffer chan WorkItem, thread_buffer chan bool) {
	for i := 1; i <= numThreads; i++ {
		thread_buffer <- true
	}

	for range thread_buffer {
		work_item := <-work_buffer

		go workerThread(work_item, draw_buffer, thread_buffer)
	}
}

func workerThread(work_item WorkItem, draw_buffer chan Pix, thread_buffer chan bool) {
	for x := work_item.initialX; x < work_item.finalX; x++ {
		for y := work_item.initialY; y < work_item.finalY; y++ {
			var colorR, colorG, colorB int

			for k := 0; k < samples; k++ {
				a := height*ratio*((float64(x)+RandFloat64())/float64(imgWidth)) + posX
				b := height*((float64(y)+RandFloat64())/float64(imgHeight)) + posY
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

func drawThread(draw_buffer chan Pix, gctx draw2dimg.GraphicContext) {
	for i := range draw_buffer {
		gctx.SetRGBA(i.x, i.y, color.RGBA{R: i.cr, G: i.cg, B: i.cb, A: 255})
		// img.SetRGBA(i.x, i.y, color.RGBA{R: i.cr, G: i.cg, B: i.cb, A: 255})
		// pixelCount++
	}
}

func mandelbrotIteration(a, b float64, maxIter int) (float64, int) {
	var x, y, xx, yy, xy float64

	for i := 0; i < maxIter; i++ {
		xx, yy, xy = x*x, y*y, x*y

		if xx+yy > 4 {
			return xx + yy, i
		}
		// xn+1 = x^2 - y^2 + a
		x = xx - yy + a
		// yn+1 = 2xy + b
		y = 2*xy + b
	}

	return xx + yy, maxIter
}

func pixelColor(r float64, iter int) color.RGBA {
	inside_set := color.RGBA{R: 0, G: 0, B: 0, A: 255}

	// https://pt.wikipedia.org/wiki/Conjunto_de_Mandelbrot
	if r > 4 {
		// return hslToRGB(float64(0.70)-float64(iter)/3500*r, 1, 0.5)
		return hslToRGB(float64(iter)/100*r, 1, 0.5)
	}

	return inside_set
}
