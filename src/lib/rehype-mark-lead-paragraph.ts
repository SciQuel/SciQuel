export const STORY_LEAD_PARAGRAPH_CLASS = "story-lead-paragraph";

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
}

export function hasStoryLeadClass(className: unknown): boolean {
  if (typeof className === "string") {
    const classNames = className.split(" ");
    return classNames.includes(STORY_LEAD_PARAGRAPH_CLASS);
  }

  if (Array.isArray(className)) {
    for (const item of className) {
      const classNames = String(item).split(" ");
      if (classNames.includes(STORY_LEAD_PARAGRAPH_CLASS)) {
        return true;
      }
    }
  }

  return false;
}

function hasAsciiAlnum(node: HastNode): boolean {
  if (node.value?.match(/[A-Za-z0-9]/) || node.children?.some(hasAsciiAlnum)) {
    return true;
  }
  return false;
}

const IGNORE_TAGS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "large-image",
  "end-icon",
];

const ABORT_TAGS = ["ul", "ol", "blockquote"];

export default function rehypeMarkLeadParagraph(): (tree: {
  children?: HastNode[];
}) => void {
  return (tree) => {
    if (tree.children === undefined) {
      return;
    }

    for (const node of tree.children) {
      if (node.type !== "element" || node.tagName === undefined) {
        continue;
      }

      const tag = node.tagName;

      if (IGNORE_TAGS.includes(tag)) {
        continue;
      }

      if (ABORT_TAGS.includes(tag)) {
        return;
      }

      if (tag === "p") {
        if (!hasAsciiAlnum(node)) {
          continue;
        }

        if (node.properties === undefined) {
          node.properties = {};
        }

        const classes: string[] = [];
        const existing = node.properties.className;

        if (typeof existing === "string") {
          const parts = existing.split(" ");
          for (const part of parts) {
            if (part !== "") {
              classes.push(part);
            }
          }
        } else if (Array.isArray(existing)) {
          for (const item of existing) {
            const parts = String(item).split(" ");
            for (const part of parts) {
              if (part !== "") {
                classes.push(part);
              }
            }
          }
        }

        if (!classes.includes(STORY_LEAD_PARAGRAPH_CLASS)) {
          classes.push(STORY_LEAD_PARAGRAPH_CLASS);
        }

        node.properties.className = classes;
      }

      return;
    }
  };
}
