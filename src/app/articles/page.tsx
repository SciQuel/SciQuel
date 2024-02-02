import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import MainCard from "@/components/MainCard";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";
import { DateTime } from "luxon";
import { type GetStoriesResult } from "../api/stories/route";

interface Params {
  page_number: string;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { page_number } = searchParams;

  const { stories, total_pages } = await getArticles();
  const headlineArticle = stories?.[0];
  const articleCards = stories?.slice(1, 7) ?? [];
  const horizontalCards = articleCards.concat(stories?.slice(2, 9));

  return (
    <>
      {/* Article cards */}
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <HomepageSection heading="All articles">
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
                  return author
                    ? `${author.user.firstName} ${author.user.lastName}`
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
          {articleCards && <ArticleList articles={articleCards} />}
          {stories && (
            <ArticleList articles={horizontalCards} preferHorizontal={true} />
          )}
          <Pagination total_pages={total_pages} />
        </HomepageSection>
      </div>
    </>
  );

  async function getArticles() {
    const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data: GetStoriesResult = await res.json().then();

    data.stories = data.stories.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    }));

    return data;
  }
}
