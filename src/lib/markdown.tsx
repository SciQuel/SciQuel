import StoryCaptionCitation from "@/components/story-components/StoryCaptionCitation";
import StoryH1 from "@/components/story-components/StoryH1";
import StoryH2 from "@/components/story-components/StoryH2";
import StoryH3 from "@/components/story-components/StoryH3";
import StoryH4 from "@/components/story-components/StoryH4";
import StoryH5 from "@/components/story-components/StoryH5";
import StoryH6 from "@/components/story-components/StoryH6";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { createElement, Fragment, type HTMLProps } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import { unified } from "unified";
import retextWordCount from "./retext-word-count";

export async function generateMarkdown(content: string) {
  const wordStats: Record<string, number> = {};

  const remarkResult = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkSciquelDirective)
    .use(
      remarkRetext,
      unified().use(retextEnglish).use(retextWordCount, wordStats),
    )
    .use(remarkRehype)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        "large-image": ["src"],
      },
      tagNames: [
        ...(defaultSchema.tagNames ?? []),
        "large-image",
        "caption-citation",
      ],
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
        h3: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH3>{props.children}</StoryH3>
        ),
        h4: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH4>{props.children}</StoryH4>
        ),
        h5: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH5>{props.children}</StoryH5>
        ),
        h6: (props: HTMLProps<HTMLHeadingElement>) => (
          <StoryH6>{props.children}</StoryH6>
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
        "caption-citation": (props: HTMLProps<HTMLElement>) => {
          console.log(1);
          return <StoryCaptionCitation>{props.children}</StoryCaptionCitation>;
        },
      },
    })
    .process(content);

  return { file: await remarkResult, wordStats };
}
