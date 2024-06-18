import StaffPicksSection from "@/components/StaffPicksSection";
import TrendingSection from "@/components/TrendingSection";
import WhatsNewSection from "@/components/WhatsNewSection";
import env from "@/lib/env";
import { type GetStoryResult } from "./api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "./api/stories/route";

export default async function Home() {
  const [whatsNewArticles, exampleStory] = await Promise.all([
    getWhatsNewArticles(),
    getExampleStory(),
  ]);

  return (
    <>
      {/* Article cards */}
      <div className="mx-[10%] mb-10 mt-2 flex flex-col gap-12">
        <WhatsNewSection articles={whatsNewArticles} />
        <TrendingSection articles={[exampleStory]} />
        <StaffPicksSection articles={whatsNewArticles} />
      </div>
    </>
  );
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

async function getExampleStory() {
  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api/stories/2022/01/11/lights-camera-action`,
    {
      next: { revalidate: 60 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json().then((value: GetStoryResult) => {
    return {
      ...value,
      createdAt: new Date(value.createdAt),
      publishedAt: new Date(value.publishedAt),
      updatedAt: new Date(value.updatedAt),
    };
  });
}
