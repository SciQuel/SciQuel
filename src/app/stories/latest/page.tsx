import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";

interface Params {
  topic: string;
  staff_pick: string;
  page_number: string;
}

export default async function StoriesListPage({
  searchParams,
}: {
  searchParams: Params;
}) {
  const { page_number } = searchParams;
  const params = {
    page: page_number || "1",
    page_size: "9",
  };

  const { stories, total_pages } = await getStories(params);

  return (
    <>
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <HomepageSection heading={"Latest Stories"}>
          {stories.length > 0 ? (
            <>
              <ArticleList articles={stories} preferHorizontal={false} />

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
  const route = `/stories?${searchParams.toString()}`;

  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${route}`, {
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
