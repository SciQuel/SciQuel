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
