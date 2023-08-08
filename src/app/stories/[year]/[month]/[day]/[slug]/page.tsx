import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import { type GetStoriesResult } from "@/app/api/stories/route";
import Avatar from "@/components/Avatar";
import MoreCard from "@/components/MoreCard";
import FromThisSeries from "@/components/story-components/FromThisSeries";
import { PrintModeProvider } from "@/components/story-components/PrintContext";
import ShareLinks from "@/components/story-components/ShareLinks";
import StoryCredits from "@/components/story-components/StoryCredits";
import StoryH1 from "@/components/story-components/StoryH1";
import StoryH2 from "@/components/story-components/StoryH2";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import StoryUl from "@/components/story-components/StoryUl";
import TopicTag from "@/components/TopicTag";
import { tagUser } from "@/lib/cache";
import env from "@/lib/env";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { DateTime } from "luxon";
import Image from "next/image";
import { createElement, Fragment, type HTMLProps, type ReactNode } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

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
  const htmlContent = await generateMarkdown(story.storyContent[0].content);
  return (
    <PrintModeProvider>
      <div className="flex flex-col">
        <StoryCredits story={story} />

        <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
          {htmlContent.result as ReactNode}
        </div>
        <p className="w-[calc( 100% - 1rem )] mx-2 my-5 border-t-2 border-[#616161]  text-sm text-[#616161] md:mx-auto md:w-[720px]">
          Animation provided by Source name 1. Sources provided by Source name
          2. We thank Funding 1 for their support, and Professor 2 for their
          guidance. Ex. Cover Image: “Hawaiian Bobtail Squid” is licensed under
          CC BY-NC 4.0.
        </p>
        {story.storyContributions.map((element, index) => (
          <div
            key={`contributor-footer-${index}`}
            className="w-[calc( 100% - 1rem )] mx-2 mb-3 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[720px]"
          >
            <Avatar
              imageUrl={element.user.avatarUrl ?? undefined}
              label={element.user.firstName[0]}
              className="m-5"
              size="4xl"
            />
            <div className="m-5 flex flex-[2.3] flex-col">
              <p className="flex-1 font-sourceSerif4 text-xl">
                <span className="font-alegreyaSansSC text-3xl font-medium text-sciquelTeal">
                  {element.user.firstName} {element.user.lastName}{" "}
                </span>
                {element.user.bio}
              </p>
            </div>
          </div>
        ))}
        <FromThisSeries />
        <MoreCard articles1={whatsNewArticles} articles2={whatsNewArticles} />
      </div>
    </PrintModeProvider>
  );
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

async function generateMarkdown(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkSciquelDirective)
    .use(remarkRehype)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        "large-image": ["src"],
      },
      tagNames: [...(defaultSchema.tagNames ?? []), "large-image"],
    })
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        p: (props: HTMLProps<HTMLParagraphElement>) => (
          <StoryParagraph>{props.children}</StoryParagraph>
        ),
        h1: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH1>{props.children}</StoryH1>
        ),
        h2: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH2>{props.children}</StoryH2>
        ),
        ul: (props: HTMLProps<HTMLUListElement>) => (
          <StoryUl>{props.children}</StoryUl>
        ),
        "large-image": (props: HTMLProps<HTMLElement>) => {
          if (typeof props.src === "string") {
            return (
              <StoryLargeImage src={props.src}>
                {props.children}
              </StoryLargeImage>
            );
          }
          return <></>;
        },
      },
    })
    .process(content);
  return file;
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
