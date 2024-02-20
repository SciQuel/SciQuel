"use client";

import Link from "next/link";

export default function ArticleSeries() {
  return (
    <div className="sticky top-16 z-10 flex flex-col bg-sciquelTeal text-white">
      {/*Articles  */}
      <div
        className="flex h-auto flex-row px-40 text-center"
        // style={{ height: scroll ? "0" : "40px" }}
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
    </div>
  );
}
