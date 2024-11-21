import Image from "next/image";
import Link from "next/link";
import testImg from "../../../public/assets/images/bobtail.png";

export default function FromThisSeries() {
  return (
    <div className="mt-8 bg-gradient-to-l from-[#2779A8] to-[#63A49E] px-8 py-12  text-sciquelCardBg">
      <div className="flex w-full flex-col text-center">
        <h1 className="text-xl">More from the series:</h1>
        <h2 className="text-2xl font-bold">Exploring Ecology</h2>
      </div>
      <div className="mb-4 mt-8 flex flex-row justify-between">
        <button className="text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="inline-block h-5 w-5 align-middle"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
          Previous article
        </button>
        <button className="invisible text-xl md:visible">
          Next article
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            width="10px"
            className="inline-block h-5 w-5"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-10">
        <Link className="rounded-lg bg-[#d9d9d9]/[0.3] " href="/">
          <div className="flex h-[168px] flex-row gap-2 p-4">
            <div className="relative bg-red-500 pr-[41%]">
              <Image
                className="absolute top-0 h-full w-full object-cover"
                alt="squid"
                src={testImg}
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-col overflow-hidden text-ellipsis">
                <h3 className="text-xl font-bold">Title name</h3>
                <p className=" text-sm">
                  How the Hawaiian bobtail squid brings a creative vision to its
                  maritime world of small big screens.
                </p>
              </div>
              <div className="flex flex-row justify-between font-sourceSerif4 text-xs font-[350]">
                <p>By Edward Chen</p>
                <p>June 13, 2023</p>
              </div>
            </div>
          </div>
        </Link>
        <Link className="rounded-lg bg-[#d9d9d9]/[0.3] " href="/">
          <div className="flex h-[168px] flex-row gap-2 p-4">
            <div className="relative bg-red-500 pr-[41%]">
              <Image
                className="absolute top-0 h-full w-full object-cover"
                alt="squid"
                src={testImg}
              />
            </div>
            <div className="flex flex-col justify-between gap-1">
              <div className="flex flex-col overflow-hidden text-ellipsis">
                <h3 className="text-xl font-bold">Title name</h3>
                <p className="  text-sm">
                  How the Hawaiian bobtail squid brings a creative vision to its
                  maritime world of small big screens.
                </p>
              </div>
              <div className="flex flex-row justify-between font-sourceSerif4 text-xs font-[350]">
                <p>By Edward Chen</p>
                <p>June 13, 2023</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <button className="float-right my-4 text-xl md:hidden">
        Next article
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          width="10px"
          className="inline-block h-5 w-5"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </button>
    </div>
  );
}
