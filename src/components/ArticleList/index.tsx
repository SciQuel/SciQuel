import { type Stories } from "@/app/api/stories/route";
import clsx from "clsx";
import { DateTime } from "luxon";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Props {
  mini?: boolean;
  articles: Stories;
  preferHorizontal?: boolean;
  hoverEffect?: boolean

}

export default function ArticleList({
  articles,
  mini = false,
  preferHorizontal = false,
  hoverEffect = true
}: Props) {
  return (
    <div
      className={clsx(
        mini
          ? preferHorizontal
            ? "grid grid-cols-1 gap-5"
            : "grid grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3"
          : preferHorizontal
            ? "grid grid-cols-1 gap-10"
            : "grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3",
      )}
    >
      {articles.map((article) => (
        <ArticleCard
          href={(() => {
            const publishDate = DateTime.fromJSDate(
              article.publishedAt,
            ).toUTC();
            return `/stories/${publishDate.year}/${publishDate.toFormat(
              "LL",
            )}/${publishDate.toFormat("dd")}/${article.slug}`;
          })()}
          key={article.title}
          topic={article.tags ? article.tags[0] : "BIOLOGY"}
          title={article.title}
          subtitle={article.summary}
          hoverEffect={hoverEffect}
          author={(() => {
            const author = article.storyContributions.find(
              (value) => value.contributionType === "AUTHOR",
            );
            return author
              ? `${author.contributor.firstName} ${author.contributor.lastName}`
              : "";
          })()}
          date={DateTime.fromJSDate(article.publishedAt).toLocaleString(
            DateTime.DATE_FULL,
          )}
          thumbnailUrl={article.thumbnailUrl}
          mini={mini}
          preferHorizontal={preferHorizontal}
        />
      ))}
    </div>
  );
}
