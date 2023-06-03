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
    <div className="absolute bottom-[4.5rem] z-10 min-h-[150px] w-[500px] min-w-[150px] rounded bg-gradient-to-b from-[#196e8c] to-[#65a69e] p-5">
      <div className="flex items-start justify-between">
        <TopicTag name={tag} />
        <p className="m-0 hidden p-0 text-xs text-sciquelMuted">{mediaType}</p>
      </div>
      <h2 className="my-2 text-left font-alegreyaSansSC text-3xl font-bold text-white">
        {title}
      </h2>
      <h4 className="line-clamp-3 text-left text-xl text-white">{subtitle}</h4>
      <p className="absolute bottom-0 left-5 top-full my-3 font-sourceSerif4 text-xl font-[350] text-sciquelMuted">
        {author} | {date}
      </p>
    </div>
  );
}
