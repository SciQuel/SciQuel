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
          
          // Format publication date for display
          const date = DateTime.fromJSDate(article.publishedAt).toLocaleString(
            DateTime.DATE_FULL,
          );

          return (
            <div
              key={article.id}
              // Main container: stacks vertically on mobile, side-by-side on desktop
              className="flex flex-col gap-4 border-b border-sciquelCardBorder pb-6 last:border-b-0 lg:flex-row lg:gap-8"
            >
              {/* Left side - Article Card (50% width on desktop) */}
              <div className="w-full lg:w-1/2">
                <Link href={href}>
                  {/* Article card: image on right (desktop) or top (mobile) */}
                  <div className="flex h-full w-full cursor-pointer flex-col-reverse overflow-clip rounded-lg border border-sciquelCardBorder bg-sciquelCardBg transition hover:scale-[1.02] sm:flex-row">
                    {/* Article Content (left 2/3 on desktop) */}
                    <div className="flex flex-col gap-2 p-2.5 sm:w-2/3">
                      {/* Header: Topic tag and "ARTICLE" label */}
                      <div className="flex w-full flex-row flex-wrap justify-between">
                        <TopicTag name={article.topics?.[0] ?? "BIOLOGY"} />
                        <div>
                          <p className="m-0 text-xs text-sciquelMuted">ARTICLE</p>
                        </div>
                      </div>
                      
                      {/* Title and Subtitle */}
                      <div className="flex grow flex-col gap-1">
                        {/* Article title - limited to 2 lines */}
                        <h2 className="line-clamp-2 font-customTest text-base font-medium leading-snug">
                          {article.title}
                        </h2>
                        {/* Article summary - limited to 2 lines */}
                        <p className="line-clamp-2 text-xs leading-relaxed">{article.summary}</p>
                      </div>

                      {/* Author and Date info */}
                      <div className="mt-auto flex flex-col">
                        <p className="text-xs">{authorName}</p>
                        <p className="text-xs text-sciquelMuted">{date}</p>
                      </div>
                      
                      {/* Call-to-action button */}
                      <button className="w-fit rounded-md bg-sciquelTeal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sciquelTeal/90">
                        Read more →
                      </button>
                    </div>

                    {/* Thumbnail Image (right 1/3 on desktop) */}
                    <div className="relative h-32 w-full sm:h-auto sm:w-1/3">
                      <Image
                        src={article.thumbnailUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right side - Avatar and Quote (50% width on desktop) */}
              <div className="flex w-full flex-row items-start gap-4 lg:w-1/2 lg:pt-2">
                {/* Circular Avatar with teal background */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-sciquelTeal">
                  <Image
                    src={staffPick.avatarUrl}
                    alt={staffPick.author}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Quote and Author Info */}
                <div className="flex flex-col gap-1.5">
                  {/* Staff pick quote in italic serif font */}
                  <p className="font-serif text-sm italic leading-relaxed text-gray-700">
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
