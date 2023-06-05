import TopicTag from "@/components/TopicTag";
import { type StoryTopic, type StoryType } from "@prisma/client";

interface Props {
  tag: StoryTopic;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  mediaType: StoryType;
}

export default function Card({
  tag,
  title,
  subtitle,
  author,
  date,
  mediaType,
}: Props) {
  return (
    <div className="z-10 flex min-h-[150px] w-full min-w-[150px] flex-col rounded max-lg:bg-white">
      <div className="flex flex-col rounded bg-gradient-to-b from-[#196e8c] to-[#65a69e] p-5 max-lg:bg-none">
        <div className="flex items-start justify-between">
          <TopicTag name={tag} />
          <p className="m-0 hidden p-0 text-xs text-sciquelMuted">
            {mediaType}
          </p>
        </div>
        <h2 className="my-2 text-left font-alegreyaSansSC text-3xl font-bold text-white max-lg:text-sciquelDarkText">
          {title}
        </h2>
        <h4 className="line-clamp-3 text-left text-xl text-white max-lg:text-sciquelDarkText">
          {subtitle}
        </h4>
      </div>
      <div className="mx-5 my-3 text-left">
        <p className="top-full font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
          {author} | {date}
        </p>
      </div>
    </div>
  );
}
