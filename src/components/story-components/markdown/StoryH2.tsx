"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

export default function StoryH2({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <h2
      className={`${
        isPrintMode ? "font-sourceSerif4 text-2xl" : "text-3xl text-sciquelTeal"
      } mx-auto mt-8 w-full font-medium md:w-[768px]`}
    >
      {children}
    </h2>
  );
}
