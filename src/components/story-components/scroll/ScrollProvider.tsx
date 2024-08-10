"use client";

import {
  createContext,
  // useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  // Ref,
  type RefObject,
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

export interface DispatchAction {
  type: "reset" | "update" | "set";

  figureVal?: number;

  elementRef: RefObject<HTMLElement>;
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

  overlapReducer: (state: number, action: DispatchAction) => number;
}

export const StoryScrollContext = createContext<ScrollProviderVals | null>(
  null,
);

export function StoryScrollProvider({ children }: PropsWithChildren) {
  const [dictTop, setDictTop] = useState(0);

  const [dictHeight, setDictHeight] = useState(0);

  const [screenElements, setScreenElements] = useState<OnScreenElements[]>([]);

  function resetOverlap(figureRef: RefObject<HTMLElement>) {
    setScreenElements((state: OnScreenElements[]) => {
      let newArray: OnScreenElements[] = state;
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
        setScreenElements((state: OnScreenElements[]) => {
          let itemIndex = -1;
          const newList = [...state];
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

  function checkOverlap(elementRef: RefObject<HTMLElement>): boolean {
    const elementRect = elementRef.current?.getBoundingClientRect();
    const dictBottom = dictHeight + dictTop;
    if (!elementRect || elementRect.width < 768) {
      return false;
    } else if (elementRect.top < dictBottom && elementRect.bottom > dictTop) {
      return true;
    }

    return false;
  }

  function updateReducer(state: number, action: DispatchAction): number {
    switch (action.type) {
      case "reset":
        resetOverlap(action.elementRef);
        return 0;

      case "set":
        if (action.figureVal) {
          const isOverlapping = checkOverlap(action.elementRef);

          if (isOverlapping || action.figureVal == 0) {
            updateOverlap(getOffset(action.figureVal), action.elementRef);
          }

          return action.figureVal;
        } else {
          return state;
        }

      case "update":
        const dictBottom = dictTop + dictHeight;

        const figureRect = action.elementRef.current?.getBoundingClientRect();
        if (!figureRect) {
          return state;
        }

        const figureTop = figureRect.top - dictHeight;
        const figureBottom = figureRect.bottom + dictHeight;

        const totalOffset = state;

        if (figureTop > dictBottom || figureBottom < dictTop) {
          // block is not touching dictionary button
          resetOverlap(action.elementRef);
          return state;
        } else if (figureTop > dictTop) {
          // top is overlapping
          const overlapPercent = (figureTop - dictTop) / dictHeight;
          const newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);
          updateOverlap(newOverlap, action.elementRef);
          return state;
        } else if (figureBottom < dictBottom) {
          // bottom is overlapping

          const overlapPercent = (dictBottom - figureBottom) / dictHeight;
          const newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);
          updateOverlap(newOverlap, action.elementRef);
          return state;
        } else {
          // full overlap
          updateOverlap(totalOffset, action.elementRef);
          return state;
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

        overlapReducer: updateReducer,
      }}
    >
      {children}
    </StoryScrollContext.Provider>
  );
}
