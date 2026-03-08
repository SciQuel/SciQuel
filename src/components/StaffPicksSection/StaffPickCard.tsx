import Image from "next/image";
import Link from "next/link";
import { type StoryTopic } from "@prisma/client";
import TopicTag from "@/components/TopicTag";

interface StaffPickCardProps {
  href: string;
  title: string;
  summary: string;
  thumbnailUrl: string;
  topic: StoryTopic;
  authorName: string;
  condensedDate: string;
  quote: string;
  quoteAuthor: string;
  quoteHandle: string;
  quoteDate: string;
  avatarUrl: string;
  showDivider?: boolean;
}

export default function StaffPickCard({
  href,
  title,
  summary,
  thumbnailUrl,
  topic,
  authorName,
  condensedDate,
  quote,
  quoteAuthor,
  quoteHandle,
  quoteDate,
  avatarUrl,
  showDivider = true,
}: StaffPickCardProps) {
  return (
    <div
      className={[
        "flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-8",
        showDivider
          ? "border-b border-sciquelCardBorder pb-6 last:border-b-0"
          : "",
      ].join(" ")}
    >
      <div className="w-full lg:w-1/2">
        <Link href={href} className="group block h-full">
          <article className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-sciquelCardBorder bg-[#f6f3ff] p-3.5 shadow-[0_6px_25px_rgba(25,75,82,0.08)] transition hover:shadow-[0_16px_35px_rgba(25,75,82,0.15)] sm:min-h-[12.5rem] sm:flex-row sm:items-stretch">
            <div className="relative h-[9rem] w-full overflow-hidden rounded-xl sm:h-auto sm:min-h-[12.5rem] sm:w-5/12">
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover transition duration-300"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4 sm:h-auto sm:min-h-[12.5rem] sm:pl-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 text-[0.4rem] font-semibold text-sciquelMuted">
                  <TopicTag name={topic} />
                  <span className="ml-auto text-[0.55rem] uppercase tracking-[0.2em] text-sciquelMuted">
                    ARTICLE
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="line-clamp-2 font-customTest text-xl leading-snug text-sciquelHeading">
                    {title}
                  </h2>
                  <p className="line-clamp-3 text-xs leading-relaxed text-sciquelMuted">
                    {summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-sciquelMuted">
                  <p className="font-semibold text-sciquelDarkText">By {authorName}</p>
                  <span className="text-sciquelMuted">{condensedDate}</span>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-semibold text-sciquelTeal shadow-sm transition group-hover:bg-sciquelTeal group-hover:text-white">
                Read more
                <span aria-hidden className="text-sm">
                  →
                </span>
              </span>
            </div>
          </article>
        </Link>
      </div>

      <div className="flex w-full items-center gap-4 px-2 lg:w-1/2 lg:min-h-[12.5rem] lg:justify-center lg:px-8">
        <div className="relative h-[4.5rem] w-[4.5rem] flex-shrink-0 overflow-hidden rounded-full bg-sciquelTeal">
          <Image src={avatarUrl} alt={quoteAuthor} fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-1.5 text-center lg:text-left">
          <p className="font-serif text-base italic leading-relaxed text-gray-700">
            {quote}
          </p>
          <p className="text-xs text-gray-500">
            — {quoteAuthor} @ {quoteHandle}
            <span className="ml-3 text-gray-400">{quoteDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}