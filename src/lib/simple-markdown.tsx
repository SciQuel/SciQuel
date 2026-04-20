import { type HTMLProps } from "react";
import production from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function generateBasicMarkdown(content: string) {
  const remarkResult = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize, {
      ...defaultSchema,
      tagNames: ["p", "strong", "em", "u", "a", "br"],
      attributes: {
        ...defaultSchema.attributes,
        a: ["href"],
      },
    })
    .use(rehypeReact, {
      Fragment: production.Fragment,
      jsx: production.jsx,
      jsxs: production.jsxs,
      components: {
        p: (props: HTMLProps<HTMLParagraphElement>) => (
          <p {...props}>{props.children}</p>
        ),
        strong: (props: HTMLProps<HTMLElement>) => (
          <strong {...props}>{props.children}</strong>
        ),
        em: (props: HTMLProps<HTMLElement>) => (
          <em {...props}>{props.children}</em>
        ),
        u: (props: HTMLProps<HTMLElement>) => (
          <u {...props}>{props.children}</u>
        ),
        a: (props: HTMLProps<HTMLAnchorElement>) => (
          <a {...props} href={props.href}>
            {props.children}
          </a>
        ),
      },
    })
    .process(content);

  return { file: await remarkResult };
}
