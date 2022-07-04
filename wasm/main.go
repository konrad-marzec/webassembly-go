package main

import (
	"syscall/js"

	"github.com/konrad-marzec/webassembly-go/mandelbrot"
	"github.com/konrad-marzec/webassembly-go/test"
)

func add() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return args[0].Int() + args[1].Int()
	})
}

func register() {
	js.Global().Set("add", add())
	js.Global().Set("test", test.Test())
	js.Global().Set("mandelbrot", mandelbrot.RunMandelbrot())
}

func main() {
	ch := make(chan struct{}, 0)

	register()

	<-ch
}
