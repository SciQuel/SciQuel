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
  const { topic, staff_pick, page_number } = searchParams;
  const params = {
    ...(topic ? { topic } : {}),
    ...(staff_pick && staff_pick === "true" ? { staff_pick: "true" } : {}),
    page: page_number || "1",
  };

  const { stories, total_pages } = await getStories(params);

  // Header text shows ALL TOPICS by default or Topic if specified
  let headerText = topic ? topic.toUpperCase().replace("_", " ") : "ALL TOPICS";

  // Add Staff Pick to header text if user specified staff pick
  if (staff_pick && staff_pick === "true") {
    headerText += " | Staff Picks";
  }

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
