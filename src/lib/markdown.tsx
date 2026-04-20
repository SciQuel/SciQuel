import StoryBlockquote from "@/components/story-components/markdown/StoryBlockquote";
import StoryCaptionCitation from "@/components/story-components/markdown/StoryCaptionCitation";
import StoryCode from "@/components/story-components/markdown/StoryCode";
import StoryDropdown from "@/components/story-components/markdown/StoryDropdown";
import StoryEndIcon from "@/components/story-components/markdown/StoryEndIcon";
import StoryGrayText from "@/components/story-components/markdown/StoryGrayText";
import StoryH1 from "@/components/story-components/markdown/StoryH1";
import StoryH2 from "@/components/story-components/markdown/StoryH2";
import StoryLargeImage from "@/components/story-components/markdown/StoryLargeImage";
import StoryLink from "@/components/story-components/markdown/StoryLink";
import StoryOl from "@/components/story-components/markdown/StoryOl";
import StoryParagraph from "@/components/story-components/markdown/StoryParagraph";
import StoryPre from "@/components/story-components/markdown/StoryPre";
import StoryUl from "@/components/story-components/markdown/StoryUl";
import remarkSciquelDirective from "@/lib/remark-sciquel-directive";
import { type HTMLProps } from "react";
import production from "react/jsx-runtime";
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
      // https://github.com/remarkjs/remark-retext/issues/17
      // ignore the questionable typing here
      // seems to be a known problem
      unified()
        .use(retextEnglish)
        .use(retextWordCount, wordStats) as unknown as boolean,
    )
    .use(remarkRehype)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        "large-image": ["src", "alt"],
      },
      tagNames: [
        ...(defaultSchema.tagNames ?? []),
        "large-image",
        "caption-citation",
        "dropdown",
        "gray-text",
        "end-icon",
      ],
    })
    .use(rehypeReact, {
      Fragment: production.Fragment,
      jsx: production.jsx,
      jsxs: production.jsxs,
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
        ol: (props: HTMLProps<HTMLOListElement>) => (
          <StoryOl>{props.children}</StoryOl>
        ),
        blockquote: (props: HTMLProps<HTMLElement>) => (
          <StoryBlockquote>{props.children}</StoryBlockquote>
        ),
        code: (props: HTMLProps<HTMLElement>) => (
          <StoryCode>{props.children}</StoryCode>
        ),

        pre: (props: HTMLProps<HTMLElement>) => (
          <StoryPre>{props.children}</StoryPre>
        ),

        a: (props: HTMLProps<HTMLAnchorElement>) => (
          <StoryLink href={props.href}>{props.children}</StoryLink>
        ),

        dropdown: (props: HTMLProps<HTMLElement>) => (
          <StoryDropdown>{props.children}</StoryDropdown>
        ),

        "large-image": (props: HTMLProps<HTMLElement>) => {
          if (typeof props.src === "string") {
            return (
              <StoryLargeImage src={props.src} alt={props.alt}>
                {props.children}
              </StoryLargeImage>
            );
          }
          return <></>;
        },
        "gray-text": (props: HTMLProps<HTMLElement>) => {
          if (props.children) {
            return <StoryGrayText>{props.children}</StoryGrayText>;
          } else {
            return <></>;
          }
        },

        "caption-citation": (props: HTMLProps<HTMLElement>) => {
          if (props.children) {
            return (
              <StoryCaptionCitation>{props.children}</StoryCaptionCitation>
            );
          } else {
            return <></>;
          }
        },
        "end-icon": () => <StoryEndIcon />,
      },
    })
    .process(content);

  return { file: await remarkResult, wordStats };
}
