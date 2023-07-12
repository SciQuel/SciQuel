import { type Plugin, type Transformer } from "unified";
import { type Node } from "unist";
import { visit } from "unist-util-visit";

const retextWordCount: Plugin<[Record<string, number>]> = (wordCount) => {
  const transformNodeTree: Transformer = (nodeTree) => {
    const counts: Record<string, number> = {};
    visit(nodeTree, (node) => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    for (const key in counts) {
      wordCount[key] = counts[key];
    }
  };
  return transformNodeTree;
};

export default retextWordCount;
