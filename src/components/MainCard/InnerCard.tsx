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
      className="relative z-20 flex w-full flex-col rounded bg-white transition-all duration-300  lg:min-h-[45%] lg:bg-transparent"
    >
      <div className="absolute inset-0  rounded bg-gradient-to-t from-[#027373] to-sciquelTeal opacity-0 transition-opacity duration-300 lg:px-5 lg:pt-12 lg:opacity-100"></div>
      <div className="z-10 flex flex-col rounded p-5">
        <div className="flex items-start justify-between">
          <TopicTag name={tag} />
          <p className="m-0 hidden p-0 text-xs text-sciquelMuted">
            {mediaType}
          </p>
        </div>
        <h2 className="my-2 text-left font-alegreyaSansSC text-5xl font-bold text-sciquelDarkText lg:text-white">
          {title}
        </h2>
        <h4 className="line-clamp-3 text-left text-2xl text-sciquelDarkText transition-all duration-300 lg:text-white">
          {subtitle}
        </h4>
      </div>
      <div className="mx-5 my-3 text-left transition-all duration-300 lg:hidden">
        <p className="top-full font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
          {author} | {date}
        </p>
      </div>
    </Link>
  );
}
