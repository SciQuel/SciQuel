"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import logo from "./logo.png";
import MainSubHeader from "./MainSubHeader";
import ProfileButton from "./ProfileButton";
import Search from "./search.svg";
import SeriesSubHeader from "./SeriesSubHeader";
import SideBar from "./SideBar/SideBar";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

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
    <header className="sticky top-0 z-20 h-16 ">
      <div className="absolute flex h-[6.5rem] w-full flex-col text-white">
        <div className="pointer-events-none absolute top-0 z-20 flex w-full justify-center px-10 py-4 text-xl font-thin leading-[2rem]">
          <Image src={logo} className="h-[2rem] w-auto" alt="SciQuel" />
          <p>SCIQUEL</p>
        </div>
        <div className="absolute z-10 h-16 w-full bg-sciquelTeal">
          <div className="flex w-full flex-row gap-4 px-10 py-4 align-middle">
            <SideBar />
            <div className="top-0 flex">
              <Search className="h-[2rem] w-auto " />

              <form onSubmit={onSearch}>
                <input
                  className="w-auto border border-x-transparent border-y-transparent bg-transparent outline-none focus:border-b-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div className="h-[2rem] grow" />
            <ProfileButton />
          </div>
        </div>
        {pathname.split("/")[1] === "stories" ? (
          <SeriesSubHeader />
        ) : (
          <MainSubHeader />
        )}
      </div>
    </header>
  );
}
