export {};

declare global {
  interface Window {
    Jupiter: any; // You can replace `any` with a more specific type if you know the structure of Jupiter
  }
}