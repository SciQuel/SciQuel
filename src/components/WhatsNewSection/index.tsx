import { type Stories } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import MainCard from "@/components/MainCard";
import { DateTime } from "luxon";
import NavigateLink from "../HomepageSection/NavigateLink";

interface Props {
  articles: Stories;
}

export default function WhatsNewSection({ articles }: Props) {
  const headlineArticle = articles?.[0];
  const readMoreArticles = articles?.slice(1, 4) ?? [];

  return (
    <HomepageSection heading="Read what's new">
      <div className="pb-5">
        {headlineArticle && (
          <MainCard
            thumbnailUrl={headlineArticle.thumbnailUrl}
            title={headlineArticle.title}
            subtitle={headlineArticle.summary}
            author={(() => {
              const author = headlineArticle.storyContributions.find(
                (value) => value.contributionType === "AUTHOR",
              );
              return author?.contributor
                ? `${author.contributor.firstName} ${author.contributor.lastName}`
                : "";
            })()}
            date={DateTime.fromJSDate(
              headlineArticle.publishedAt,
            ).toLocaleString(DateTime.DATE_FULL)}
            mediaType={headlineArticle.storyType}
            tag={headlineArticle.tags[0]}
            href={(() => {
              const publishDate = DateTime.fromJSDate(
                headlineArticle.publishedAt,
              ).toUTC();
              return `/stories/${publishDate.year}/${publishDate.toFormat(
                "LL",
              )}/${publishDate.toFormat("dd")}/${headlineArticle.slug}`;
            })()}
          />
        )}
      </div>
      {readMoreArticles && <ArticleList articles={readMoreArticles} />}
      <NavigateLink text="Read all recent" route="/stories/list" />
    </HomepageSection>
  );
}
