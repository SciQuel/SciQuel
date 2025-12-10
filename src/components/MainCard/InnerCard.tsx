import TopicTag from "@/components/TopicTag";
import { type StoryTopic, type StoryType } from "@prisma/client";
import Link from "next/link";

interface Props {
  tag: StoryTopic;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: StoryType;
  href: string;
}

export default function InnerCard({
  tag,
  title,
  subtitle,
  author,
  date,
  mediaType,
  href,
}: Props) {
  return (
    <Link
      href={href}
      className="relative z-20 flex w-full flex-col rounded bg-white transition-all duration-300    lg:bg-transparent"
    >
      <div className="z-20 flex flex-col rounded  bg-white from-[#027373] to-sciquelTeal p-5 transition-opacity duration-300 lg:bg-gradient-to-t lg:px-5 lg:pt-8 ">
        <div className="flex items-start justify-between">
          <TopicTag name={tag} />
          <p className="m-0 hidden p-0 text-xs text-sciquelMuted">
            {mediaType}
          </p>
        </div>
        <h2 className="my-2 text-left font-customTest text-3xl font-bold text-sciquelDarkText lg:text-white">
          {title}
        </h2>
        <h3 className="line-clamp-3 text-left text-xl text-sciquelDarkText transition-all duration-300 lg:text-white">
          {subtitle}
        </h3>
      </div>
      {/* <div className="mx-5 my-3 text-left transition-all duration-300 lg:hidden">
        <p className="top-full font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
          {author} | {date}
        </p>
      </div> */}
      <div className="z-10 mx-5 mb-3  text-left transition-all duration-300 lg:absolute lg:top-[100%] lg:block  lg:rounded lg:bg-white">
        <p className="font-sourceSerif4 text-xl font-[350] text-sciquelTeal ">
          {author} | {date}
        </p>
      </div>
    </Link>
  );
}