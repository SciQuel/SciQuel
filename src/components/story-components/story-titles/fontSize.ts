"use client";

import { RefObject, useEffect, useLayoutEffect, useReducer } from "react";

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}

interface FontAction {
  type: "window update";
}

export default function useFontSize(containerRef: RefObject<HTMLDivElement>) {
  const [headerFont, dispatchHeaderFont] = useReducer(
    (state: number, action: FontAction) => {
      switch (action.type) {
        case "window update":
          if (
            containerRef.current &&
            containerRef.current.clientHeight > window.innerHeight * 0.9 - 90 &&
            state > 14
          ) {
            return state - 2;
          } else if (
            containerRef.current &&
            containerRef.current.clientHeight +
              state +
              Math.max(state - 23, 14) +
              32 <
              window.innerHeight * 0.9 - 90 &&
            state < 72
          ) {
            return state + 2;
          } else {
            return state;
          }

        default:
          throw Error("unknown action in header font reducer");
      }
    },
    72,
  );

  function handleWindowResize() {
    if (containerRef.current) {
      dispatchHeaderFont({ type: "window update" });
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useLayoutEffect(() => {
    dispatchHeaderFont({ type: "window update" });
  }, [headerFont]);

  return headerFont;
}
