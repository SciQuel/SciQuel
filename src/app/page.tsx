import StaffPicksSection from "@/components/StaffPicksSection";
import TrendingSection from "@/components/TrendingSection";
import WhatsNewSection from "@/components/WhatsNewSection";
import env from "@/lib/env";
import { type GetStoriesResult } from "./api/stories/route";

export default async function Home() {
  const whatsNewArticles = await getWhatsNewArticles();

  return (
    <>
      {/* Article cards */}
      <div className="mx-[10%] my-10 flex flex-col gap-12">
        <WhatsNewSection articles={whatsNewArticles} />
        <TrendingSection articles={whatsNewArticles} />
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

  return res.json().then((value: GetStoriesResult) =>
    value.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    })),
  );
}
