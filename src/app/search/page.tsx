import { type GetStoriesResult } from "@/app/api/stories/route";
import Search from "@/components/Search";
import SearchArticle from "@/components/SearchArticle";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";

interface Params {
  searchParams: { [key: string]: string };
}

export default async function SearchPage({ searchParams }: Params) {
  const { keyword, page, type, date_from, date_to, sort_by } = searchParams;
  const params = {
    ...(keyword ? { keyword } : {}),
    ...(type ? { type } : {}),
    ...(date_from ? { date_from } : {}),
    ...(date_to ? { date_to } : {}),
    ...(sort_by ? { sort_by } : {}),
    page: page || "1",
  };
  const { stories, total_pages } = await getStories(params);

  return (
    <div>
      <Search searchParams={searchParams} />

      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <SearchArticle articles={stories} />
        <Pagination total_pages={Math.max(total_pages, 1)} />
      </div>
    </div>
  );
}
async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  console.log("route", searchParams.toString());
  const route = `/stories?${searchParams.toString()}&page_size=30`;

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
