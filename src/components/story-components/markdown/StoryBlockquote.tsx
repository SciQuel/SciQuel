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
import {
  DispatchAction,
  getOffset,
  scale,
  StoryScrollContext,
} from "../scroll/ScrollProvider";

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

  const overlapFunction = ScrollContext
    ? ScrollContext.overlapReducer
    : (state: number, action: DispatchAction) => {
        return state;
      };

  const [width, widthDispatch] = useReducer(overlapFunction, 0);

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
            elementRef: blockquoteRef,
          });
        } else {
          scrollObserver.current.disconnect();
          widthDispatch({ type: "reset", elementRef: blockquoteRef });
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
      widthDispatch({
        type: "update",
        figureVal: 0,
        elementRef: blockquoteRef,
      });
    }
  }

  return (
    <blockquote
      ref={blockquoteRef}
      className={`${
        isPrintMode
          ? "h-fit w-screen justify-center py-3   [&>*]:text-2xl"
          : "my-8 h-fit min-h-screen w-screen items-center bg-gradient-to-b from-[#196E8C] to-[#65A69E] py-16 text-sciquelCardBg [&>*]:font-alegreyaSansSC [&>*]:text-5xl [&>*]:md:w-full [&>*]:md:px-36"
      } relative flex justify-self-start  text-center  [&>*]:px-2 `}
    >
      {children}
    </blockquote>
  );
}
