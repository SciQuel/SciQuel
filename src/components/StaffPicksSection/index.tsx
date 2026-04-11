import { type Stories } from "@/app/api/stories/route";
import HomepageSection from "../HomepageSection";
import NavigateLink from "../HomepageSection/NavigateLink";
import { DateTime } from "luxon";
import StaffPickCard from "./StaffPickCard";

interface Props {
  articles: Stories;
}

// Format a date as MM/DD/YY for the condensed card layout
function formatCondensedDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).format(date);
}

export default function StaffPicksSection({ articles }: Props) {
  // Only show articles that actually have a staff pick attached
  const displayArticles = articles.filter((a) => a.staffPick).slice(0, 3);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <HomepageSection heading="Staff Picks">
      <div className="flex flex-col gap-8">
        {displayArticles.map((article) => {
          const publishDate = DateTime.fromJSDate(article.publishedAt).toUTC();
          const href = `/stories/${publishDate.year}/${publishDate.toFormat("LL")}/${publishDate.toFormat("dd")}/${article.slug}`;
          const author = article.storyContributions.find(
            (value) => value.contributionType === "AUTHOR",
          );
          const authorName = author
            ? `${author.contributor.firstName} ${author.contributor.lastName}`
            : "";
          const condensedDate = publishDate.toFormat("MM/dd/yy");

          // Use the real staff pick description saved by the editor
          const pickDate = article.staffPick
            ? formatCondensedDate(new Date(article.staffPick.createdAt))
            : condensedDate;

          return (
            <StaffPickCard
              key={article.id}
              href={href}
              title={article.title}
              summary={article.summary}
              thumbnailUrl={article.thumbnailUrl}
              topic={article.topics?.[0] ?? "BIOLOGY"}
              authorName={authorName}
              condensedDate={condensedDate}
              quote={article.staffPick?.description ?? ""}
              quoteAuthor={article.staffPick?.authorName ?? "SciQuel"}
              quoteHandle="SciQuel"
              quoteDate={pickDate}
              avatarUrl="/user-settings/ProfilePicture.png"
            />
          );
        })}
      </div>

      <NavigateLink
        text="Browse staff picks"
        route="/stories/list?staff_pick=true"
      />
    </HomepageSection>
  );
}
