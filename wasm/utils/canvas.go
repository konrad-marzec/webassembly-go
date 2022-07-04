package utils

import (
	"errors"
	"image"
	"image/color"
	"syscall/js"
)

type Canvas struct {
	done chan struct{}

	window   js.Value
	document js.Value
	body     js.Value

	canvas js.Value
	width  int
	height int

	ctx      js.Value
	imgData  js.Value
	image    *image.RGBA
	copybuff js.Value
}

func InitializeCanvas(id string) (*Canvas, error) {

	var c Canvas

	c.window = js.Global()
	c.document = c.window.Get("document")
	c.body = c.document.Get("body")

	if _, err := c.create(id); err != nil {
		return &c, err
	}

	if _, err := c.context(); err != nil {
		return &c, err
	}

	return &c, nil
}

func (c *Canvas) create(id string) (*Canvas, error) {

	canvas := c.document.Call("getElementById", id)

	if canvas.IsUndefined() {
		return c, errors.New("Element not found")
	}

	w := canvas.Get("clientWidth")
	h := canvas.Get("clientHeight")

	c.canvas = canvas

	c.width = w.Int()
	c.height = h.Int()

	return c, nil
}

func (c *Canvas) context() (*Canvas, error) {
	if c.canvas.IsUndefined() {
		return c, errors.New("Cannot set context")
	}

	// Setup the 2D Drawing context
	c.ctx = c.canvas.Call("getContext", "2d")
	c.imgData = c.ctx.Call("createImageData", c.width, c.height)
	c.image = image.NewRGBA(image.Rect(0, 0, c.width, c.height))
	c.copybuff = js.Global().Get("Uint8Array").New(len(c.image.Pix))

	// c.gctx = draw2dimg.NewGraphicContext(c.image)

	return c, nil
}

func (c *Canvas) Width() int {
	return c.width
}

func (c *Canvas) Height() int {
	return c.height
}

func (c *Canvas) SetRGBA(x int, y int, color color.RGBA) {
	c.image.SetRGBA(x, y, color)
}

func (c *Canvas) Render() {
	// TODO:  This currently does multiple data copies.   go image buffer -> JS Uint8Array,   Then JS Uint8Array -> ImageData,  then ImageData into the Canvas.
	// Would like to eliminate at least one of them, however currently CopyBytesToJS only supports Uint8Array  rather than the Uint8ClampedArray of ImageData.

	js.CopyBytesToJS(c.copybuff, c.image.Pix)
	c.imgData.Get("data").Call("set", c.copybuff)
	c.ctx.Call("putImageData", c.imgData, 0, 0)
}
