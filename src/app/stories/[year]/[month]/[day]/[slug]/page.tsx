import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import { type ReactNode } from "react";

interface Params {
  params: {
    year: string;
    month: string;
    day: string;
    slug: string;
  };
}

export default async function StoriesPage({ params }: Params) {
  const story = await retrieveStoryContent(params);
  const { file } = await generateMarkdown(story.storyContent[0].content);
  return (
    <div className="flex flex-col gap-5 pt-10 @container">
      {file.result as ReactNode}
    </div>
  );
}

async function retrieveStoryContent({
  year,
  day,
  month,
  slug,
}: Params["params"]) {
  const storyRoute = `/stories/${year}/${month}/${day}/${slug}`;
  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}?include_content=true`,
    {
      next: { tags: [storyRoute] },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return (await res.json()) as GetStoryResult;
}
