"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  searchParams: { [key: string]: string | undefined };
}
export default function Search({ searchParams }: Props) {
  console.log("searchParams", searchParams);
  const { keyword, type, date_from, date_to, sort_by } = searchParams;
  console.log("keyword", keyword);
  const [searchQuery, setSearchQuery] = useState(keyword);
  const [sort, setSort] = useState(sort_by);
  const [mediaType, setMediaType] = useState(type);
  const [dateFrom, setDateFrom] = useState(date_from);
  const [dateTo, setDateTo] = useState(date_to);
  const router = useRouter();
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("type", type);
    const hi = { searchQuery, mediaType, dateFrom, dateTo, sort };
    const path = filterRoute(hi);
    // console.log("keyword", searchQuery);
    console.log("path", path);
    // const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?${path}`);
    // router.push(`/search?keyword=${encodedSearchQuery}`);
  };

  return (
    <div>
      <form
        className="mx-[10%] mt-5 flex flex-col justify-center rounded-lg align-middle"
        onSubmit={onSearch}
      >
        <input
          className="h-16 rounded-lg border border-black px-3 text-black outline-1 outline-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you searching for..."
        />
      </form>

      <div className="duration-350 z-10 mx-[10%] rounded-lg text-center transition-all">
        <div className=" flex flex-row justify-between">
          <div>
            Media Type
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value=""></option>
              <option value="essay">Essay</option>
              <option value="digest">Digest</option>
            </select>
          </div>
          <div>
            <form>
              <label> Data Range: </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <label> To </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </form>
          </div>
          <div>
            Sort By
            <select
              value={sort}
              defaultValue={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value=""></option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
type ParameterType = {
  searchQuery: string | undefined;
  mediaType: string | undefined;
  dateFrom: string | undefined;
  dateTo: string | undefined;
  sort: string | undefined;
};

function filterRoute({
  searchQuery,
  mediaType,
  dateFrom,
  dateTo,
  sort,
}: ParameterType) {
  const fillQuery =
    searchQuery != undefined ? `keyword=${encodeURI(searchQuery)}` : ``;
  const fillType = mediaType != undefined ? `type=${mediaType}` : ``;
  const fillSort = sort != undefined ? `sort_by=${sort}` : ``;

  let filterDate = ``;
  if (dateFrom != undefined && dateTo != undefined) {
    filterDate = `date_from=${dateFrom}&date_to=${dateTo}`;
  } else {
    if (dateFrom != undefined) {
      filterDate = `date_from=${dateFrom}`;
    } else if (dateTo != undefined) {
      filterDate = `date_to=${dateTo}`;
    } else {
      filterDate = ``;
    }
  }

  let route = ``;
  if (fillQuery != `` && fillType != `` && filterDate != `` && fillSort != ``) {
    route = `${fillQuery}&${fillType}&${filterDate}&${fillSort}`;
  } else if (
    fillQuery != `` &&
    fillType != `` &&
    filterDate != `` &&
    fillSort == ``
  ) {
    route = `${fillQuery}&${fillType}&${filterDate}`;
  } else if (
    fillQuery != `` &&
    fillType != `` &&
    filterDate == `` &&
    fillSort != ``
  ) {
    route = `${fillQuery}&${fillType}&${fillSort}`;
  } else if (
    fillQuery != `` &&
    fillType != `` &&
    filterDate == `` &&
    fillSort == ``
  ) {
    route = `${fillQuery}&${fillType}`;
  } else if (
    fillQuery != `` &&
    fillType == `` &&
    filterDate != `` &&
    fillSort != ``
  ) {
    route = `${fillQuery}&${filterDate}&${fillSort}`;
  } else if (
    fillQuery != `` &&
    fillType == `` &&
    filterDate != `` &&
    fillSort == ``
  ) {
    route = `${fillQuery}&${filterDate}`;
  } else if (
    fillQuery != `` &&
    fillType == `` &&
    filterDate == `` &&
    fillSort != ``
  ) {
    route = `${fillQuery}&${fillSort}`;
  } else if (
    fillQuery != `` &&
    fillType == `` &&
    filterDate == `` &&
    fillSort == ``
  ) {
    route = `${fillQuery}`;
  } else if (
    fillQuery == `` &&
    fillType != `` &&
    filterDate != `` &&
    fillSort != ``
  ) {
    route = `${fillType}&${filterDate}&${fillSort}`;
  } else if (
    fillQuery == `` &&
    fillType != `` &&
    filterDate != `` &&
    fillSort == ``
  ) {
    route = `${fillType}&${filterDate}`;
  } else if (
    fillQuery == `` &&
    fillType != `` &&
    filterDate == `` &&
    fillSort != ``
  ) {
    route = `${fillType}&${fillSort}`;
  } else if (
    fillQuery == `` &&
    fillType != `` &&
    filterDate == `` &&
    fillSort == ``
  ) {
    route = `${fillType}`;
  } else if (
    fillQuery == `` &&
    fillType == `` &&
    filterDate != `` &&
    fillSort != ``
  ) {
    route = `${filterDate}&${fillSort}`;
  } else if (
    fillQuery == `` &&
    fillType == `` &&
    filterDate != `` &&
    fillSort == ``
  ) {
    route = `${filterDate}`;
  } else if (
    fillQuery == `` &&
    fillType == `` &&
    filterDate == `` &&
    fillSort != ``
  ) {
    route = `${fillSort}`;
  } else {
    route = ``;
  }
  console.log("client side route ", route);
  return route;
}
