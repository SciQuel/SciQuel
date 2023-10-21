"use client";

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { DictionaryContext } from "./DictionaryContext";
import DictionaryWord from "./DictionaryWord";

export default function DictionarySentence({ children }: PropsWithChildren) {
  const fullDictionary = useContext(DictionaryContext);
  const sentenceRef = useRef<HTMLSpanElement>(null);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (
      fullDictionary?.selectedInstance &&
      sentenceRef.current &&
      sentenceRef.current.contains(fullDictionary.selectedInstance.instance)
    ) {
      setHighlight(true);
    }
  }, [fullDictionary?.selectedInstance]);

  useEffect(() => {
    if (highlight) {
      setTimeout(() => {
        setHighlight(false);
      }, 3000);
    }
  }, [highlight]);

  return (
    <span
      ref={sentenceRef}
      className={`${
        highlight ? "rounded bg-sciquelGreen  " : ""
      } relative transition-all duration-500`}
    >
      {children}
    </span>
  );
}
