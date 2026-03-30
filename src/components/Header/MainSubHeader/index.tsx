"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
// import Topic from "../Topic/Topic";
import useScrollDirection from "../useScrollDirection";

export default function MainSubHeader() {
  const isScrollingUp = useScrollDirection();
  const heightRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isStoryPage = useMemo(() => {
    if (!pathname) {
      return false;
    }
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] !== "stories") {
      return false;
    }
    const [year, month, day, slug] = segments.slice(1);
    const isYearValid = year ? /^\d{4}$/.test(year) : false;
    const isMonthValid = month ? /^\d{1,2}$/.test(month) : false;
    const isDayValid = day ? /^\d{1,2}$/.test(day) : false;
    const hasSlug = Boolean(slug);
    return isYearValid && isMonthValid && isDayValid && hasSlug;
  }, [pathname]);

  const translationClass = isStoryPage
    ? isScrollingUp
      ? "translate-y-16"
      : "-translate-y-16"
    : "translate-y-16";
  // const [totalTop, setTotalTop] = useState("-50px");
  return (
    <nav
      ref={heightRef}
      className={`absolute top-0 flex h-fit w-screen flex-row flex-wrap bg-sciquelTeal  text-center text-white transition-transform duration-500 lg:px-40
      ${translationClass}`}
    >
      <Link
        className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover"
        href="/stories/latest"
      >
        LATEST
      </Link>

      <Link
        className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover"
        href="/stories/read"
      >
        READ
      </Link>

      {/* <div className="grow cursor-pointer py-2 hover:bg-sciquelHover">
        <Topic />
      </div> */}

      <Link
        className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover"
        href="/about"
      >
        ABOUT
      </Link>

      <Link
        className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover"
        href="/leave-feedback"
      >
        CONTACT
      </Link>

      <Link
        className="grow cursor-pointer px-4 py-2 hover:bg-sciquelHover"
        href="/get-involved"
      >
        GET INVOLVED
      </Link>
    </nav>
  );
}
