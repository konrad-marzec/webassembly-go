package test

import (
	"fmt"
	"syscall/js"
)

func Test() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// c, _ := utils.InitializeCanvas(args[0].String())

		// if c != nil {
		// 	for i := 0; i < c.Width(); i++ {
		// 		for j := 0; j < c.Height(); j++ {
		// 			c.SetRGBA(i, j, color.RGBA{R: uint8(i % 255), G: uint8(rand.Intn(255)), B: uint8(j % 255), A: 255})
		// 		}
		// 	}

		// 	c.Render()
		// }

		fmt.Printf("asdasd %d", 10)

		return nil
	})
}
