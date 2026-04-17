"use client";

import { usePathname } from "next/navigation";

interface Props {
  params: {
    [k: string]: string;
  };
  page: number; // the page number to be rendered
  curr_page: number; // the page number of current page
}

export default function PaginationNumber({ params, page, curr_page }: Props) {
  return (
    <li key={`pagination-item-${page}`}>
      <a
        className={
          (page === curr_page
            ? "bg-sciquelTeal text-white"
            : "transition-all duration-300 hover:bg-neutral-100") +
          " rounded-full px-3.5 py-1.5"
        }
        href={`${usePathname()}?${new URLSearchParams({
          ...params,
          page: String(page),
        }).toString()}`}
      >
        {page}
      </a>
    </li>
  );
}
