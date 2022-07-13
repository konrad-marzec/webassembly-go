package main

import (
	"syscall/js"

	gameoflife "github.com/konrad-marzec/webassembly-go/game-of-life"
	"github.com/konrad-marzec/webassembly-go/mandelbrot"
)

func register() {
	js.Global().Set("mandelbrot", mandelbrot.Run())
	js.Global().Set("gameOfLife", gameoflife.Run())
}

func main() {
	ch := make(chan struct{}, 0)

	register()

	<-ch
}
