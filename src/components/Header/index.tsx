/* eslint-disable isaacscript/complete-sentences-jsdoc */

import LogoLink from "./LogoLink/LogoLink";
import MainSubHeader from "./MainSubHeader";
import SearchBar from "./SearchBar/SearchBar";
// import ProfileButton from "./ProfileButton";
// import SeriesSubHeader from "./SeriesSubHeader";
import SideBar from "./SideBar/SideBar";
import TempProfileHeading from "./TempProfile/TempProfile";

export default function Header() {
  return (
    <header className=" sticky top-0 z-20 flex h-16 w-screen flex-col font-quicksand text-white ">
      <div className="absolute z-20 h-16  w-full bg-sciquelTeal">
        <div
          className="pointer-events-none absolute top-0 flex h-16 w-full items-center justify-end px-6 py-2
         text-xl font-thin leading-[2rem] sm:px-10 md:justify-center"
        >
          <LogoLink />
        </div>
        <div className="flex w-full flex-row gap-4 px-4 py-[0.8rem] align-middle xs:px-10">
          <SideBar />
          <div className="top-0 hidden pt-1 sm:flex">
            {/* <Search className="h-[2rem] w-auto" />

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
            </form> */}
            <SearchBar />
          </div>
          <div className="h-[2rem] grow" />
          {/* <ProfileButton /> */}
          <TempProfileHeading />
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
