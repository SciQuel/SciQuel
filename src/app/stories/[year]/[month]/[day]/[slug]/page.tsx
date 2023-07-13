import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
import StoryH1 from "@/components/story-components/StoryH1";
import StoryH2 from "@/components/story-components/StoryH2";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import TopicTag from "@/components/TopicTag";
import env from "@/lib/env";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { StoryContribution, type StoryTopic } from "@prisma/client";
import { DateTime } from "luxon";
import { createElement, Fragment, type HTMLProps } from "react";
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
    <>
      <div
        style={{
          backgroundImage: `url(${story.thumbnailUrl})`,
        }}
        className="flex h-screen w-screen flex-col justify-end"
      >
        <h1
          className="p-8 font-alegreyaSansSC text-8xl"
          style={{ color: story.titleColor }}
        >
          {story.title}
        </h1>
        <h2
          className="p-8 pt-0 font-alegreyaSansSC text-5xl"
          style={{ color: story.summaryColor }}
        >
          {story.summary}
        </h2>
      </div>
      <div
        className="mx-2 mt-5 flex w-screen flex-col md:mx-auto  md:w-[720px]"
        // style={{ backgroundColor: "lime" }}
      >
        <div className="flex flex-row">
          <p className="mr-2 flex flex-row">
            {story.storyType.slice(0, 1) +
              story.storyType.slice(1).toLowerCase()}{" "}
            | we need to add article type |
          </p>{" "}
          {story.tags.map((item: StoryTopic, index: number) => {
            return <TopicTag name={item} key={item + index} />;
          })}
        </div>
        <div>
          {story.storyContributions.map((element, index) => {
            return (
              <p>
                {element.contributionType == "AUTHOR"
                  ? `by ${element.user.firstName} ${element.user.lastName}`
                  : `${element.contributionType} by ${element.user.firstName} ${element.user.lastName}`}
              </p>
            );
          })}
        </div>
        <p>
          {DateTime.fromISO(story.publishedAt).toLocaleString({
            ...DateTime.DATETIME_MED,
            timeZoneName: "short",
          })}
          {story.updatedAt != story.publishedAt
            ? " | " +
              DateTime.fromISO(story.updatedAt).toLocaleString({
                ...DateTime.DATETIME_MED,
                timeZoneName: "short",
              })
            : ""}
        </p>
      </div>
      <div className="mx-2 mt-2 flex flex-col items-center gap-5 md:mx-auto">
        {htmlContent.result}
      </div>
    </>
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
