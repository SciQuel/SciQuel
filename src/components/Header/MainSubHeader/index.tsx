"use client";

import Link from "next/link";
import Topic from "../Topic/Topic";
import useScrollDirection from "../useScrollDirection";

export default function MainSubHeader() {
  const isScrollingUp = useScrollDirection();

  return (
    <div
      className={`sticky flex h-auto flex-row bg-sciquelTeal px-40 text-center text-white transition-all duration-500
      ${isScrollingUp ? "top-16" : "top-6"}`}
    >
      <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Link href="/">LATEST</Link>
      </div>

      <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Link href="/">READ</Link>
      </div>

      <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Topic />
      </div>

      <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Link href="/">ABOUT</Link>
      </div>
    </div>
  );
}
