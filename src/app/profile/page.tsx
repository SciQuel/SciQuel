import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import Avatar from "@/components/Avatar";
import FooterIcon from "@/components/Footer/FooterIcon";
import HomepageSection from "@/components/HomepageSection";
import Pagination from "@/components/StoriesList/Pagination";
import TopicTag from "@/components/TopicTag";
import env from "@/lib/env";

interface Params {
  topic: string;
  staff_pick: string;
  trending: string;
  page_number: string;
}
// export default async function ProfilePage() {
//   const [whatsNewArticles] = await Promise.all([getWhatsNewArticles()]);
//   return (

//   );
// }

export default async function ProfilePage({
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

  return (
    <>
      <div className="flex  flex-row">
        <div className="relative max-h-full  w-full ">
          <div className="relative h-full bg-white shadow">
            <div className="flex h-full w-full  justify-between">
              <div className="fixed flex h-full w-1/6 flex-col bg-[#84B59F] p-6 text-left">
                <div className="relative ">
                  <Avatar
                    imageUrl={"/example.png" ?? undefined}
                    label="Image"
                    size="6xl"
                    className="h-60 w-auto"
                  />
                </div>
                <div className="my-2 text-2xl">Edward Chen</div>
                <div className="my-1.5 flex gap-2">
                  <TopicTag name="BIOLOGY"></TopicTag>
                  <TopicTag name="CHEMISTRY"></TopicTag>
                </div>
                <div className="my-2">
                  Short Author Bio Here. 1-3 Sentences. Fill text. Fill text.
                  Fill text. Fill text. Fill text. Fill text. Fill text. Fill
                  text. Fill text.Fill text. Fill text. Fill text. Fill text.
                  Fill text. Fill text. Fill text.Fill text.Fill text.Fill text.
                </div>
                <div className="mt-2.5 flex">
                  <FooterIcon type="instagram" />
                  <FooterIcon type="facebook" />
                </div>
              </div>
              <div className="w-1/6" />
              <div className="flex w-5/6 p-6 text-center">
                <div className="h-full">
                  <div className="flex flex-row gap-4 text-left text-2xl uppercase ">
                    <button className="text-whit rounded border bg-[#A3C9A8] px-3 py-1 text-[#344E41] outline">
                      Recent
                    </button>
                    <button className="text-whit rounded border bg-[#344E41] px-3 py-1 text-white outline">
                      Staff Picks
                    </button>
                    <button className="text-whit rounded border bg-[#344E41] px-3 py-1 text-white outline">
                      Trending
                    </button>
                  </div>
                  <div>
                    <div className="my-3 text-left">
                      <HomepageSection heading="Recent Articles" />
                    </div>
                    <div className="my-3 text-left">
                      <ArticleList articles={stories} />
                    </div>
                    <div className="my-3 text-right">
                      <Pagination total_pages={total_pages} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

async function getStories(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
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

async function getWhatsNewArticles() {
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const stories = await res
    .json()
    .then((value: GetStoriesResult) => value.stories);

  return stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
    publishedAt: new Date(story.publishedAt),
    updatedAt: new Date(story.updatedAt),
  }));
}
