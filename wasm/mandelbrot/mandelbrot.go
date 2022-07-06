package mandelbrot

import (
	"image/color"
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

const (
	posX   = -2
	posY   = -1.2
	height = 2.5

	maxIter = 1000
	samples = 200
)

func Run() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		size := args[0].Int()
		x0 := args[1].Int()
		y0 := args[2].Int()
		x1 := args[3].Int()
		y1 := args[4].Int()
		cb := args[5]

		work_item := WorkItem{
			initialX: x0,
			initialY: y0,
			finalX:   x1,
			finalY:   y1,
		}

		calculate_pixels(size, work_item, cb)

		return nil
	})
}

func calculate_pixels(size int, work_item WorkItem, callback js.Value) {
	ratio := float64(size) / float64(size)

	for x := work_item.initialX; x < work_item.finalX; x++ {
		for y := work_item.initialY; y < work_item.finalY; y++ {
			var colorR, colorG, colorB int

			for k := 0; k < samples; k++ {
				a := height*ratio*((float64(x)+utils.RandFloat64())/float64(size)) + posX
				b := height*((float64(y)+utils.RandFloat64())/float64(size)) + posY
				c := pixelColor(mandelbrotIteration(a, b, maxIter))

				colorR += int(c.R)
				colorG += int(c.G)
				colorB += int(c.B)
			}

			cr := uint8(float64(colorR) / float64(samples))
			cg := uint8(float64(colorG) / float64(samples))
			cb := uint8(float64(colorB) / float64(samples))

			callback.Invoke(x, y, cr, cg, cb)
		}
	}

	callback.Invoke()
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
