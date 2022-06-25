import { useWASMModule } from "../utils/useWASMModule";

function Mandelbrot() {
  useWASMModule();

  // @ts-expect-error
  console.log(add?.(1, 1));

  return <div>Mandelbrot</div>;
}

export default Mandelbrot;
