"use client";

import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

interface instancesObj {
  [sentence: string]: HTMLElement;
}

interface SelectedInstance {
  index: number;
  instance: HTMLElement;
}

interface DictionaryDefinition {
  definition: string;
  instances: instancesObj;
  inContext: string[];
  pronunciation: string;
  bookmarked: boolean | undefined;
}

export interface SelectedDefinition extends DictionaryDefinition {
  word: string;
}

interface FullDictionary {
  [word: string]: DictionaryDefinition;
}

interface DictionaryContextVal {
  dictionary: FullDictionary;
  setDictionary: Dispatch<SetStateAction<FullDictionary>>;
  word: SelectedDefinition | null;
  setWord: Dispatch<SetStateAction<SelectedDefinition | null>>;
  previousWords: (SelectedDefinition | "fullDict")[];
  setPreviousWords: Dispatch<
    SetStateAction<(SelectedDefinition | "fullDict")[]>
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
  dictionary: FullDictionary;
}

export function DictionaryProvider({
  children,
  dictionary,
}: PropsWithChildren<Props>) {
  const [dictionarySelect, setDictionarySelect] =
    useState<SelectedDefinition | null>(null);

  const [fullDict, setFullDict] = useState(dictionary);

  const [isOpen, setIsOpen] = useState(false);

  const [historyList, setHistoryList] = useState<
    (SelectedDefinition | "fullDict")[]
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
