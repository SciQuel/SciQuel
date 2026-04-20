"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  searchParams: { [key: string]: string };
  slug: string;
}

export default function Search({ searchParams, slug }: Props) {
  const { category } = searchParams;
  const router = useRouter();
  const [cates, setCates] = useState(category ? category : "recent");

  console.log("category ", category);

  function switchCat(current: string) {
    const category = current;
    setCates(category);
    const update = {
      ...(category ? { category } : {}),
    };
    const searchParams = new URLSearchParams(update);
    router.push(`/profile/${slug}?${searchParams.toString()}`);
  }
  return (
    <div className="flex flex-row gap-4 text-left text-2xl uppercase ">
      <button
        className="text-whit rounded border  px-3 py-1  outline"
        style={{
          backgroundColor: cates == "recent" ? "#A3C9A8" : "#344E41",
          color: cates == "recent" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("recent")}
      >
        Recent
      </button>
      <button
        className="text-whit rounded border  px-3 py-1  outline"
        style={{
          backgroundColor: cates === "staff_picks" ? "#A3C9A8" : "#344E41",
          color: cates === "staff_picks" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("staff_picks")}
      >
        Staff Picks
      </button>
      {/* <button
        className="text-whit rounded border  px-3 py-1 outline"
        style={{
          backgroundColor: cates === "Trending" ? "#A3C9A8" : "#344E41",
          color: cates === "Trending" ? "#344E41" : "#FFFFFF",
        }}
        onClick={() => switchCat("Trending")}
      >
        Trending
      </button> */}
    </div>
  );
}
