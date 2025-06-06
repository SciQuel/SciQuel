/* eslint-disable isaacscript/complete-sentences-jsdoc */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SciquelLogo from "../../../public/assets/images/logoWithNameOnSide.svg";
import MainSubHeader from "./MainSubHeader";
import ProfileButton from "./ProfileButton";
import Search from "./search.svg";
// import SeriesSubHeader from "./SeriesSubHeader";
import SideBar from "./SideBar/SideBar";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  // const pathname = usePathname();

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
    <header className=" sticky top-0 z-20 flex h-16 w-screen flex-col font-quicksand text-white ">
      <div className="absolute z-20 h-16  w-full bg-sciquelTeal">
        <div
          className="pointer-events-none absolute top-0 flex h-16 w-full items-center justify-end px-6 py-2
         text-xl font-thin leading-[2rem] sm:px-10 md:justify-center"
        >
          <Link className=" pointer-events-auto" href="/">
            <SciquelLogo className="h-8 w-auto fill-white sm:h-10" />
            <span className="sr-only">Go to home page</span>
          </Link>
        </div>
        <div className="flex w-full flex-row gap-4 px-4 py-[0.8rem] align-middle xs:px-10">
          <SideBar />
          <div className="top-0 hidden pt-1 sm:flex">
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
          </div>
          <div className="h-[2rem] grow" />
          {/* <ProfileButton /> */}
        </div>
      </div>
      {/* {pathname.split("/")[1] === "stories" ? (
          <SeriesSubHeader />
        ) : (
          <MainSubHeader />
        )} */}
      <MainSubHeader />
    </header>
  );
}
