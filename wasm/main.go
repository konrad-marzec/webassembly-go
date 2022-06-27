package main

import "syscall/js"

func add() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return args[0].Int() + args[1].Int()
	})
}

func register() {
	js.Global().Set("add", add())
	js.Global().Set("mandelbrot", RunMandelbrot())
}

func main() {
	ch := make(chan struct{}, 0)

	register()

	<-ch
}
