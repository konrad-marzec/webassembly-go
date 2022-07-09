import { useCallback, useRef } from "react";

import { useWASMWorkers } from "./useWASMWorkers";

export interface Area {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const WORKERS = navigator.hardwareConcurrency ?? 5;

function getSectors(count: number, size: number) {
  const sectorSize = Math.ceil(size / count);

  const sectors: Area[] = [];

  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const x0 = i * sectorSize;
      const y0 = j * sectorSize;

      const x1 = Math.min(x0 + sectorSize, size);
      const y1 = Math.min(y0 + sectorSize, size);

      sectors.push({ x0, x1, y0, y1 });
    }
  }

  return sectors;
}

export function useCluster<T extends { type: string }>(
  scheduler: (sectors: Area[]) => Area | undefined,
  size: number
) {
  const workers = useWASMWorkers(WORKERS);
  const sectorsRef = useRef<Area[]>(getSectors(WORKERS * 3, size));

  const doWork = useCallback(
    (worker: Worker) => {
      const sector = scheduler(sectorsRef.current);

      if (sector) {
        worker.postMessage({ size, sector });
      }
    },
    [scheduler, size]
  );

  return useCallback(
    (callback: (data: T) => void) => {
      if (!workers?.length) {
        return;
      }

      workers.forEach((worker) => {
        doWork(worker);

        worker.addEventListener("message", (e: MessageEvent<T>) => {
          if (e.data.type === "DONE") {
            doWork(worker);
          }

          if (e.data.type === "UPDATE") {
            callback(e.data);
          }
        });
      });
    },
    [workers, doWork]
  );
}
