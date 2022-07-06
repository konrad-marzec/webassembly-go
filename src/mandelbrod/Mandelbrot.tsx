// import { useEffect } from "react";
// import { useWASMWorkers } from "../utils/useWASMWorkers";

import { useCallback } from "react";
import { useCluster } from "../utils/useCluster";

function Mandelbrot() {
  const paint = useCallback((...asd: any) => {
    console.log(asd);
  }, []);

  useCluster(256, paint);
  // useWASMModule();
  // const [a, ...asd] = useWASMWorkers(5);

  // console.log(a, asd);

  // useEffect(() => {
  //   if (!a) {
  //     return;
  //   }

  //   a.postMessage(4);
  // }, [a]);

  return (
    <div>
      Mandelbrot
      <canvas id="mandelbrot-canvas" width={256} height={256} />
    </div>
  );
}

export default Mandelbrot;
