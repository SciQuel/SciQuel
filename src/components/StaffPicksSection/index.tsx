import { type Stories } from "@/app/api/stories/route";
// import ArticleList from "../ArticleList";
import HomepageSection from "../HomepageSection";
import NavigateLink from "../HomepageSection/NavigateLink";
import Image from "next/image"; // Next.js optimized image component
import Link from "next/link"; // Next.js link component for client-side navigation
import { DateTime } from "luxon"; // Library for date formatting and manipulation
import TopicTag from "@/components/TopicTag"; // Component for displaying topic badges like "BIOLOGY"

// Component props interface
interface Props {
  articles: Stories; // Array of article data
}

// Temporary staff picks data - this should come from your API/database
const staffPickQuotes = [
  {
    quote: "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    author: "Edward Chen",
    handle: "SciQuel",
    date: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
  {
    quote: "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    author: "Edward Chen",
    handle: "SciQuel",
    date: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
  {
    quote: "A compelling story that highlights the Hawaiian bobtail squid's remarkable ability to recruit and host a single bacterial partner, Vibrio fischeri, through highly selective biological mechanisms.",
    author: "Edward Chen",
    handle: "SciQuel",
    date: "12/5/25",
    avatarUrl: "/user-settings/ProfilePicture.png",
  },
];

export default function StaffPicksSection({ articles }: Props) {
  if (articles.length === 0) {
    return null;
  }

  // Limit to first 3 articles for display
  const displayArticles = articles.slice(0, 3);

  return (
    <HomepageSection heading="Staff Picks">
      {/* Container for all article-quote pairs */}
      <div className="flex flex-col gap-8">
        {displayArticles.map((article, index) => {
          // Get corresponding staff pick quote for this article
          const staffPick = staffPickQuotes[index];

          // Parse publication date for URL construction
          const publishDate = DateTime.fromJSDate(article.publishedAt).toUTC();

          // Build article URL in format: /stories/YYYY/MM/DD/slug
          const href = `/stories/${publishDate.year}/${publishDate.toFormat("LL")}/${publishDate.toFormat("dd")}/${article.slug}`;

          // Extract author information from story contributions
          const author = article.storyContributions.find(
            (value) => value.contributionType === "AUTHOR",
          );
          const authorName = author
            ? `${author.contributor.firstName} ${author.contributor.lastName}`
            : "";

          // Format condensed publication date for the card header
          const condensedDate = publishDate.toFormat("MM/dd/yy");

          return (
            <div
              key={article.id}
              // Main container: stacks vertically on mobile, side-by-side on desktop
              className="flex flex-col gap-4 border-b border-sciquelCardBorder pb-6 last:border-b-0 lg:flex-row lg:items-stretch lg:gap-8"
            >
              {/* Left side - Article Card (50% width on desktop) */}
              <div className="w-full lg:w-1/2">
                <Link href={href} className="group block h-full">
                  <article className="flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-sciquelCardBorder bg-[#f6f3ff] p-3.5 shadow-[0_6px_25px_rgba(25,75,82,0.08)] transition hover:shadow-[0_16px_35px_rgba(25,75,82,0.15)] sm:min-h-[12.5rem] sm:flex-row sm:items-stretch">
                    {/* Thumbnail Image */}
                    <div className="relative h-[9rem] w-full overflow-hidden rounded-xl sm:h-auto sm:min-h-[12.5rem] sm:w-5/12">
                      <Image
                        src={article.thumbnailUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-300"
                      />
                    </div>

                    {/* Article Content */}
                    <div className="flex flex-1 flex-col justify-between gap-4 sm:h-auto sm:min-h-[12.5rem] sm:pl-4">
                      <div className="flex flex-col gap-3">
                        {/* Header Row */}
                        <div className="flex flex-wrap items-center gap-2 text-[0.4rem] font-semibold text-sciquelMuted">
                          <TopicTag name={article.topics?.[0] ?? "BIOLOGY"} />
                          <span className="ml-auto text-[0.55rem] uppercase tracking-[0.2em] text-sciquelMuted">
                            ARTICLE
                          </span>
                        </div>

                        {/* Title + Summary */}
                        <div className="flex flex-col gap-1">
                          <h2 className="line-clamp-2 font-customTest text-xl leading-snug text-sciquelHeading">
                            {article.title}
                          </h2>
                          <p className="line-clamp-3 text-xs leading-relaxed text-sciquelMuted">
                            {article.summary}
                          </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-2 text-xs text-sciquelMuted">
                          <p className="font-semibold text-sciquelDarkText">By {authorName}</p>
                          <span className="text-sciquelMuted">{condensedDate}</span>
                        </div>
                      </div>

                      {/* CTA */}
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

              {/* Right side - Avatar and Quote (50% width on desktop) */}
              <div className="flex w-full items-center gap-4 px-2 lg:w-1/2 lg:min-h-[12.5rem] lg:justify-center lg:px-8">

                {/* Circular Avatar with teal background */}
                <div className="relative h-[4.5rem] w-[4.5rem] flex-shrink-0 overflow-hidden rounded-full bg-sciquelTeal">
                  <Image
                    src={staffPick.avatarUrl}
                    alt={staffPick.author}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Quote and Author Info */}
                <div className="flex flex-col gap-1.5 text-center lg:text-left">
                  {/* Staff pick quote in italic serif font */}
                  <p className="font-serif text-base italic leading-relaxed text-gray-700">
                    {staffPick.quote}
                  </p>
                  {/* Author attribution with date */}
                  <p className="text-xs text-gray-500">
                    — {staffPick.author} @ {staffPick.handle}
                    <span className="ml-3 text-gray-400">{staffPick.date}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to browse all staff picks */}
      <NavigateLink
        text="Browse staff picks"
        route="/stories/list?staff_pick=true"
      />
    </HomepageSection>
  );
}
