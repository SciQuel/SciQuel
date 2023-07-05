declare global {
  namespace JSX {
    interface IntrinsicElements {
      "large-image": React.HTMLAttributes & { src: string };
    }
  }
}

export {};
