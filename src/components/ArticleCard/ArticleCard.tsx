import TopicTag from "@/components/TopicTag";
import { type EnumKey } from "@/lib/enums";
import type Topic from "@/lib/enums/Topic";
import Image from "next/image";
import Link from "next/link";

interface Props {
  href: string;
  topic: EnumKey<typeof Topic>;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  thumbnailUrl: string;
}

export default function ArticleCard({
  href,
  topic,
  title,
  subtitle,
  author,
  date,
  thumbnailUrl,
}: Props) {
  return (
    <Link href={href ?? "#"}>
      <div
        className={`flex h-full min-w-[300px] cursor-pointer flex-col
        overflow-clip rounded-lg border border-sciquelCardBorder bg-sciquelCardBg
        transition hover:scale-[1.02]`}
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
          <h1 className="line-clamp-3 font-alegreyaSansSC text-2xl font-medium">
            {title}
          </h1>
          <div className="grow">
            <p className="line-clamp-2">{subtitle}</p>
          </div>
          <div className="flex flex-row font-sourceSerif4 text-sm font-[350] text-sciquelMuted">
            <p className="grow">By {author}</p>
            <p>{date}</p>
          </div>
        </div>
        <div className="relative h-44">
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
