import Avatar from "@/components/Avatar";
import TopicTag from "@/components/TopicTag";
import { StoryTopic } from "@prisma/client";
import ArticleImage from "/public/user-settings/top_background_img.png";
import Image from "next/image";
import AvatarEditorButton from "../Avatar/AvatarEditorButton";

export default function GreetingCard(props: { name: string }) {
  const getGreeting = () => {
    const currHr = new Date().getHours();
    if (currHr < 12) return "Good morning";
    else if (currHr < 18) return "Good afternoon";
    else return "Good Evening";
  };

  return (
    <section className="flex min-h-[320px] flex-wrap overflow-hidden rounded-md border bg-white">
      <div className="relative flex min-h-[280px] flex-1 flex-col items-center p-6 sm:flex-row sm:items-start lg:basis-7/12">
        <div className="relative flex h-[6.75rem] w-[6.75rem] items-center justify-center rounded-full bg-gradient-to-b from-[#A1C9C1] to-[#58ABF8]">
          <AvatarEditorButton />
          <Avatar label={props.name.trim()[0]} size="2xl" />
        </div>
        <div className="mt-2 sm:ml-6">
          <p className="line-clamp-2 text-2xl font-semibold sm:text-3xl">
            {getGreeting()}, {props.name}
          </p>
          <div className="mt-3 flex max-h-[24px] flex-wrap justify-start gap-2 overflow-hidden text-xs">
            <TopicTag name={StoryTopic.MATHEMATICS} />
            <TopicTag name={StoryTopic.MEDICINE} />
            <TopicTag name={StoryTopic.COMPUTER_SCIENCE} />
          </div>
        </div>
        <p className="absolute bottom-4 left-6 font-thin">
          A member since September of 2022
        </p>
      </div>

      <div className="flex h-[320px] basis-full flex-col lg:basis-5/12">
        <div className="relative grow object-cover">
          <Image src={ArticleImage} alt="article image" fill />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-[#A3C9A8] p-2 px-4 backdrop-blur-md hover:scale-105 hover:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-[#69A297]"
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
        <div className="flex justify-between bg-white px-6 py-4">
          <div className="h-fit basis-5/6">
            <p className="line-clamp-1 text-xl font-semibold">
              Milankovitch cycles: what are akdsfjielj adf adfdai
            </p>
            <p>
              by <span className="text-[#69A297]">Harriet Patel_2</span>
            </p>
          </div>
          <div className="flex basis-1/6 items-center justify-center gap-2">
            <button className="h-8 rounded-lg bg-gray-100 px-2 hover:scale-105 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button className="h-8 rounded-lg bg-gray-100 px-2 hover:scale-105 hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
