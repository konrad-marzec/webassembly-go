import { useEffect, useState } from "react";

export function useWASMWorkers(n: number): Worker[] {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    let tmp: Worker[] = [];
    for (let i = 0; i < n; i++) {
      const worker = new Worker(
        new URL("../workers/wasm.worker.ts", import.meta.url)
      );

      tmp.push(worker);
    }

    setWorkers(tmp);

    return () => {
      tmp.forEach((worker) => {
        worker.terminate();
      });
    };
  }, [n]);

  return workers;
}
