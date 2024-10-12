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

  // Accumulator for current section content (text + images)
  let currentSection: Section = { type: "Text", content: "" };

  // Process each node in the parsed MDAST tree
  for (const node of tree.children) {
    if (node.type === "paragraph" && "children" in node) {
      const paragraphNode = node as Paragraph;

      for (const child of paragraphNode.children) {
        if ("value" in child && typeof child.value === "string") {
          const textContent = child.value.trim();

          // Detect the custom image marker (e.g., ::large-image)
          if (textContent.startsWith("::large-image")) {
            // Append the image marker directly into the current section's content
            currentSection.content += textContent + "\n";
          } else {
            // Append text content to the current section
            currentSection.content += textContent + "\n\n"; // Add extra spacing between paragraphs
          }
        }
      }
    }
  }

  // Push the final accumulated section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }

  return sections;
}

export default parseMarkdownToSections;

