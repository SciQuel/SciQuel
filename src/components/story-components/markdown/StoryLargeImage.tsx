"use client";

import {
  useContext,
  useEffect,
  useReducer,
  useRef,
  type PropsWithChildren,
} from "react";
import { PrintContext } from "../PrintContext";
import {
  getOffset,
  scale,
  StoryScrollContext,
  type OnScreenElements,
} from "../scroll/ScrollProvider";

interface Props {
  src: string;
  alt?: string;
}

interface ReducerArgs {
  type: "reset" | "update screen" | "set";
  figureVal: number;
}

export default function StoryLargeImage({
  src,
  alt,
  children,
}: PropsWithChildren<Props>) {
  const isPrintMode = useContext(PrintContext);
  const storyScrollInfo = useContext(StoryScrollContext);
  const figureRef = useRef<HTMLElement>(null);

  const resizeRef = useRef<ResizeObserver | null>(null);
  const intersectionRef = useRef<IntersectionObserver | null>(null);
  const scrollObserveRef = useRef(false);

  function overlapReducer(state: number, action: ReducerArgs): number {
    console.log("in overlap reducer");
    if (storyScrollInfo && figureRef.current) {
      let newState = state > 0 ? state : figureRef.current.clientWidth;

      switch (action.type) {
        case "set":
          storyScrollInfo.updateOverlap(getOffset(action.figureVal), figureRef);
          return action.figureVal;
        case "reset":
          // if (storyScrollInfo.inViewElements.length == 0) {
          //   return 0;
          // }

          storyScrollInfo.resetOverlap(figureRef);

          return 0;

        case "update screen":
          const figureRect = figureRef.current.getBoundingClientRect();

          const figureBottom = figureRect.top + figureRect.height;
          const dictButtonBottom =
            storyScrollInfo.dictButtonHeight + storyScrollInfo.dictButtonTop;

          const totalOffset = state;

          if (
            figureBottom < storyScrollInfo.dictButtonTop ||
            figureRect.top > dictButtonBottom
          ) {
            // there is no overlap

            storyScrollInfo.resetOverlap(figureRef);

            return state;
          } else {
            // we have some mid value

            if (figureRect.top > storyScrollInfo.dictButtonTop) {
              // the top of image intersects still

              let overlapPercent =
                (figureRect.top - storyScrollInfo.dictButtonTop) /
                storyScrollInfo.dictButtonHeight;

              let newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);
              storyScrollInfo.updateOverlap(newOverlap, figureRef);
              return state;
            } else if (figureBottom < dictButtonBottom) {
              // the bottom of the image intersects still

              let overlapPercent =
                (dictButtonBottom - figureBottom) /
                storyScrollInfo.dictButtonHeight;

              let newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);

              storyScrollInfo.updateOverlap(newOverlap, figureRef);
              return state;
            } else {
              storyScrollInfo.updateOverlap(totalOffset, figureRef);
              return state;
            }
          }
      }
    }
    return state;
  }
  const [overflow, overlapDispatch] = useReducer(overlapReducer, 0);

  useEffect(() => {
    if (figureRef.current) {
      if (!resizeRef.current) {
        resizeRef.current = new ResizeObserver(checkResize);
      }

      resizeRef.current.observe(figureRef.current);
    }

    return () => {
      if (intersectionRef.current) {
        intersectionRef.current.disconnect();
      }
      if (resizeRef.current) {
        resizeRef.current.disconnect();
      }
      if (scrollObserveRef.current == true) {
        document.removeEventListener("scroll", onscreenScroll);
      }
    };
  }, []);

  function checkResize(entries: ResizeObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.contentRect.width > 768 && figureRef.current) {
        //entry has overflow so we should bother observing it?

        if (intersectionRef.current) {
          intersectionRef.current.observe(figureRef.current);
        } else {
          intersectionRef.current = new IntersectionObserver(
            checkIntersection,
            {
              rootMargin: "30px",
            },
          );

          intersectionRef.current.observe(figureRef.current);
        }

        overlapDispatch({
          type: "set",
          figureVal: getOffset(entry.contentRect.width),
        });
      } else {
        // entry is too small?
        // make sure we don't bother observing it?
        if (intersectionRef.current) {
          intersectionRef.current.disconnect();
        }
        overlapDispatch({ type: "reset", figureVal: 0 });
      }
    });
  }

  function checkIntersection(
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver,
  ) {
    entries.forEach((entry) => {
      if (figureRef.current && figureRef.current.clientWidth < 768) {
        observer.disconnect();
      }

      if (entry.isIntersecting) {
        if (scrollObserveRef.current == false) {
          scrollObserveRef.current = true;

          document.addEventListener("scroll", onscreenScroll);
        }
      } else if (scrollObserveRef.current == true) {
        document.removeEventListener("scroll", onscreenScroll);
        scrollObserveRef.current = false;
      }
    });
  }

  function onscreenScroll(e: Event) {
    if (figureRef.current) {
      overlapDispatch({ type: "update screen", figureVal: 0 });
    }
  }

  return (
    <div className="flex justify-center">
      <figure
        className="mx-auto table gap-2 p-8 lg:w-min lg:p-0"
        ref={figureRef}
      >
        <img
          src={src}
          className={`${
            isPrintMode ? "md:max-w-[768px]" : "lg:max-w-[1000px]"
          } max-w-screen max-h-[900px] w-auto`}
          alt={alt}
        />
        <figcaption className="table-caption w-full caption-bottom px-8 font-sourceSerif4 lg:px-0">
          {children}
        </figcaption>
      </figure>
    </div>
  );
}
