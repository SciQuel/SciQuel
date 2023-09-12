"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  searchParams: { [key: string]: string };
}

export default function Search({ searchParams }: Props) {
  const { id, category } = searchParams;
  const router = useRouter();
  console.log("category ", category);
  const [cates, setCates] = useState(category);
  function switchCat(current: string) {
    setCates(current);
    const category = cates;
    const update = {
      ...(category ? { category } : {}),
    };
    const searchParams = new URLSearchParams(update);
    router.push(`/profile?${searchParams.toString()}`);
  }
  return (
    <div className="flex flex-row gap-4 text-left text-2xl uppercase ">
      <button
        className="text-whit rounded border  px-3 py-1  outline"
        style={{
          backgroundColor: cates == "Recent" ? "#A3C9A8" : "#344E41",
          color: cates == "Recent" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("Recent")}
      >
        Recent
      </button>
      <button
        className="text-whit rounded border  px-3 py-1  outline"
        style={{
          backgroundColor: cates === "Staff Picks" ? "#A3C9A8" : "#344E41",
          color: cates === "Staff Picks" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("Staff Picks")}
      >
        Staff Picks
      </button>
      <button
        className="text-whit rounded border  px-3 py-1 outline"
        style={{
          backgroundColor: cates === "Trending" ? "#A3C9A8" : "#344E41",
          color: cates === "Trending" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("Trending")}
      >
        Trending
      </button>
    </div>
  );
}
