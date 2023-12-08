"use client";

import { useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { DictionaryContext } from "../dictionary/DictionaryContext";
import { PrintContext } from "../PrintContext";

export default function StoryBlockquote({
  children,
}: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);
  const dictionaryInfo = useContext(DictionaryContext);
  const observer = useRef(
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
      observer.current.disconnect();
    } else if (blockquoteRef.current) {
      observer.current.observe(blockquoteRef.current);
    }

    return () => {
      observer.current.disconnect();
    };
  }, [dictionaryInfo?.open]);

  useEffect(() => {
    if (blockquoteRef.current && !isPrintMode) {
      observer.current.observe(blockquoteRef.current);
    }

    return () => {
      observer.current.disconnect();
    };
  }, [isPrintMode]);

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
