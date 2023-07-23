import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import FromThisSeries from "@/components/story-components/FromThisSeries";
import ShareLinks from "@/components/story-components/ShareLinks";
import StoryH1 from "@/components/story-components/StoryH1";
import StoryH2 from "@/components/story-components/StoryH2";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import StoryUl from "@/components/story-components/StoryUl";
import TopicTag from "@/components/TopicTag";
import env from "@/lib/env";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { type StoryTopic } from "@prisma/client";
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
  const story = await retrieveStoryContent(params);
  const htmlContent = await generateMarkdown(story.storyContent[0].content);
  return (
    <div className="flex flex-col">
      <div className="relative h-screen">
        <Image
          src={story.thumbnailUrl}
          className="-z-10 h-full object-cover"
          fill={true}
          alt={story.title}
        />
        <div className="relative flex h-full flex-col justify-end px-12 pb-24 pt-10">
          <h1
            className="w-4/5 p-8 font-alegreyaSansSC text-6xl font-bold sm:text-8xl"
            style={{ color: story.titleColor }}
          >
            {story.title}
          </h1>
          <h2
            className="w-5/6 p-8 pt-0 font-alegreyaSansSC text-4xl font-semibold"
            style={{ color: story.summaryColor }}
          >
            {story.summary}
          </h2>
        </div>
      </div>
      <div className="relative mx-2 mt-5 flex w-screen flex-col md:mx-auto md:w-[720px]">
        <div className="absolute right-0 top-0 flex flex-1 flex-row justify-center xl:-left-24  xl:flex-col xl:pt-3">
          <ShareLinks />
        </div>

        <div className="flex flex-row">
          <p className="mr-2">
            {story.storyType.slice(0, 1) +
              story.storyType.slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>{" "}
          {story.tags.map((item: StoryTopic, index: number) => {
            return <TopicTag name={item} key={`${item}-${index}`} />;
          })}
        </div>
        <div>
          {story.storyContributions.map((element, index) => {
            return (
              <p key={`contributor-header-${index}`}>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </p>
            );
          })}
        </div>
        <p>
          {DateTime.fromJSDate(story.publishedAt).toLocaleString({
            ...DateTime.DATETIME_MED,
            timeZoneName: "short",
          })}
          {story.updatedAt != story.publishedAt
            ? " | " +
              DateTime.fromJSDate(story.updatedAt).toLocaleString({
                ...DateTime.DATETIME_MED,
                timeZoneName: "short",
              })
            : ""}
        </p>
      </div>
      <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
        {htmlContent.result as ReactNode}
      </div>
      <p className="w-[calc( 100% - 1rem )] mx-2 my-5 border-t-2 border-[#616161]  text-sm text-[#616161] md:mx-auto md:w-[720px]">
        Animation provided by Source name 1. Sources provided by Source name 2.
        We thank Funding 1 for their support, and Professor 2 for their
        guidance. Ex. Cover Image: “Hawaiian Bobtail Squid” is licensed under CC
        BY-NC 4.0.
      </p>
      {story.storyContributions.map((element, index) => (
        <div
          key={`contributor-footer-${index}`}
          className="w-[calc( 100% - 1rem )] mx-2 mb-3 flex flex-row items-stretch rounded-2xl border border-sciquelCardBorder p-3 shadow-md md:mx-auto md:w-[720px]"
        >
          <div className="m-5 aspect-square h-full flex-1 rounded-full bg-slate-600 text-center">
            temp
          </div>
          <div className="m-5 flex flex-[2.3] flex-col">
            <p className="font-alegreyaSansSC text-4xl font-medium text-sciquelTeal">
              {element.user.firstName} {element.user.lastName}
            </p>
            <p className="flex-1 font-sourceSerif4 text-xl">
              {element.user.bio}
            </p>
          </div>
        </div>
      ))}
      <FromThisSeries />
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
