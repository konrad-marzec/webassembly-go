import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { WorkerAction } from "../constants/worker.constants";
import { useWASMWorkers } from "../utils/useWASMWorkers";
import Life from "./Life";

const SIZE = 100;

const BoardGrid = styled.div<{ rows: number; cols: number }>`
  grid-gap: 0;
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: repeat(${({ rows }) => rows}, 10px);
  grid-template-columns: repeat(${({ cols }) => cols}, 10px);
`;

function initialize() {
  const buffer = new SharedArrayBuffer(SIZE * SIZE);

  const arr = new Uint8Array(buffer);

  for (let i = 0; i < SIZE * SIZE; i++) {
    const value = Math.round(Math.random() - 0.4);

    arr[i] = value;
  }

  return buffer;
}

function GameOfLife() {
  const boardRef = useRef(initialize());
  const [worker] = useWASMWorkers(1);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    if (!worker) {
      return;
    }

    worker.postMessage({
      type: WorkerAction.SHARED_MEMORY,
      data: boardRef.current,
    });

    worker.addEventListener("message", (e) => {
      if (e.data.type === WorkerAction.UPDATE) {
        worker.postMessage({
          type: WorkerAction.GAME_OF_LIFE,
          data: { size: SIZE },
        });
        forceUpdate((p) => p + 1);
      }
    });
  }, [worker]);

  const cells = useMemo(() => {
    const tmp = new Array(SIZE).fill("").map<ReactNode[]>(() => []);
    const arr = new Uint8Array(boardRef.current);

    for (let i = 0; i < SIZE * SIZE; i++) {
      tmp[i % SIZE][Math.floor(i / SIZE)] = <Life key={i} value={arr[i]} />;
    }

    return tmp;
  }, [_]);

  return (
    <BoardGrid rows={SIZE} cols={SIZE}>
      {cells}
    </BoardGrid>
  );
}

export default GameOfLife;
