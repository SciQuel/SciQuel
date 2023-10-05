import Image from "next/image";
import Link from "next/link";
import testImg from "../../../public/assets/images/bobtail.png";

export default function FromThisSeries() {
  return (
    <div className="mt-8 bg-gradient-to-l from-[#2779A8] to-[#63A49E] p-10 text-sciquelCardBg xl:px-28">
      <div className="flex w-full flex-col text-center">
        <h1 className="text-2xl">More from the series:</h1>
        <h2 className="text-xl font-bold">Exploring Ecology</h2>
      </div>
      <div className="my-4 flex flex-row justify-between  lg:px-5">
        <button className="text-xl">Previous Article</button>
        <button className="invisible text-xl md:visible">
          Next article
          <i className="fa fa-bolt"></i>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-10 lg:px-5 ">
        <Link className="rounded-lg bg-[#d9d9d9]/[0.3] " href="/">
          <div className="flex flex-row gap-5 p-2">
            <Image className="w-1/2 max-w-xs " alt="squid" src={testImg} />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">title name</h3>
              <p className="text-sm">
                How the Hawaiian bobtail squid brings a creative vision to its
                maritime world of small big screens
              </p>
            </div>
          </div>
        </Link>
        <Link className="rounded-lg bg-[#d9d9d9]/[0.3] " href="/">
          <div className="flex flex-row gap-5 p-2">
            <Image className="w-1/2 max-w-xs " alt="squid" src={testImg} />
            <div className="flex flex-col">
              <h3 className="text-xl font-bold">title name</h3>
              <p className="text-sm">
                How the Hawaiian bobtail squid brings a creative vision to its
                maritime world of small big screens
              </p>
            </div>
          </div>
        </Link>
      </div>
      <button className="float-right my-4 text-xl md:invisible">
        Next article
      </button>
    </div>
  );
}
