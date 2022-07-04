import { useCallback, useRef } from "react";
import { useWASMModule } from "../utils/useWASMModule";

function Mandelbrot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useWASMModule();

  const onClick = useCallback(() => {
    // const canvas = canvasRef.current;
    // if (!canvas) {
    //   return;
    // }

    // const ctx = canvas.getContext("2d");

    // if (!ctx) {
    //   return;
    // }

    // const image = ctx.createImageData(1, 1);

    // const data = image.data;

    // function paint(x: number, y: number, r: number, g: number, b: number) {
    //   if (!ctx) {
    //     return;
    //   }

    //   // const imgData = ctx.getImageData(x, y, 1, 1);
    //   // // const data = imgData.data;

    //   // console.log("1", imgData);

    //   // imgData.data.set([r, g, b]);
    //   data[0] = r;
    //   data[1] = g;
    //   data[2] = b;
    //   data[3] = 255;

    //   // console.log("2", imgData);

    //   // console.log({ r, g, b });

    //   ctx.putImageData(image, x, y);
    // }

    // for (let i = 0; i < 128; i++) {
    //   for (let j = 0; j < 128; j++) {
    //     paint(i, j, 0, 1, 1);
    //   }
    // }
    new Promise(() => {
      // @ts-expect-error
      window.mandelbrot("mandelbrot-canvas");
    });
  }, []);

  return (
    <div>
      Mandelbrot
      <canvas ref={canvasRef} id="mandelbrot-canvas" width={128} height={128} />
      <button onClick={onClick}>Start</button>
    </div>
  );
}

export default Mandelbrot;
