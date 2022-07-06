declare global {
  export interface Window {
    Go: any;
    mandelbrot: (
      size: number,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      callback: (x: number, y: number, r: number, g: number, b: number) => void
    ) => number;
  }
}

export {};
