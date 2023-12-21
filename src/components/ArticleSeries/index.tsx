"use client";

import Link from "next/link";
import { useState } from "react";

export default function ArticleSeries() {
  const [scroll, setScroll] = useState(false);

  return (
    <div className="top-16 sticky z-20 flex flex-col bg-sciquelTeal text-white">
      {/*Articles  */}
      <div
        className=" duration-350 z-10 flex h-auto flex-row px-40 text-center transition-all"
        // style={{ height: scroll ? "0" : "40px" }}
      >
        <div
          className=" grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">Article 1</Link>
        </div>

        <div
          className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">Article 2</Link>
        </div>

        <div
          className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover"
          style={{ display: scroll ? "none" : "block" }}
        >
          <Link href="/">Article 3</Link>
        </div>
      </div>
    </div>
  );
}
