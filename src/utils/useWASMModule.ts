import { useMemo, useState } from "react";

let loaded = false;

export function useWASMModule() {
  const [source, setSource] =
    useState<WebAssembly.WebAssemblyInstantiatedSource>();

  useMemo(async () => {
    if (loaded) {
      return;
    }

    loaded = true;

    const go = new window.Go();
    const result = await WebAssembly.instantiateStreaming(
      fetch("main.wasm"),
      go.importObject
    );

    go.run(result.instance);

    setSource(result);
  }, []);

  return source;
}
