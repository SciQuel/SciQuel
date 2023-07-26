import Image from "next/image";
import Link from "next/link";
import testImg from "../../../public/assets/images/bobtail.png";

export default function FromThisSeries() {
  return (
    <div className="mt-8 bg-gradient-to-l from-[#2779A8] to-[#63A49E] p-5 text-sciquelCardBg">
      <div className="flex w-full flex-col text-center">
        <h1 className="text-2xl">More from the series:</h1>
        <h2 className="text-xl font-bold">Exploring Ecology</h2>
      </div>
      <div className="flex flex-row justify-between px-6">
        <button className="m-4 text-xl">Previous Article</button>
        <button className="m-4 text-xl">Next article</button>
      </div>
      <div className="flex flex-row justify-between">
        <Link
          className="m-4 flex aspect-[3/1] w-2/5 flex-row rounded-lg bg-[#d9d9d9]/[0.3] p-4"
          href="/"
        >
          <Image
            className="m-2   w-4/5 object-cover"
            alt="squid"
            src={testImg}
          />
          <div className="flex flex-col p-3">
            <h3 className="text-xl font-bold">title name</h3>
            <p className="text-sm">
              How the Hawaiian bobtail squid brings a creative vision to its
              maritime world of small big screens
            </p>
          </div>
        </Link>
        <Link
          className="m-4 flex aspect-[3/1] w-2/5 flex-row rounded-lg bg-[#d9d9d9]/[0.3] p-4"
          href="/"
        >
          <Image
            className="m-2   w-4/5 object-cover"
            alt="squid"
            src={testImg}
          />
          <div className="flex flex-col p-3">
            <h3 className="text-xl font-bold">title name</h3>
            <p className="text-sm">
              How the Hawaiian bobtail squid brings a creative vision to its
              maritime world of small big screens
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
