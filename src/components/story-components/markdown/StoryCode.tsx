"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryCode({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <code
      className={`${
        isPrintMode ? "text-slate-800" : "bg-cyan-700 text-zinc-100"
        // -slate-500
      } mx-auto w-full rounded  px-2 py-1 font-mono  font-medium md:w-[768px]`}
    >
      {children}
    </code>
  );
}
