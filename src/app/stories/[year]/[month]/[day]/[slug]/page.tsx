import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryFooter from "@/components/story-components/StoryFooter";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import { generateMarkdown } from "@/lib/markdown";
import { type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import { getServerSession } from "next-auth";
import Image from "next/image";
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
  const whatsNewArticles = await getWhatsNewArticles();
  const story = await retrieveStoryContent(params);
  // retrieveUserInteractions(story.id);

  const { file } = await generateMarkdown(story.storyContent[0].content);
  return (
    <PrintModeProvider>
      <div className="flex flex-col">
        <StoryCredits story={story} />

        <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
          {file.result as ReactNode}
        </div>
        <p className="w-[calc( 100% - 1rem )] mx-2 my-5 border-t-2 border-[#616161]  text-sm text-[#616161] md:mx-auto md:w-[720px]">
          Animation provided by Source name 1. Sources provided by Source name
          2. We thank Funding 1 for their support, and Professor 2 for their
          guidance. Ex. Cover Image: “Hawaiian Bobtail Squid” is licensed under
          CC BY-NC 4.0.
        </p>
        <StoryFooter
          storyContributions={story.storyContributions}
          articles1={whatsNewArticles}
          articles2={whatsNewArticles}
        />
      </div>
    </PrintModeProvider>
  );
}

async function retrieveUserInteractions(storyId: string) {
  const userSession = await getServerSession();
  if (userSession?.user.email) {
    let bookmarked = false;
    let brained = false;

    const searchParams = new URLSearchParams({
      story_id: storyId,
      user_email: userSession.user.email,
    });

    console.log("search params are: ", searchParams.toString());

    const bookmarkUrl = `${
      env.NEXT_PUBLIC_SITE_URL
    }/api/user/bookmark?${searchParams.toString()}`;
    // const bookmarkUrl = `${env.NEXT_PUBLIC_SITE_URL}/api/user/bookmark?story_id=${storyId}&user_email=${userSession.user.email}}`;
    const brainUrl = `${
      env.NEXT_PUBLIC_SITE_URL
    }/api/user/brains?${searchParams.toString()}`;

    console.log("bookmark url: ", bookmarkUrl);
    console.log("brain url: ", brainUrl);

    const bookRes = await fetch(brainUrl, {
      next: {
        revalidate: 0,
      },
    });
    console.log("bookres: ", bookRes);
    const json = await bookRes.json();
    console.log("bookres error: ", json);
  }
}

async function retrieveStoryContent({
  year,
  day,
  month,
  slug,
}: Params["params"]) {
  const storyRoute = `/stories/${year}/${month}/${day}/${slug}`;
  const prefetchedMetadataRes = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}`,
  );

  if (!prefetchedMetadataRes.ok) {
    throw new Error("Failed to fetch metadata");
  }

  const prefetchedMetadata =
    (await prefetchedMetadataRes.json()) as GetStoryResult;

  const res = await fetch(
    `${env.NEXT_PUBLIC_SITE_URL}/api${storyRoute}?include_content=true`,
    {
      next: {
        tags: [
          storyRoute,
          ...prefetchedMetadata.storyContributions.map((contribution) =>
            tagUser(contribution.user.id),
          ),
        ],
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const json = (await res.json()) as GetStoryResult;

  return {
    ...json,
    createdAt: new Date(json.createdAt),
    publishedAt: new Date(json.publishedAt),
    updatedAt: new Date(json.updatedAt),
  } as GetStoryResult;
}

/// temporary
async function getWhatsNewArticles() {
  const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/stories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json().then((value: GetStoriesResult) =>
    value.stories.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    })),
  );
}
