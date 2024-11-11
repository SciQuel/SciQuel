import { type GetStoriesResult } from "@/app/api/stories/route";
import ArticleList from "@/components/ArticleList";
import HomepageSection from "@/components/HomepageSection";
import Pagination from "@/components/StoriesList/Pagination";
import env from "@/lib/env";
import { StoryTopic } from "@prisma/client";
import Link from "next/link";
import { z } from "zod";

interface Params {
  params: {
    topic: string;
  };
  searchParams: {
    page_number: string;
  };
}

const paramTopicSchema = z.preprocess(
  (value) => String(z.string().parse(value).toUpperCase()),
  z.nativeEnum(StoryTopic),
);

export default async function StoryTopicPage({ params }: Params) {
  const topicResult = paramTopicSchema.safeParse(params.topic);
  if (!topicResult.success) {
    return (
      <div className="flex h-screen w-full flex-col items-center pt-24 font-quicksand">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p>
          Sorry, no topic exists under this name. Consider exploring the sidebar
          for links to existing topics.
        </p>
      </div>
    );
  }

  const storyResult = await getStories(params.topic);

  if (!storyResult) {
    return (
      <div className="flex h-screen w-full flex-col items-center pt-24 font-quicksand">
        <h1 className="text-2xl font-semibold">Oh no! Something went wrong.</h1>
        <p>
          Sorry, something went wrong while loading stories. Please try again
          later or{" "}
          <Link className="text-sciquelTeal underline" href="/leave-feedback">
            contact us
          </Link>{" "}
          if the problem continues.
        </p>
      </div>
    );
  }

  const { stories, total_pages } = storyResult;

  return (
    <div className="mx-[10%] my-10 flex flex-col gap-12 font-quicksand">
      <HomepageSection heading={params.topic.toLowerCase().replace("_", " ")}>
        {stories.length > 0 ? (
          <>
            <ArticleList articles={stories} preferHorizontal={true} />

            <Pagination total_pages={total_pages} />
          </>
        ) : (
          <h2 className="text-3xl font-[550] text-sciquelHeading">No Result</h2>
        )}
      </HomepageSection>
    </div>
  );
}

async function getStories(topic: string) {
  const route = `${env.NEXT_PUBLIC_SITE_URL}/api/stories?topic=${topic}`;

  try {
    const res = await fetch(route, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as GetStoriesResult;

    data.stories = data.stories.map((story) => ({
      ...story,
      createdAt: new Date(story.createdAt),
      publishedAt: new Date(story.publishedAt),
      updatedAt: new Date(story.updatedAt),
    }));

    return data;
  } catch (err) {
    return null;
  }
}
