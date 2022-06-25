declare global {
  export interface Window {
    Go: any;
    add: (num1: number, num2: number) => number;
  }
}

export {};
