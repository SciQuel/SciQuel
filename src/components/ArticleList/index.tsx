import { type GetStoriesResult } from "@/app/api/stories/route";
import { DateTime } from "luxon";
import ArticleCard from "../ArticleCard/ArticleCard";

interface Props {
  articles: GetStoriesResult;
}

export default function ArticleList({ articles }: Props) {
  return (
    <div className="grid auto-rows-max grid-cols-3 gap-4">
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
        />
      ))}
    </div>
  );
}
