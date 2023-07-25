"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  query: string;
}
export default function Search({ query }: Props) {
  const [searchQuery, setSearchQuery] = useState(decodeURI(query));
  const router = useRouter();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search/${encodedSearchQuery}`);
  };
  return (
    <form
      className="my-5 flex justify-center rounded-lg align-middle"
      onSubmit={onSearch}
    >
      <input
        className=" h-16 w-2/3 rounded-lg border border-black px-3 text-black outline-1 outline-black"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="What are you searching for..."
      />
    </form>
  );
}
