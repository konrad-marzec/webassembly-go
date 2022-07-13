package gameoflife

import (
	"syscall/js"
)

type GameBoard struct {
	x, y int
	buff []uint8
}

func Run() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		generation := args[0]
		x := args[1]
		y := args[2]

		board := NewGameBoard(generation, x.Int(), y.Int())
		done := board.Iterate()

		print(done)
		js.CopyBytesToJS(generation, board.buff)

		return done
	})
}

func NewGameBoard(generation js.Value, x int, y int) *GameBoard {
	buff := make([]uint8, generation.Get("byteLength").Int())
	js.CopyBytesToGo(buff, generation)

	return &GameBoard{buff: buff, x: x, y: y}
}

func (gb *GameBoard) Set(x, y int, val uint8) {
	gb.buff[y*(gb.x)+x] = val
}

func (gb *GameBoard) Get(x, y int) uint8 {
	return gb.buff[y*(gb.x)+x]
}

func (gb *GameBoard) InBounds(x int, y int) bool {
	return (x >= 0 && x < gb.x && y >= 0 && y < gb.y)
}

func (gb *GameBoard) Iterate() uint8 {
	buff := make([]uint8, len(gb.buff))
	copy(buff, gb.buff)
	gbOld := &GameBoard{buff: buff, x: gb.x, y: gb.y}

	for y := 0; y < gb.y; y++ {
		for x := 0; x < gb.x; x++ {
			if gbOld.Get(x, y) == 0 && gbOld.Neighbors(x, y) == 3 {
				gb.Set(x, y, 1)
				continue
			}

			if gbOld.Get(x, y) == 1 && gbOld.Neighbors(x, y) < 2 {
				gb.Set(x, y, 0)
				continue
			}

			if gbOld.Get(x, y) == 1 && ((gbOld.Neighbors(x, y) == 2) || (gbOld.Neighbors(x, y) == 3)) {
				continue
			}

			if gbOld.Get(x, y) == 1 && (gbOld.Neighbors(x, y) > 3) {
				gb.Set(x, y, 0)
				continue
			}
		}
	}

	return gbOld.Equal(gb)
}

func (gb *GameBoard) Neighbors(x, y int) int {
	count := 0
	arr := []int{-1, 0, 1}

	for _, v1 := range arr {
		for _, v2 := range arr {
			if gb.InBounds(x+v1, y+v2) {
				if gb.Get(x+v1, y+v2) == 1 && !(v1 == 0 && v2 == 0) {
					count++
				}
			}
		}
	}

	return count
}

func (gb *GameBoard) Equal(gb2 *GameBoard) uint8 {
	if gb.x != gb2.x || gb.y != gb2.y {
		return 0
	}

	if len(gb.buff) != len(gb2.buff) {
		return 0
	}

	for k := range gb.buff {
		if gb.buff[k] != gb2.buff[k] {
			return 0
		}
	}

	return 1
}
