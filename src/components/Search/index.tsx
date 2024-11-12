"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  searchParams: { [key: string]: string };
}
export default function Search({ searchParams }: Props) {
  const { keyword, type, date_from, date_to, sort_by } = searchParams;
  const [searchQuery, setSearchQuery] = useState(keyword);
  const [sort, setSort] = useState(sort_by);
  const [mediaType, setMediaType] = useState(type);
  const [dateFrom, setDateFrom] = useState(date_from);
  const [dateTo, setDateTo] = useState(date_to);
  const router = useRouter();
  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const keyword = searchQuery;
    const type = mediaType;
    const date_from = dateFrom;
    const date_to = dateTo;
    const sort_by = sort;
    const update = {
      ...(keyword ? { keyword } : {}),
      ...(type ? { type } : {}),
      ...(date_from ? { date_from } : {}),
      ...(date_to ? { date_to } : {}),
      ...(sort_by ? { sort_by } : {}),
    };
    const searchParams = new URLSearchParams(update);
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={onSearch}>
      <label className="mx-[10%] mb-3 mt-5 flex flex-col justify-center rounded-lg align-middle">
        <span className=" sr-only">Search term:</span>
        <input
          className="h-16 rounded-lg border border-black px-3 text-black outline-1 outline-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What are you searching for..."
        />
      </label>

      <div className="duration-350 z-10 mx-[10%] rounded-lg text-center transition-all">
        <div className=" flex flex-row flex-wrap justify-between gap-2">
          <label>
            Media Type
            <select
              className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1`}
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value=""
              ></option>
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value="essay"
              >
                Essay
              </option>
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value="digest"
              >
                Digest
              </option>
            </select>
          </label>
          <div className="flex flex-row flex-wrap gap-2">
            <span> Data Range: </span>
            <label>
              From
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>

            <label>
              {" "}
              To{" "}
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>
          <label>
            Sort By
            <select
              value={sort}
              defaultValue={sort}
              className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1`}
              onChange={(e) => setSort(e.target.value)}
            >
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value=""
              ></option>
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value="newest"
              >
                Newest
              </option>
              <option
                className={`mx-2 rounded-sm border-2 bg-slate-50 px-2 py-1 font-quicksand`}
                value="oldest"
              >
                Oldest
              </option>
            </select>
          </label>
        </div>
      </div>
      <div className="mx-[10%] flex items-center justify-center">
        <button
          className={`rounded-md bg-sciquelTeal px-2 py-1 text-xl text-white`}
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
}
