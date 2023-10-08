"use client";

import { useContext, useEffect, useRef, type PropsWithChildren } from "react";
import { DictionaryContext } from "./DictionaryContext";

interface Props {
  word: string;
}

function parsePreviousNode(node: ChildNode, fullSentence: string) {
  // temporary while I don't know what the backend is doing
  const searchExp = /(?:[.?!]\s+)((?:[^.?!]|(?:\.\d))+)$/;

  switch (node.nodeName) {
    case "#text":
    case "SPAN":
    case "CODE":
    case "BUTTON":
      if (node.textContent) {
        const innerText = searchExp.exec(node.textContent);

        if (innerText && innerText.length > 1) {
          return innerText[1] + fullSentence;
        } else if (node.previousSibling) {
          return parsePreviousNode(
            node.previousSibling,
            node.textContent + fullSentence,
          );
        }
        return node.textContent + fullSentence;
      } else if (node.previousSibling) {
        return parsePreviousNode(node.previousSibling, fullSentence);
      }
      return fullSentence;

    default:
      console.warn("found previous node of name: ", node.nodeName);
      if (node.previousSibling) {
        return parsePreviousNode(node.previousSibling, fullSentence);
      }
      return fullSentence;
  }
}

function parseNextNode(node: ChildNode, fullSentence: string) {
  // temporary while I don't know what the backend is doing
  const searchExp = /^(?:[^.?!]|(?:\.\S))+[.?!]+\s/;

  switch (node.nodeName) {
    case "#text":
    case "SPAN":
    case "CODE":
    case "BUTTON":
      if (node.textContent) {
        const endText = searchExp.exec(node.textContent);

        if (endText) {
          return fullSentence + endText[0];
        } else if (node.nextSibling) {
          return parseNextNode(
            node.nextSibling,
            fullSentence + node.textContent,
          );
        } else {
          return fullSentence + node.textContent;
        }
      } else if (node.nextSibling) {
        return parseNextNode(node.nextSibling, fullSentence);
      }

      return fullSentence;
    default:
      console.warn("found next node of name: ", node.nodeName);
      console.warn(node);
      if (node.nextSibling) {
        return parseNextNode(node.nextSibling, fullSentence);
      }
      return fullSentence;
  }
}

function getText(node: ChildNode) {
  if (node.parentNode && node.parentNode.textContent) {
    return node.parentNode.textContent;
  } else if (node.textContent) {
    return node.textContent;
  } else {
    return;
  }
}

export default function DictionaryWord({
  word,
  children,
}: PropsWithChildren<Props>) {
  const dictionary = useContext(DictionaryContext);

  const scrollRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log("inside word: ", word);
    if (dictionary && scrollRef.current) {
      const newDict = Object.assign({}, dictionary.dictionary);
      console.log(scrollRef.current);

      // build sentence?

      // let fullSentence = scrollRef.current.textContent
      //   ? scrollRef.current.textContent
      //   : "";

      // if (scrollRef.current.previousSibling) {
      //   fullSentence = parsePreviousNode(
      //     scrollRef.current.previousSibling,
      //     fullSentence,
      //   );
      // }
      // if (scrollRef.current.nextSibling) {
      //   fullSentence = parseNextNode(
      //     scrollRef.current.nextSibling,
      //     fullSentence,
      //   );
      // }
      // console.log("final full sentence is: ", fullSentence);

      const text = getText(scrollRef.current);

      if (text && !newDict[word].instances[text]) {
        if (scrollRef.current.parentElement) {
          newDict[word].instances[text] = scrollRef.current.parentElement;
          dictionary.setDictionary(newDict);
        }
        newDict[word].instances[text] = scrollRef.current;
        dictionary.setDictionary(newDict);
      }
    }
  }, []);

  return (
    <button
      ref={scrollRef}
      onClick={() => {
        if (dictionary && dictionary?.dictionary[word]) {
          dictionary.setWord({
            ...dictionary?.dictionary[word],
            word: word,
          });
          dictionary.setOpen(true);
          dictionary.setPreviousWords([]);
        }
      }}
      type="button"
      className="fw-bold m-0 rounded-lg border-2 border-sciquelTeal px-2 text-sciquelTeal"
    >
      {children ? children : word}
    </button>
  );
}
