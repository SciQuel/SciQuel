"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArticleSeries() {
  const isScrollingUp = useScrollDirection();

  return (
    <div
      className={`sticky z-10 flex flex-col bg-sciquelTeal text-white transition-all duration-500 ${
        isScrollingUp ? "top-16" : "-top-28"
      }`}
    >
      {/*Articles  */}
      <div className="flex h-auto flex-row px-40 text-center">
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

function useScrollDirection(): boolean {
  const [isScrollingUp, setIsScrollingUp] = useState<boolean>(true);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const scrollingUp = scrollY < prevScrollY;
      // Buffer to exclude small scroll events
      if (
        scrollingUp !== isScrollingUp &&
        Math.abs(scrollY - prevScrollY) > 8
      ) {
        setIsScrollingUp(scrollingUp);
      }
      prevScrollY = scrollY > 0 ? scrollY : 0;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [isScrollingUp]);

  return isScrollingUp;
}
