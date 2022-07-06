package main

import (
	"syscall/js"

	"github.com/konrad-marzec/webassembly-go/mandelbrot"
)

func register() {
	js.Global().Set("mandelbrot", mandelbrot.Run())
}

func main() {
	ch := make(chan struct{}, 0)

	register()

	<-ch
}
