import { useCallback } from "react";
import styled from "styled-components";
import { useCluster } from "../utils/useCluster";

const SIZE = 512;

const Canvas = styled.canvas`
  border-radius: 5px;
`;

function Mandelbrot() {
  const start = useCluster<{
    type: string;
    data: [number, number, number, number, number];
  }>(SIZE);

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
