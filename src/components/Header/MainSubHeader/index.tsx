"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Topic from "../Topic/Topic";
import useScrollDirection from "../useScrollDirection";

export default function MainSubHeader() {
  const isScrollingUp = useScrollDirection();
  const heightRef = useRef<HTMLDivElement>(null);
  const [totalTop, setTotalTop] = useState("-50px");
  return (
    <div
      ref={heightRef}
      className={`absolute top-0 flex h-fit w-screen flex-row flex-wrap bg-sciquelTeal  text-center text-white transition-transform duration-500 lg:px-40
      ${isScrollingUp ? "translate-y-16" : "-translate-y-16"}`}
    >
      <div className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover">
        <Link href="/stories/latest">LATEST</Link>
      </div>

      <div className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover">
        <Link href="/stories/read">READ</Link>
      </div>

      {/* <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Topic />
      </div> */}

      <div className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover">
        <Link href="/">ABOUT</Link>
      </div>

      <div className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover">
        <Link href="/leave-feedback">CONTACT</Link>
      </div>

      <div className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover">
        <Link href="/get-involved">GET INVOLVED</Link>
      </div>
    </div>
  );
}
