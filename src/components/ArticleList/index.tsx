import { type GetStoriesResult } from "@/app/api/stories/route";
import clsx from "clsx";
import { DateTime } from "luxon";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Props {
  articles: GetStoriesResult;
  preferHorizontal?: boolean;
}

export default function ArticleList({
  articles,
  preferHorizontal = false,
}: Props) {
  return (
    <div
      className={clsx(
        "grid gap-4",
        preferHorizontal ? null : "auto-rows-max grid-cols-3",
      )}
    >
      {articles.map((article) => (
        <ArticleCard
          href="#"
          key={article.title}
          topic={article.tags[0]}
          title={article.title}
          subtitle={article.summary}
          author={(() => {
            const author = article.storyContributions.find(
              (value) => value.contributionType === "AUTHOR",
            );
            return author
              ? `${author.user.firstName} ${author.user.lastName}`
              : "";
          })()}
          date={DateTime.fromJSDate(article.publishedAt).toLocaleString(
            DateTime.DATE_FULL,
          )}
          thumbnailUrl={article.thumbnailUrl}
          preferHorizontal={preferHorizontal}
        />
      ))}
    </div>
  );
}
