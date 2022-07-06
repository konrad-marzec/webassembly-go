/* eslint-disable no-restricted-globals */
import "../wasm_exec";

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

  const { sector, size } = event.data;

  self.mandelbrot(
    size,
    sector.x0,
    sector.y0,
    sector.x1,
    sector.y1,
    (...response) => {
      if (response.length) {
        postMessage({ type: "UPDATE", data: response });
      } else {
        postMessage({ type: "DONE" });
      }
    }
  );
});
