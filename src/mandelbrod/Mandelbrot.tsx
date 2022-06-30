import { useWASMModule } from "../utils/useWASMModule";

function Mandelbrot() {
  useWASMModule();

  return (
    <div>
      Mandelbrot
      <canvas id="mandelbrot-canvas" width={255} height={255} />
    </div>
  );
}

export default Mandelbrot;
