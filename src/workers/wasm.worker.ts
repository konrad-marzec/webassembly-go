/* eslint-disable no-restricted-globals */
import { WorkerAction } from "../constants/worker.constants";
import "../wasm_exec";

let memory: Uint8Array;
let instance: WebAssembly.WebAssemblyInstantiatedSource["instance"];

async function initialize() {
  const go = new self.Go();
  const response = await fetch("/main.wasm");

  const buffer = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer, go.importObject);

  go.run(wasm.instance);

  instance = wasm.instance;
}

addEventListener("message", async function (event) {
  if (!instance) {
    await initialize();
  }

  const { type, data } = event.data;

  if (type === WorkerAction.SHARED_MEMORY) {
    memory = data;

    postMessage({ type: WorkerAction.UPDATE });
  }

  if (type === WorkerAction.GAME_OF_LIFE) {
    const { size } = data;

    if (!memory) {
      return;
    }

    const done = self.gameOfLife(new Uint8Array(memory), size, size);

    if (done) {
      postMessage({ type: WorkerAction.DONE });
    } else {
      postMessage({ type: WorkerAction.UPDATE });
    }
  }

  // MANDELBROT
  if (type === WorkerAction.MANDELBROT) {
    const { sector, size } = data;

    self.mandelbrot(
      size,
      sector.x0,
      sector.y0,
      sector.x1,
      sector.y1,
      (...response) => {
        if (response.length) {
          postMessage({ type: WorkerAction.UPDATE, data: response });
        } else {
          postMessage({ type: WorkerAction.DONE });
        }
      }
    );
  }
});
