"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Search from "../search.svg";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery);
    if (encodedSearchQuery !== "") {
      router.push(`/search?keyword=${encodedSearchQuery}`);
    } else {
      router.push(`/search`);
    }
  };

  return (
    <>
      <Search className="h-[2rem] w-auto" />

      <form onSubmit={onSearch}>
        <label className="">
          <input
            className="w-24 border border-x-transparent
                 border-y-transparent bg-transparent outline-none
                  focus:border-b-white lg:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="sr-only">Search articles</span>
        </label>
      </form>
    </>
  );
}
