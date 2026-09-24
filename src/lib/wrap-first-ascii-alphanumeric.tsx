import { Children, cloneElement, isValidElement, type ReactNode } from "react";

/**
 * this is a helper service to wrap the first ASCII alphanumeric character in React children with a span, preserving the rest of the structure.
 * */

const QUOTE_MARKS = "\"'“”‘’";

function firstNonWhitespaceChar(node: ReactNode): string | null {
  if (node == null || typeof node === "boolean") {
    return null;
  }

  if (typeof node === "string" || typeof node === "number") {
    const text = String(node);
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== " " && text[i] !== "\n" && text[i] !== "\t") {
        return text[i];
      }
    }
    return null;
  }

  if (Array.isArray(node)) {
    for (const child of node as ReactNode[]) {
      const character = firstNonWhitespaceChar(child);
      if (character !== null) {
        return character;
      }
    }
    return null;
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return firstNonWhitespaceChar(props.children);
  }

  return null;
}

export function wrapFirstAsciiAlphanumeric(
  children: ReactNode,
  className: string,
): ReactNode {
  const firstCharacter = firstNonWhitespaceChar(children);
  if (firstCharacter !== null && QUOTE_MARKS.includes(firstCharacter)) {
    return children;
  }
  let found = false;

  // helper function to wrap string into a span isolating first Alphanum character
  const wrapInText = (text: string): ReactNode => {
    const firstAlNumIdx = text.search(/[A-Za-z0-9]/); // search for index of first ASCII [A-Za-z0-9]
    if (found || firstAlNumIdx < 0) {
      return text;
    }
    found = true;
    return (
      <>
        {text.slice(0, firstAlNumIdx)}
        <span className={className}>{text[firstAlNumIdx]}</span>
        {text.slice(firstAlNumIdx + 1)}
      </>
    );
  };

  const walk = (node: ReactNode): ReactNode => {
    // walks through JSX tree and builds new tree with first ascii alphanum char wrapped in span
    if (found || node == null || typeof node === "boolean") {
      return node;
    }

    if (typeof node === "string" || typeof node === "number") {
      return wrapInText(String(node));
    }
    if (Array.isArray(node)) {
      return Children.map(node, walk);
    }
    if (isValidElement(node)) {
      const props = node.props as { children?: ReactNode };
      const next = walk(props.children);
      if (next === props.children) {
        return node;
      }
      return cloneElement(node, undefined, next);
    }
    return node;
  };

  return walk(children);
}
