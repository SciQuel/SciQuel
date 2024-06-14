import { type Stories } from "@/app/api/stories/route";
import clsx from "clsx";
import { DateTime } from "luxon";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Props {
  mini?: boolean;
  articles: Stories;
  preferHorizontal?: boolean;
}

export default function ArticleList({
  articles,
  mini = false,
  preferHorizontal = false,
}: Props) {
  return (
    <div
      className={clsx(
        "grid auto-rows-max",
        mini
          ? preferHorizontal
            ? ""
            : "grid-cols-3 gap-80"
          : preferHorizontal
          ? "grid-cols-1 gap-4"
          : "grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
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
          topic={article.tags[0]}
          title={article.title}
          subtitle={article.summary}
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
