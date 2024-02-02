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
  mini: boolean;
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
  mini = false,
  preferHorizontal = false,
}: Props) {
  return (
    <Link href={href ?? "#"}>
      <div
        className={clsx(
          `flex h-full cursor-pointer overflow-clip rounded-lg transition hover:scale-[1.02]`,
          {
            "border border-sciquelCardBorder bg-sciquelCardBg": !(
              mini && preferHorizontal
            ),
            "ml-auto w-[175px]": mini && preferHorizontal,
          },
          mini && !preferHorizontal ? "min-w-[275px]" : "min-w-[300px]",
          preferHorizontal ? "flex-row" : "h-[370px] flex-col",
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-4 p-5",
            mini
              ? preferHorizontal
                ? ""
                : "grow"
              : preferHorizontal
              ? "w-2/3"
              : "grow",
          )}
        >
          {/* Article Card Header */}
          {!mini || !preferHorizontal ? (
            <div className="flex w-full flex-row">
              <TopicTag name={topic} />
              <div className="grow text-right">
                <p
                  className={clsx(
                    "m-0 text-sciquelMuted",
                    mini ? "text-sm" : "text-base",
                  )}
                >
                  ARTICLE
                </p>
              </div>
            </div>
          ) : null}
          {/* Article Content */}
          <div className="flex grow flex-col ">
            <div>
              <h1
                className={clsx(
                  "line-clamp-2 font-alegreyaSansSC font-medium",
                  mini
                    ? preferHorizontal
                      ? "text-lg leading-tight"
                      : "text-lg leading-snug"
                    : "text-xl",
                )}
              >
                {title}
              </h1>
            </div>
            <div className="flex items-center ">
              <p
                className={clsx(
                  preferHorizontal ? "line-clamp-1" : "line-clamp-2",
                  mini ? "text-xs" : "",
                )}
              >
                {subtitle}
              </p>
            </div>
          </div>
          <div
            className={clsx(
              "flex flex-row justify-between font-sourceSerif4 font-[350] text-sciquelMuted",
              mini ? "text-xs" : "text-sm",
            )}
          >
            <p>By {author}</p>
            <p>{date}</p>
          </div>
        </div>
        <div
          className={clsx(
            "relative",
            mini
              ? preferHorizontal
                ? "hidden"
                : "h-24"
              : preferHorizontal
              ? "w-1/3"
              : "h-44",
          )}
        >
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
