"use client";

import {
  createContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type RefObject,
  type SetStateAction,
} from "react";

interface InContextObj {
  [sentence: string]: RefObject<HTMLButtonElement>;
}

interface DictionaryDefinition {
  definition: string;
  inContext: InContextObj;
  pronunciation: string;
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

  return (
    <DictionaryContext.Provider
      value={{
        dictionary: fullDict,
        setDictionary: setFullDict,
        word: dictionarySelect,
        setWord: setDictionarySelect,
        open: isOpen,
        setOpen: setIsOpen,
      }}
    >
      {children}
    </DictionaryContext.Provider>
  );
}
