import StoryH1 from "@/components/story-components/StoryH1";
import StoryParagraph from "@/components/story-components/StoryParagraph";
import { createElement, Fragment, type HTMLProps } from "react";
import rehypeReact from "rehype-react";
import rehypeSanitize from "rehype-sanitize";
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
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        p(props: HTMLProps<HTMLParagraphElement>) {
          return <StoryParagraph>{props.children}</StoryParagraph>;
        },
        h1(props: HTMLProps<HTMLHeadingElement>) {
          return <StoryH1>{props.children}</StoryH1>;
        },
      },
    })
    .process(content);
  return file;
}
