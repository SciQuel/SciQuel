import Avatar from "@/components/UserSettings/ProfilePicture.png";
import ArticleImage from "@/components/UserSettings/top_background_img.png";
import Image from "next/image";

export default function GreetingCard() {
  return (
    <div className="flex min-h-[320px] flex-wrap overflow-hidden rounded-md border bg-white">
      <div className="relative flex min-h-[280px] flex-1 flex-col items-center p-6 sm:flex-row sm:items-start lg:basis-7/12">
        <div className="flex h-24 w-24 flex-none items-center rounded-full bg-gradient-to-b from-emerald-300 to-blue-400 sm:h-36 sm:w-36">
          <Image
            src={Avatar}
            alt="avatar"
            className="mx-auto w-20 rounded-full sm:w-32"
            width={100}
            height={100}
          />
        </div>
        <div className="mt-2 sm:ml-6">
          <p className="line-clamp-2 text-2xl font-semibold sm:text-3xl">
            Good afternoon, James
          </p>
          <div className="mt-3 flex max-h-[24px] flex-wrap justify-start gap-2 overflow-hidden text-xs">
            <div className="rounded-xl bg-green-600 p-1 px-2 text-white">
              mathematics
            </div>
            <div className="rounded-xl bg-purple-400 p-1 px-2 text-white">
              medicine
            </div>
            <div className="rounded-xl bg-yellow-400 p-1 px-2 text-white">
              computer sci.
            </div>
            <div className="rounded-xl bg-blue-400 p-1 px-2 text-white">
              tag-test
            </div>
          </div>
        </div>
        <p className="absolute bottom-4 left-6 font-thin">
          A member since September of 2022
        </p>
      </div>

      <div className="flex h-[320px] basis-full flex-col lg:basis-5/12">
        <div className="relative grow object-cover">
          <Image src={ArticleImage} alt="article image" fill />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-white/30 p-2 px-4 backdrop-blur-md hover:scale-110 hover:bg-white/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-blue-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
            Read
          </div>
        </div>
        <div className="flex justify-between bg-green-200 px-6 py-4">
          <div className="h-fit basis-5/6">
            <p className="line-clamp-1 text-xl font-semibold">
              Milankovitch cycles: what are akdsfjielj adf adfdai
            </p>
            <p>by Harriet Patel_2</p>
          </div>
          <div className="flex basis-1/6 items-center justify-center gap-2">
            <button className="h-8 rounded-lg bg-gray-100 px-2 hover:scale-105 hover:bg-gray-200">
              {"<"}
            </button>
            <button className="h-8 rounded-lg bg-gray-100 px-2 hover:scale-105 hover:bg-gray-200">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
