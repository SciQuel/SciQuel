import Image from "next/image";
import logo from "./logo.png";
import searchIcon from "./search.svg";

export default function Header() {
  return (
    <div className="bg-sciquelTeal flex flex-col text-white">
      <div className="absolute top-0 flex w-full justify-center px-10 py-4 text-xl font-thin leading-[2rem]">
        <Image src={logo} className="h-[2rem] w-auto" alt="SciQuel" />
        <p>SCIQUEL</p>
      </div>
      <div className="relative">
        <div className="flex w-full flex-row gap-4 px-10 py-4 align-middle">
          <button className="h-[2rem]">
            <i className="symbol text-2xl leading-[2rem]">menu</i>
          </button>
          <button className="h-[2rem]">
            <i className="symbol text-2xl leading-[2rem]">search</i>
          </button>
          <div className="h-[2rem] grow" />
          <a href="#" className="font-bold leading-[2rem]">
            LOGIN
          </a>
        </div>
      </div>
      <div className="flex flex-row px-40 text-center">
        <div className="hover:bg-sciquelHover grow cursor-pointer py-2 transition-colors">
          LATEST
        </div>
        <div className="hover:bg-sciquelHover grow cursor-pointer py-2 transition-colors">
          READ
        </div>
        <div className="hover:bg-sciquelHover grow cursor-pointer py-2 transition-colors">
          TOPIC
        </div>
        <div className="hover:bg-sciquelHover grow cursor-pointer py-2 transition-colors">
          ABOUT
        </div>
      </div>
    </div>
  );
}
