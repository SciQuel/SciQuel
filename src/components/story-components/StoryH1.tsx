"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "./PrintContext";

export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <h1
      className={`${
        isPrintMode
          ? "font-sourceSerif4 text-3xl"
          : "text-4xl text-sciquelTeal "
      } mx-auto w-full font-medium  md:w-[720px]`}
    >
      {children}
    </h1>
  );
}
