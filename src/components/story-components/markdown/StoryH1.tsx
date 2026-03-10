"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

// uses h1 markdown but needs to be h2 to fit page
// the actual h1 for the page should be the title
export default function StoryH1({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <h2
      className={`${
        isPrintMode
          ? "font-sourceSerif4 text-3xl"
          : "text-4xl text-sciquelTeal "
      } mx-auto mt-4 w-full font-medium  md:w-[768px]`}
    >
      {children}
    </h2>
  );
}
