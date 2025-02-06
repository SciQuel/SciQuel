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
    <div className="w-full">
      <Link className="align-middle" href={href ?? "#"}>
        <div
          className={clsx(
            `flex h-full w-full cursor-pointer overflow-clip rounded-lg transition hover:scale-[1.02]`,
            {
              "border border-sciquelCardBorder bg-sciquelCardBg": !(
                mini && preferHorizontal
              ),
              "ml-auto w-[175px]": mini && preferHorizontal,
            },
            mini && !preferHorizontal
              ? "min-h-[270px] max-w-xs xs:min-w-[265px]"
              : "xs:min-w-[300px]",
            preferHorizontal ? "flex-col-reverse sm:flex-row" : "flex-col",
          )}
        >
          <div
            className={clsx(
              "flex flex-col gap-4",
              mini
                ? preferHorizontal
                  ? "w-full"
                  : "grow  p-3"
                : preferHorizontal
                ? "p-3 sm:w-2/3"
                : "grow  p-3",
            )}
          >
            {/* Article Card Header */}
            {!mini || !preferHorizontal ? (
              <div className="flex w-full flex-row flex-wrap justify-between">
                <TopicTag name={topic} />
                <div className="">
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
            <div className="relative flex grow flex-col">
              <div>
                <h2
                  className={clsx(
                    "line-clamp-2 font-customTest font-medium",
                    mini
                      ? preferHorizontal
                        ? "text-lg leading-tight"
                        : "text-lg leading-snug"
                      : "text-xl",
                  )}
                >
                  {title}
                </h2>
              </div>
              <div className="flex items-center">
                <p
                  className={clsx(
                    mini ? "line-clamp-2 text-xs" : "line-clamp-3",
                  )}
                >
                  {subtitle}
                </p>
              </div>
            </div>
            <div
              className={clsx(
                "flex flex-row flex-wrap justify-between font-sourceSerif4 font-[350] text-sciquelMuted",
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
                ? "h-44 w-full sm:h-full sm:w-1/3"
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
    </div>
  );
}
