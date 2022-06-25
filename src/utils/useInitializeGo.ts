import { useEffect, useState } from "react";

let initialized = false;

export function useInitializeGo() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (initialized) {
      return;
    }

    initialized = true;

    const script = document.createElement("script");
    script.src = "wasm_exec.js";
    script.async = true;

    script.onload = () => {
      setLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  return loaded;
}
