"use client";

import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  total_pages: number;
}

export default function Pagination({ total_pages }: Props) {
  const params = Object.fromEntries(useSearchParams().entries());
  if (!params.page) {
    params.page = "1";
  }
  const page_number = parseInt(params.page);
  const pages = Array.from({ length: total_pages }, (_, i) => i + 1);

  return (
    <>
      <ul className="inline-flex justify-center gap-4 align-middle text-lg text-sciquelMuted">
        <li>Page</li>
        {page_number !== 1 && (
          <li>
            <a
              className=""
              href={`${usePathname()}?${new URLSearchParams({
                ...params,
                page: String(page_number - 1),
              }).toString()}`}
            >
              {"<"} Previous
            </a>
          </li>
        )}
        {pages.map((page) => (
          <li key={`pagination-item-${page}`}>
            <a
              className={
                (page === page_number
                  ? "bg-[#69A297] text-black"
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
        ))}
        {page_number !== total_pages && (
          <li>
            <a
              className=""
              href={`${usePathname()}?${new URLSearchParams({
                ...params,
                page: String(page_number + 1),
              }).toString()}`}
            >
              Next {">"}
            </a>
          </li>
        )}
      </ul>
    </>
  );
}
