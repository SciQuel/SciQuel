"use client";

import { useContext, type PropsWithChildren } from "react";
import { PrintContext } from "../PrintContext";

// needs to be an h3
// technically all headers are bumped down a level
// there should only be 1 h1 per page
// so the actual h1 is reserved for the title
export default function StoryH2({ children }: PropsWithChildren<unknown>) {
  const isPrintMode = useContext(PrintContext);

  return (
    <h3
      className={`${
        isPrintMode ? "font-sourceSerif4 text-2xl" : "text-3xl text-sciquelTeal"
      } mx-auto mt-4 w-full font-medium md:w-[768px]`}
    >
      {children}
    </h3>
  );
}
