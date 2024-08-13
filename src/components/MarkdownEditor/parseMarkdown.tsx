import { Paragraph, Root } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";

interface Section {
  type: string;
  content: string;
}

function parseMarkdownToSections(markdown: string): Section[] {
  const sections: Section[] = [];

  // Parse the markdown into an MDAST tree
  const tree = unified().use(remarkParse).parse(markdown) as Root;

  // console.log("Markdown string to parse:", markdown);
  // console.log("Parsed MDAST Tree:", tree);

  // accumulates all text into a section
  let currentTextSection: Section | null = null;

  // go through every node in the tree and parse into sections
  for (const node of tree.children) {
    console.log("Processing node:", node);

    if (node.type === "paragraph" && "children" in node) {
      const paragraphNode = node as Paragraph;

      for (const child of paragraphNode.children) {
        if ("value" in child && typeof child.value === "string") {
          const textContent = child.value.trim();

          // markdown images are ![], but this seemed like custom
          if (textContent.startsWith("::large-image")) {
            // if there's text before it, get the accumulated text and push it to a box
            if (currentTextSection && currentTextSection.content.trim()) {
              sections.push(currentTextSection);
              currentTextSection = null; // reset accumulated text
            }
            sections.push({
              type: "Image",
              content: textContent,
            });
          } else {
            // if not an image, we are in a separate paragraph (format it!)
            if (!currentTextSection) {
              currentTextSection = { type: "Text", content: "" };
            }
            currentTextSection.content += textContent + "\n" + "\n";
          }
        }
      }
    }
  }
  // get any leftover text and add it to the last textbox
  if (currentTextSection && currentTextSection.content.trim()) {
    sections.push(currentTextSection);
  }

  console.log("Parsed Sections before return:", sections);

  return sections;
}
export default parseMarkdownToSections;
