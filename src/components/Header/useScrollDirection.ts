"use client";

import { useEffect, useState } from "react";

export default function useScrollDirection(): boolean {
  const [isScrollingUp, setIsScrollingUp] = useState<boolean>(true);

  useEffect(() => {
    let prevScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const scrollingUp = scrollY < prevScrollY;
      // Show header at the top of the page (fixes problem with Safari browser)
      if (scrollY <= 2) {
        setIsScrollingUp(true);
      } else if (scrollingUp !== isScrollingUp) {
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
