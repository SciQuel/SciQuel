"use client";

import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

export interface Instances {
  sentence: string;
  elementRef: HTMLElement;
}

interface SelectedInstance {
  index: number;
  instance: HTMLElement;
}

export interface DictionaryDefinition {
  id: string;
  word: string;
  definition: string;
  inContext: string[];
  altSpellings: string[];

  instances: Instances[];
  bookmarked: boolean | undefined;
}

interface FullDictionary {
  dict: DictionaryDefinition[];
  lastClickedRef: HTMLElement | null;
}

interface DictionaryContextVal {
  dictionary: FullDictionary;
  setDictionary: Dispatch<SetStateAction<FullDictionary>>;
  word: DictionaryDefinition | null;
  setWord: Dispatch<SetStateAction<DictionaryDefinition | null>>;
  previousWords: (DictionaryDefinition | "fullDict")[];
  setPreviousWords: Dispatch<
    SetStateAction<(DictionaryDefinition | "fullDict")[]>
  >;
  selectedInstance: SelectedInstance | null;
  setSelectedInstance: Dispatch<SetStateAction<SelectedInstance | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DictionaryContext = createContext<DictionaryContextVal | null>(
  null,
);

interface Props {
  dictionary: DictionaryDefinition[];
}

export function DictionaryProvider({
  children,
  dictionary,
}: PropsWithChildren<Props>) {
  const [dictionarySelect, setDictionarySelect] =
    useState<DictionaryDefinition | null>(null);

  const [fullDict, setFullDict] = useState<FullDictionary>({
    dict: dictionary,
    lastClickedRef: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  const [historyList, setHistoryList] = useState<
    (DictionaryDefinition | "fullDict")[]
  >([]);

  const [highlightedInstance, setHighlightedInstance] =
    useState<SelectedInstance | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedInstance(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedInstance(null);
  }, [dictionarySelect]);

  return (
    <DictionaryContext.Provider
      value={{
        dictionary: fullDict,
        setDictionary: setFullDict,
        word: dictionarySelect,
        setWord: setDictionarySelect,
        previousWords: historyList,
        setPreviousWords: setHistoryList,
        selectedInstance: highlightedInstance,
        setSelectedInstance: setHighlightedInstance,
        open: isOpen,
        setOpen: setIsOpen,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}

function cloneInstances(instances: Instances[]) {
  let newInstanceList: Instances[] = [];

  instances.forEach((item) => {
    newInstanceList.push({
      sentence: item.sentence,
      elementRef: item.elementRef,
    });
  });

  return newInstanceList;
}

export function deepCloneDict(dict: DictionaryDefinition[]) {
  let newDict: DictionaryDefinition[] = [];

  dict.forEach((item) => {
    newDict.push({
      id: item.id,
      word: item.word,
      definition: item.definition,
      inContext: [...item.inContext],
      altSpellings: [...item.altSpellings],

      instances: cloneInstances(item.instances),
      bookmarked: item.bookmarked,
    });
  });

  return newDict;
}
