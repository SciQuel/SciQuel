"use client";

import Link from "next/link";

export default function SeriesSubHeader() {
  return (
    <div className="sticky top-16 flex h-auto flex-row bg-sciquelTeal text-center text-white lg:px-40">
      <div className="flex grow flex-row justify-between py-2">
        <span className="invisible">|</span>
        <Link
          href="/"
          className="decoration-[3px] underline-offset-[3px] hover:underline"
        >
          Name of Series
        </Link>
        <span className="">|</span>
      </div>

      <div className="grow py-2">
        <Link
          href="/"
          className="decoration-[3px] underline-offset-[3px] hover:underline"
        >
          Article 1
        </Link>
      </div>

      <div className="grow py-2">
        <Link
          href="/"
          className="decoration-[3px] underline-offset-[3px] hover:underline"
        >
          Article 2
        </Link>
      </div>

      <div className="grow py-2">
        <Link
          href="/"
          className="decoration-[3px] underline-offset-[3px] hover:underline"
        >
          Article 3
        </Link>
      </div>
    </div>
  );
}
