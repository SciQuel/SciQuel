"use client";

import Link from "next/link";
import useScrollDirection from "../useScrollDirection";

export default function SeriesSubHeader() {
  const isScrollingUp = useScrollDirection();

  return (
    <div
      className={`sticky flex h-auto flex-row bg-sciquelTeal px-40 text-center text-white transition-all duration-500
      ${isScrollingUp ? "top-16" : "top-6"}`}
    >
      <div className="flex grow flex-row justify-between py-2">
        <span className="invisible">|</span>
        <Link href="/" className="hover:underline">
          Name of Series
        </Link>
        <span className="opacity-50">|</span>
      </div>

      <div className="grow py-2">
        <Link href="/" className="hover:underline">
          Article 1
        </Link>
      </div>

      <div className="grow py-2">
        <Link href="/" className="hover:underline">
          Article 2
        </Link>
      </div>

      <div className="grow py-2">
        <Link href="/" className="hover:underline">
          Article 3
        </Link>
      </div>
    </div>
  );
}
