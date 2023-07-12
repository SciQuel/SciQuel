import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import env from "@/lib/env";

interface Params {
  params: {
    topic: string;
  };
}

export default async function StoriesListPage({ params }: Params) {
  const { topic } = params;
  const articles = await getStories(params);

  return (
    <>
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <HomepageSection heading={`${topic.toUpperCase()}`}>
          <ArticleList articles={articles} preferHorizontal={true} />
        </HomepageSection>
      </div>
    </>
  );
}

async function getStories({ topic }: Params["params"]) {
  const route = `/stories?topic=${topic}`;
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api${route}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json().then((value: GetStoriesResult) =>
    value.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    })),
  );
}
