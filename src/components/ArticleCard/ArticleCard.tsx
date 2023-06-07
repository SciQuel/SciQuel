import TopicTag from "@/components/TopicTag";
import { type StoryTopic } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface Props {
  href: string;
  topic: StoryTopic;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  thumbnailUrl: string;
  preferHorizontal?: boolean;
}

export default function ArticleCard({
  href,
  topic,
  title,
  subtitle,
  author,
  date,
  thumbnailUrl,
  preferHorizontal = false,
}: Props) {
  return (
    <Link href={href ?? "#"}>
      <div
        className={clsx(
          `flex h-full min-w-[300px] cursor-pointer overflow-clip rounded-lg border
          border-sciquelCardBorder bg-sciquelCardBg transition hover:scale-[1.02]`,
          preferHorizontal ? "flex-row" : "flex-col",
        )}
      >
        <div className="flex grow flex-col gap-4 p-5">
          {/* Article Card Header */}
          <div className="flex w-full flex-row">
            <TopicTag name={topic} />
            <div className="grow text-right">
              <p className="m-0 text-[10px] text-sciquelMuted">ARTICLE</p>
            </div>
          </div>
          {/* Article Content */}
          <div className="flex grow flex-col">
            <div className="grow">
              <h1 className="line-clamp-2 font-alegreyaSansSC text-xl font-medium">
                {title}
              </h1>
            </div>
            <div className="flex items-center">
              <p className="line-clamp-3">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-row font-sourceSerif4 text-sm font-[350] text-sciquelMuted">
            <p className="grow">By {author}</p>
            <p>{date}</p>
          </div>
        </div>
        <div className={clsx("relative", preferHorizontal ? "w-1/3" : "h-44")}>
          <Image
            src={thumbnailUrl}
            fill={true}
            style={{ objectFit: "cover" }}
            alt={title}
          />
        </div>
      </div>
    </Link>
  );
}
