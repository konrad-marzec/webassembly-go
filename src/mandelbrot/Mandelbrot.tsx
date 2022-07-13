import { useCallback, useRef } from "react";
import styled from "styled-components";

import { Area, useCluster } from "../utils/useCluster";

const SIZE = 512;

const Canvas = styled.canvas`
  border-radius: 5px;
`;

function pickNextSector(leftIndex: number, sectors: Area[]): [Area, number] {
  return [sectors[leftIndex], leftIndex + 1];
}

function pickRandomSector(leftIndex: number, sectors: Area[]): [Area, number] {
  const rightIndex = sectors.length - 1;

  const idx = Math.round(Math.random() * (rightIndex - leftIndex) + leftIndex);
  const sector = sectors[idx];

  sectors[idx] = sectors[leftIndex];
  sectors[leftIndex] = sector;

  return [sector, leftIndex + 1];
}

function Mandelbrot() {
  const leftIndexRef = useRef<number>(0);

  const scheduler = useCallback((sectors: Area[]) => {
    const rightIndex = sectors.length - 1;

    if (leftIndexRef.current > rightIndex) {
      return;
    }

    // const [sector, leftIndex] = pickRandomSector(leftIndexRef.current, sectors);
    const [sector, leftIndex] = pickNextSector(leftIndexRef.current, sectors);
    leftIndexRef.current = leftIndex;

    return sector;
  }, []);

  const start = useCluster<{
    type: string;
    data: [number, number, number, number, number];
  }>(scheduler, SIZE);

  const setRef = useCallback(
    (ref: HTMLCanvasElement | null) => {
      if (!ref) {
        return;
      }

      const ctx = ref.getContext("2d");

      if (!ctx) {
        return;
      }

      const image = ctx.createImageData(1, 1);

      const imgData = image.data;

      start(({ data }) => {
        const [x, y, r, g, b] = data;

        imgData[0] = r;
        imgData[1] = g;
        imgData[2] = b;
        imgData[3] = 255;

        ctx.putImageData(image, x, y);
      });
    },
    [start]
  );

  return (
    <Canvas ref={setRef} id="mandelbrot-canvas" width={SIZE} height={SIZE} />
  );
}

export default Mandelbrot;
