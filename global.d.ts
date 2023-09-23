declare global {
  namespace JSX {
    interface IntrinsicElements {
      "large-image": React.HTMLAttributes & { src: string };
      "caption-citation": React.HTMLAttributes;
      dropdown: React.HTMLAttributes;
    }
  }
}

export {};
