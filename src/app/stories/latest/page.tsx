import { type GetLatestStoriesResult } from "@/app/api/stories/latest/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";

interface Params {
  topic: string;
  page_number: string;
}

export default async function StoriesLatestPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { topic, page_number } = searchParams;
  const params = {
    ...(topic ? { topic } : {}),
    page: page_number || "1",
  };

  const { stories, total_pages } = await getStories(params);

  let headerText = topic ? `${topic.toUpperCase()} | LATEST` : "ALL TOPICS | LATEST";

  return (
    <>
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <HomepageSection heading={headerText}>
          {stories.length > 0 ? (
            <>
              <ArticleList articles={stories} preferHorizontal={true} />
              <Pagination total_pages={total_pages} />
            </>
          ) : (
            <h2 className="text-3xl font-[550] text-sciquelHeading">
              No Result
            </h2>
          )}
        </HomepageSection>
      </div>
    </>
  );
}

async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const route = `/stories/latest/?${searchParams.toString()}`;

  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${route}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: GetLatestStoriesResult = await res.json().then();

  data.stories = data.stories.map((story) => ({
    ...story,
    publishedAt: new Date(story.publishedAt),
  }));

  return data;
}
