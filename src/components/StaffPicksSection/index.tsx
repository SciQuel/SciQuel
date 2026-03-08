import { type Stories } from "@/app/api/stories/route";
import HomepageSection from "../HomepageSection";
import NavigateLink from "../HomepageSection/NavigateLink";
import { DateTime } from "luxon";
import StaffPickCard from "./StaffPickCard";

interface Props {
  articles: Stories;
}

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

  const displayArticles = articles.slice(0, 3);

  return (
    <HomepageSection heading="Staff Picks">
      <div className="flex flex-col gap-8">
        {displayArticles.map((article, index) => {
          const staffPick = staffPickQuotes[index];
          const publishDate = DateTime.fromJSDate(article.publishedAt).toUTC();
          const href = `/stories/${publishDate.year}/${publishDate.toFormat("LL")}/${publishDate.toFormat("dd")}/${article.slug}`;
          const author = article.storyContributions.find(
            (value) => value.contributionType === "AUTHOR",
          );
          const authorName = author
            ? `${author.contributor.firstName} ${author.contributor.lastName}`
            : "";
          const condensedDate = publishDate.toFormat("MM/dd/yy");

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
              quote={staffPick.quote}
              quoteAuthor={staffPick.author}
              quoteHandle={staffPick.handle}
              quoteDate={staffPick.date}
              avatarUrl={staffPick.avatarUrl}
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
