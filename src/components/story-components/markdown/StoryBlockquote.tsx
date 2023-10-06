"use client";

import { useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryBlockquote({
  children,
}: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);
  const blockquoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // console.log(entry);
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
    );

    if (blockquoteRef.current && !isPrintMode) {
      observer.observe(blockquoteRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isPrintMode]);

  return (
    <blockquote
      ref={blockquoteRef}
      className={`${
        isPrintMode
          ? "h-fit w-screen justify-center py-3   [&>*]:text-2xl"
          : "h-fit min-h-screen w-screen items-center bg-gradient-to-b from-[#196E8C] to-[#65A69E] py-16 text-sciquelCardBg [&>*]:font-alegreyaSansSC [&>*]:text-5xl [&>*]:md:w-screen [&>*]:md:px-36"
      } mx-0  flex  text-center  [&>*]:px-2 `}
    >
      {children}
    </blockquote>
  );
}
