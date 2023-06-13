import StoryH1 from "@/components/story-components/StoryH1";
import StoryLargeImage from "@/components/story-components/StoryLargeImage";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { createElement, Fragment, type HTMLProps } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import content from "./example.md";

export default async function StoriesPage() {
  const htmlContent = await generateMarkdown();
  // console.log(htmlContent.result);
  return <div className="flex flex-col gap-5 pt-10">{htmlContent.result}</div>;
}

async function generateMarkdown() {
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
