import { h } from "hastscript";
import { type Directive as DirectiveNode } from "mdast-util-directive";
import { type Plugin, type Transformer } from "unified";
import { type Node } from "unist";
import { map, type MapFunction } from "unist-util-map";

const isDirectiveNode = (node: Node): node is DirectiveNode => {
  const { type } = node;
  return (
    type === "textDirective" ||
    type === "leafDirective" ||
    type === "containerDirective"
  );
};

const allowedDirectives = [
  "large-image",
  "caption-citation",
  "dropdown",
  "gray-text",
  "end-icon",
];

const mapDirectiveNode: MapFunction = (node) => {
  if (!isDirectiveNode(node)) {
    return node;
  }

  if (allowedDirectives.includes(node.name)) {
    const { properties, tagName } = h(node.name, node.attributes ?? undefined);
    return {
      ...node,
      data: {
        hName: tagName,
        hProperties: properties,
      },
    };
  }

  return {
    ...node,
    data: {
      hName: "p",
    },
  };
};

const transformNodeTree: Transformer = (nodeTree) =>
  map(nodeTree, mapDirectiveNode);

const remarkSciquelDirective: Plugin = () => transformNodeTree;

export default remarkSciquelDirective;
