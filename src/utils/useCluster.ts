import { useCallback, useRef } from "react";

import { useWASMWorkers } from "./useWASMWorkers";

interface Area {
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

function pickRandomSector(
  range: [number, number],
  sectors: Area[]
): [Area, [number, number]] {
  const idx = Math.round(Math.random() * (range[1] - range[0]) + range[0]);
  const sector = sectors[idx];

  sectors[idx] = sectors[range[0]];
  sectors[range[0]] = sector;

  return [sector, [range[0] + 1, range[1]]];
}

export function useCluster<T extends { type: string }>(size: number) {
  const workers = useWASMWorkers(WORKERS);
  const sectorsRef = useRef<Area[]>(getSectors(WORKERS * 3, size));
  const rangeRef = useRef<[number, number]>([0, sectorsRef.current.length - 1]);

  const doWork = useCallback(
    (worker: Worker) => {
      if (rangeRef.current[0] > rangeRef.current[1]) {
        return;
      }

      const [sector, range] = pickRandomSector(
        rangeRef.current,
        sectorsRef.current
      );

      if (sector) {
        rangeRef.current = range;
        worker.postMessage({ size, sector });
      }
    },
    [size]
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
