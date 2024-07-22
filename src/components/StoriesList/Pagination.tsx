"use client";

import { usePathname, useSearchParams } from "next/navigation";
import PaginationNumber from "./PaginationNumber";

interface Props {
  total_pages: number;
}

export default function Pagination({ total_pages }: Props) {
  const params = Object.fromEntries(useSearchParams().entries());
  if (!params.page) {
    params.page = "1";
  }
  const curr_page = parseInt(params.page);

  const pageList = createPageList(params, curr_page, total_pages);

  return (
    <>
      <ul className="inline-flex flex-wrap justify-center gap-4 align-middle text-lg text-sciquelMuted">
        <li>Page</li>
        {pageList}
      </ul>
    </>
  );
}

function createPageList(
  params: {
    [k: string]: string;
  },
  curr_page: number,
  total_pages: number,
) {
  const pageList = [];
  const offset = 2; // offset of pages before and after the current page

  if (curr_page !== 1) {
    pageList.push(
      <li className="w-fit">
        <a
          className="break-words"
          href={`${usePathname()}?${new URLSearchParams({
            ...params,
            page: String(curr_page - 1),
          }).toString()}`}
        >
          {"< Previous"}
        </a>
      </li>,
    );
  }

  if (curr_page - offset > 1) {
    pageList.push(
      <PaginationNumber params={params} page={1} curr_page={curr_page} />,
    );
  }

  if (curr_page - offset - 1 > 1) {
    pageList.push(<li>...</li>);
  }

  for (let page = curr_page - offset; page <= curr_page + offset; page++) {
    if (page < 1 || page > total_pages) {
      continue;
    }

    pageList.push(
      <PaginationNumber params={params} page={page} curr_page={curr_page} />,
    );
  }

  if (curr_page + offset + 1 < total_pages) {
    pageList.push(<li>...</li>);
  }

  if (curr_page + offset < total_pages) {
    pageList.push(
      <PaginationNumber
        params={params}
        page={total_pages}
        curr_page={curr_page}
      />,
    );
  }

  if (curr_page !== total_pages) {
    pageList.push(
      <li>
        <a
          href={`${usePathname()}?${new URLSearchParams({
            ...params,
            page: String(curr_page + 1),
          }).toString()}`}
        >
          {"Next >"}
        </a>
      </li>,
    );
  }

  return pageList;
}
