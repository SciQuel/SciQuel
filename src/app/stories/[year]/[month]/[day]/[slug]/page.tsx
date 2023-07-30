import { type GetStoryResult } from "@/app/api/stories/[year]/[month]/[day]/[slug]/route";
///testing
import { type GetStoriesResult } from "@/app/api/stories/route";
import MoreCard from "@/components/MoreCard";
import StoryH1 from "@/components/story-components/StoryH1";
import StoryH2 from "@/components/story-components/StoryH2";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import env from "@/lib/env";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
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
    <div className="flex flex-col gap-5 pt-10">
      {htmlContent.result as ReactNode}
      <MoreCard articles1={whatsNewArticles} articles2={whatsNewArticles} />
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

/// temporary
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
