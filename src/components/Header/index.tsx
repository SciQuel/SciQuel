import Image from "next/image";
import logo from "./logo.png";
import search from "./search.svg";
import SideBar from "./SideBar/SideBar";

export default function Header() {
  return (
    <div className="flex flex-col bg-sciquelTeal text-white">
      <div className="absolute top-0 flex w-full justify-center px-10 py-4 text-xl font-thin leading-[2rem]">
        <Image src={logo} className="h-[2rem] w-auto" alt="SciQuel" />
        <p>SCIQUEL</p>
      </div>
      <div className="relative">
        <div className="flex w-full flex-row gap-4 px-10 py-4 align-middle">
          <SideBar />
          <div className="top-0 flex">
            <Image className="h-[2rem] w-auto" src={search} alt="searchIcon" />
            <input className=" w-auto border border-x-transparent border-y-transparent bg-transparent outline-none focus:border-b-white" />
          </div>
          <div className="h-[2rem] grow" />
          <a href="#" className="font-bold leading-[2rem]">
            LOGIN
          </a>
        </div>
      </div>
      <div className="flex flex-row px-40 text-center">
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          LATEST
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          READ
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          TOPIC
        </div>
        <div className="grow cursor-pointer py-2 transition-colors hover:bg-sciquelHover">
          ABOUT
        </div>
      </div>
    </div>
  );
}
