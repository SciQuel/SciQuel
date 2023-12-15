"use client";

import {
  useContext,
  useEffect,
  useReducer,
  useRef,
  type PropsWithChildren,
} from "react";
import { DictionaryContext } from "../dictionary/DictionaryContext";
import { PrintContext } from "../PrintContext";
import { getOffset, scale, StoryScrollContext } from "../scroll/ScrollProvider";

interface ReducerArgs {
  type: "reset" | "update" | "set";
  figureVal: number;
}

export default function StoryBlockquote({
  children,
}: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);
  const dictionaryInfo = useContext(DictionaryContext);
  const ScrollContext = useContext(StoryScrollContext);

  const [width, widthDispatch] = useReducer(
    (state: number, action: ReducerArgs) => {
      if (ScrollContext && blockquoteRef.current) {
        switch (action.type) {
          case "reset":
            ScrollContext.resetOverlap(blockquoteRef);
            return 0;

          case "set":
            ScrollContext.updateOverlap(
              getOffset(action.figureVal),
              blockquoteRef,
            );

            return action.figureVal;

          case "update":
            const dictTop = ScrollContext.dictButtonTop;
            const dictBottom =
              ScrollContext.dictButtonTop + ScrollContext.dictButtonHeight;
            const dictHeight = ScrollContext.dictButtonHeight;

            const rect = blockquoteRef.current.getBoundingClientRect();
            const blockTop = rect.top;
            const blockBottom = rect.bottom;

            const totalOffset = state;

            if (blockTop > dictBottom || blockBottom < dictTop) {
              // block is not touching dictionary button
              ScrollContext.resetOverlap(blockquoteRef);
            } else if (blockTop > dictTop) {
              // top is overlapping
              let overlapPercent = (blockTop - dictTop) / dictHeight;
              let newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);
              ScrollContext.updateOverlap(newOverlap, blockquoteRef);
              return state;
            } else if (blockBottom < dictBottom) {
              // bottom is overlapping

              let overlapPercent = (dictBottom - blockBottom) / dictHeight;
              let newOverlap = scale(1 - overlapPercent, 0, 1, 0, totalOffset);
              ScrollContext.updateOverlap(newOverlap, blockquoteRef);
              return state;
            } else {
              // full overlap
              ScrollContext.updateOverlap(totalOffset, blockquoteRef);
              return state;
            }
        }
      }
      return state;
    },
    0,
  );

  const resizeObserver = useRef(
    new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        console.log("resized in blockquote!");
        if (entry.contentRect.width > 768 && blockquoteRef.current) {
          console.log("blockquote overflows!");
          scrollObserver.current.observe(blockquoteRef.current);
          widthDispatch({
            type: "set",
            figureVal: getOffset(entry.contentRect.width),
          });
        } else {
          scrollObserver.current.disconnect();
          widthDispatch({ type: "reset", figureVal: 0 });
        }
      });
    }),
  );

  const scrollObserver = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", onScroll);
          } else {
            window.removeEventListener("scroll", onScroll);
          }
        });
      },
      { threshold: 0.05 },
    ),
  );

  const animationObserver = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            blockquoteRef.current &&
            blockquoteRef.current.clientHeight <= window.innerHeight
          ) {
            blockquoteRef.current.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }
        });
      },
      { threshold: 0.3 },
    ),
  );
  useEffect(() => {
    if (dictionaryInfo?.open) {
      animationObserver.current.disconnect();
    } else if (blockquoteRef.current) {
      animationObserver.current.observe(blockquoteRef.current);
    }

    return () => {
      animationObserver.current.disconnect();
    };
  }, [dictionaryInfo?.open]);

  useEffect(() => {
    if (blockquoteRef.current && !isPrintMode) {
      animationObserver.current.observe(blockquoteRef.current);
      scrollObserver.current.observe(blockquoteRef.current);
      resizeObserver.current.observe(blockquoteRef.current);
    } else if (isPrintMode) {
      resizeObserver.current.disconnect();
      animationObserver.current.disconnect();
      scrollObserver.current.disconnect();
    }

    return () => {
      animationObserver.current.disconnect();
      scrollObserver.current.disconnect();
      resizeObserver.current.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isPrintMode]);

  function onScroll(e: Event) {
    console.log("in blockquote scroll listener!");
    console.log(ScrollContext?.dictButtonTop);
    console.log(blockquoteRef.current?.getBoundingClientRect());
    if (ScrollContext && blockquoteRef.current) {
      widthDispatch({ type: "update", figureVal: 0 });
    }
  }

  return (
    <blockquote
      ref={blockquoteRef}
      className={`${
        isPrintMode
          ? "h-fit w-screen justify-center py-3   [&>*]:text-2xl"
          : "h-fit min-h-screen w-screen items-center bg-gradient-to-b from-[#196E8C] to-[#65A69E] py-16 text-sciquelCardBg [&>*]:font-alegreyaSansSC [&>*]:text-5xl [&>*]:md:w-full [&>*]:md:px-36"
      } relative flex justify-self-start  text-center  [&>*]:px-2 `}
    >
      {children}
    </blockquote>
  );
}
