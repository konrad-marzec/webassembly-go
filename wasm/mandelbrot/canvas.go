package mandelbrot

import (
	"errors"
	"image"
	"syscall/js"

	"github.com/llgcode/draw2d/draw2dimg"
)

type Canvas struct {
	done chan struct{}

	window js.Value
	doc    js.Value
	body   js.Value

	canvas js.Value
	width  int
	height int

	ctx      js.Value
	imgData  js.Value
	gctx     *draw2dimg.GraphicContext
	image    *image.RGBA
	copybuff js.Value
}

func InitializeCanvas(id string) (*Canvas, error) {

	var c Canvas

	c.window = js.Global()
	c.doc = c.window.Get("document")
	c.body = c.doc.Get("body")

	if _, err := c.create(id); err != nil {
		return &c, err
	}

	if _, err := c.context(); err != nil {
		return &c, err
	}

	return &c, nil
}

func (c *Canvas) create(id string) (*Canvas, error) {

	canvas := c.doc.Call("getElementById", id)

	if canvas == nil {
		return c, errors.New("Element not found")
	}

	w := canvas.Call("innerWidth")
	h := canvas.Call("innerHeight")

	c.canvas = canvas
	c.height = h
	c.width = w

	return c, nil
}

func (c *Canvas) context() (*Canvas, error) {
	if c.canvas == nil {
		return c, errors.New("Cannot set context")
	}

	// Setup the 2D Drawing context
	c.ctx = c.canvas.Call("getContext", "2d")
	c.imgData = c.ctx.Call("createImageData", c.width, c.height)
	c.image = image.NewRGBA(image.Rect(0, 0, c.width, c.height))
	c.copybuff = js.Global().Get("Uint8Array").New(len(c.image.Pix))

	c.gctx = draw2dimg.NewGraphicContext(c.image)

	return c, nil
}
