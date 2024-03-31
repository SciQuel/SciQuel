"use client";

import { useEffect, useState } from "react";

function getWindowDimensions() {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  function onResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return windowDimensions;
}
