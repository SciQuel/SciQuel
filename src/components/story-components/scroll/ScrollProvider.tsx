"use client";

import {
  createContext,
  Ref,
  RefObject,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export function scale(
  number: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function getOffset(width: number): number {
  return (width - 768) / 2;
}

export interface OnScreenElements {
  elementRef: HTMLElement;
  maxOffset: number;
}

interface ScrollProviderVals {
  inViewElements: OnScreenElements[];
  setInViewElements: Dispatch<SetStateAction<OnScreenElements[]>>;

  dictButtonTop: number;
  setDictButtonTop: Dispatch<SetStateAction<number>>;

  dictButtonHeight: number;
  setDictButtonHeight: Dispatch<SetStateAction<number>>;

  resetOverlap: (element: RefObject<HTMLElement>) => void;

  updateOverlap: (offset: number, elementRef: RefObject<HTMLElement>) => void;
}

export const StoryScrollContext = createContext<ScrollProviderVals | null>(
  null,
);

export function StoryScrollProvider({ children }: PropsWithChildren) {
  const [dictTop, setDictTop] = useState(0);

  const [dictHeight, setDictHeight] = useState(0);

  const [screenElements, setScreenElements] = useState<OnScreenElements[]>([]);

  function resetOverlap(figureRef: RefObject<HTMLElement>) {
    setScreenElements((state) => {
      let newArray = state;
      state.forEach((item, index) => {
        console.log(
          "reset?: ",
          figureRef.current && item.elementRef == figureRef.current,
        );
        if (figureRef.current && item.elementRef == figureRef.current) {
          console.log("updated state would be: ", state.toSpliced(index, 1));
          newArray = state.toSpliced(index, 1);
          return newArray;
        }
      });
      return newArray;
    });
  }

  function updateOverlap(offset: number, elementRef: RefObject<HTMLElement>) {
    if (offset == 0) {
      resetOverlap(elementRef);
      return;
    }
    if (elementRef.current) {
      if (screenElements.length < 1) {
        setScreenElements([
          {
            elementRef: elementRef.current,
            maxOffset: offset,
          },
        ]);
      } else {
        setScreenElements((state) => {
          let itemIndex = -1;
          let newList = [...state];
          newList.forEach((item, index) => {
            if (item.elementRef == elementRef.current) {
              itemIndex = index;
            }
          });

          if (itemIndex == -1) {
            if (elementRef.current) {
              newList.push({
                elementRef: elementRef.current,
                maxOffset: offset,
              });

              return newList;
            }

            return state;
          } else {
            return state.toSpliced(itemIndex, 1, {
              elementRef: state[itemIndex].elementRef,
              maxOffset: offset,
            });
          }
        });
      }
    }
  }

  return (
    <StoryScrollContext.Provider
      value={{
        inViewElements: screenElements,
        setInViewElements: setScreenElements,

        dictButtonHeight: dictHeight,
        setDictButtonHeight: setDictHeight,

        dictButtonTop: dictTop,
        setDictButtonTop: setDictTop,

        resetOverlap: resetOverlap,

        updateOverlap: updateOverlap,
      }}
    >
      {children}
    </StoryScrollContext.Provider>
  );
}
