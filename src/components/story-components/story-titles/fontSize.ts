"use client";

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  type RefObject,
} from "react";

interface FontAction {
  type: "window update";
}

type action = 2 | 1 | 0 | -1;
// 2 grow
// 1 same (should have grown)
// 0 same
// -1 shrink

export default function useFontSize(containerRef: RefObject<HTMLDivElement>) {
  const prevRef = useRef<action[]>([]);
  const prevHeightRef = useRef([0]);

  const [headerFont, dispatchHeaderFont] = useReducer(
    (state: number, action: FontAction) => {
      switch (action.type) {
        case "window update":
          if (prevHeightRef.current.length > 4) {
            prevHeightRef.current = prevHeightRef.current.slice(-4);
          }
          if (prevRef.current.length > 4) {
            prevRef.current = prevRef.current.slice(-4);
          }
          console.log(prevRef.current);
          console.log(prevHeightRef.current);
          if (!containerRef.current) {
            // if we can't calculate
            console.log("no container ref");
            // prevRef.current.push(state);
            prevRef.current.push(0);
            prevHeightRef.current.push(window.innerHeight);
            return state;
          }

          if (
            containerRef.current.clientHeight >
              window.innerHeight * 0.95 - 90 &&
            state > 14
            // containerRef.current.clientHeight >
            //   window.innerHeight * 0.55 - 90 &&
            // state > 14
          ) {
            // easy first, should we decrease?
            // basically are we likely overlapping the header
            console.log("shrink container");
            // prevRef.current.push(state - 2);
            prevRef.current.push(-1);
            prevHeightRef.current.push(window.innerHeight);
            return state - 2;
          } else if (
            containerRef.current.clientHeight + state <
              window.innerHeight * 0.9 - 90 &&
            state < 72
          ) {
            // check if we grow?

            if (
              Math.abs(window.innerHeight - prevHeightRef.current[0]) < 15 &&
              prevHeightRef.current.length >= 4
            ) {
              // if we havent changed, are we so far in a loop?
              let allPrevHeightsSame = true;
              for (let i = 1; i < prevHeightRef.current.length; i++) {
                if (prevHeightRef.current[i] != prevHeightRef.current[0]) {
                  allPrevHeightsSame = false;
                  break;
                }
              }
              if (allPrevHeightsSame) {
                let rising = false;
                let falling = false;
                let risingFailed = false;

                for (let i = 0; i < prevRef.current.length; i++) {
                  const currentAction = prevRef.current[i];
                  if (currentAction == 1) {
                    risingFailed = true;
                    break;
                  }
                  if (currentAction == 2) {
                    rising = true;
                  } else if (currentAction == -1) {
                    falling = true;
                  }
                  if (rising && falling) {
                    break;
                  }
                }

                if (risingFailed || (rising && falling)) {
                  prevHeightRef.current.push(window.innerHeight);
                  prevRef.current.push(1);
                  return state;
                } else {
                  prevRef.current.push(2);
                  prevHeightRef.current.push(window.innerHeight);
                  return state + 2;
                }
              } else {
                prevRef.current.push(2);
                prevHeightRef.current.push(window.innerHeight);
                return state + 2;
              }
            } else {
              prevRef.current.push(2);
              prevHeightRef.current.push(window.innerHeight);
              return state + 2;
            }
          } else {
            // we're in between and fine?
            console.log("return state in else");
            prevHeightRef.current.push(window.innerHeight);
            // prevRef.current.push(state);
            prevRef.current.push(0);
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
    // // sometimes header font size will have to be adjusted more than once
    if (prevRef.current.length > 1) {
      // if we have checked a few times and the size hasn't changed
      // then all the prevRef items will be the same
      // so if "doubled" is true we can assume no update
      // the event listener will call an update when the window changes size again
      let done = true;
      console.log(prevRef.current);

      for (let i = 1; i < prevRef.current.length; i++) {
        if (prevRef.current[i] != 0 && prevRef.current[i] != 1) {
          done = false;
        }
      }

      if (!done) {
        dispatchHeaderFont({ type: "window update" });
      }
    } else {
      // we don't have a full prevRef list, so check if we update?
      dispatchHeaderFont({ type: "window update" });
    }
    // dispatchHeaderFont({ type: "window update" });
  }, [headerFont]);

  return headerFont;
}
