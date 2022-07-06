/* eslint-disable no-restricted-globals */
import "../wasm_exec";

let instance: WebAssembly.WebAssemblyInstantiatedSource["instance"];
let module: WebAssembly.WebAssemblyInstantiatedSource["module"];

async function initialize() {
  const go = new self.Go();
  const response = await fetch("/main.wasm");

  const buffer = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer, go.importObject);

  go.run(wasm.instance);

  instance = wasm.instance;
  module = wasm.module;
}

// function onUpdate(params:type) {

// }

// function onUpdate(params:type) {

// }

addEventListener("message", async function (event) {
  if (!instance) {
    await initialize();
  }

  console.log(self.add(1, 2));

  postMessage({ type: "DONE" });
});
