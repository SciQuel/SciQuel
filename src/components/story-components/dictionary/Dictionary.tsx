"use client";

import Image from "next/image";
import { useContext, useEffect } from "react";
import ArrowIcon from "../../../../public/assets/images/backArrow.svg";
import closeButton from "../../../../public/assets/images/close.png";
import {
  DictionaryContext,
  type SelectedDefinition,
} from "./DictionaryContext";

export default function Dictionary() {
  const fullDictionary = useContext(DictionaryContext);

  useEffect(() => {
    console.log("dictionary history is: ", fullDictionary?.previousWords);
  }, [fullDictionary?.previousWords]);

  if (fullDictionary) {
    return (
      <div
        className={`${
          fullDictionary.open ? "" : "max-w-0 "
        } fixed inset-y-0 right-0 z-10 flex h-screen w-screen flex-col justify-between self-end border-sciquelTeal bg-sciquelCardBg pt-20 md:w-96`}
      >
        {/* outer dictionary */}
        <div className="w-100 flex justify-between px-4 py-3 align-middle">
          {/* header */}
          {fullDictionary.previousWords &&
          fullDictionary.previousWords.length > 0 ? (
            <button
              type="button"
              className="h-8 w-9 overflow-hidden"
              onClick={() => {
                let history = fullDictionary.previousWords
                  ? [...fullDictionary.previousWords]
                  : [];
                if (history.length > 0) {
                  if (history[history.length - 1] == "fullDict") {
                    history.pop();
                    fullDictionary.setPreviousWords(history);
                    fullDictionary.setWord(null);
                  } else {
                    // I get a warning with history.pop() here
                    // saying it could not be the word type
                    // but it must exist and not be "fullDict" at this point
                    // so it's probably fine?
                    const next = history.pop();
                    if (typeof next == "object") {
                      fullDictionary.setWord(next);
                    } else {
                      fullDictionary.setWord(null);
                    }

                    fullDictionary.setPreviousWords(history);
                  }
                } else {
                  fullDictionary.setPreviousWords(history);
                }
                // if (history && history[history.length - 1 ] == "fullDict") {

                //   history.pop();
                //   fullDictionary.setPreviousWords(history)
                //   fullDictionary.setWord(null);
                //   return;

                // } else if(history && history[history.length - 1]) {
                //   fullDictionary.setWord(history[history.length - 1]);
                // }
                // fullDictionary.setPreviousWord(null);
              }}
            >
              <ArrowIcon className="h-full w-full object-fill" />{" "}
              <span className="sr-only">Go Back</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={() => {
              fullDictionary.setOpen(false);
            }}
          >
            <Image
              className="opacity-75 hover:opacity-100"
              alt="close dictionary"
              src={closeButton}
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="flex-1 overflow-y-scroll">
          {fullDictionary.word?.word ? (
            <div className="px-4 py-2 font-sourceSerif4">
              <div className="border-b-2 border-sciquelTeal">
                <p className="text-sciquelCitation ">Term</p>
                <p className="pb-2 pt-3 text-center font-bold">
                  {fullDictionary.word.word}
                </p>
                <p className="whitespace-pre-line pb-4 text-center">
                  {fullDictionary.word.pronunciation}
                </p>
              </div>
              <p className="mt-2 text-sciquelCitation">Definition</p>
              <p>{fullDictionary.word.definition}</p>
              <div className="my-2 w-2/5 border-b-2 border-sciquelTeal" />
              <p className="text-sciquelCitation">In Context</p>
              {Object.keys(fullDictionary.word.inContext).map((item, index) => (
                <button
                  type="button"
                  className="my-2 text-start"
                  key={item}
                  onClick={() => {
                    fullDictionary.word?.inContext[item]?.scrollIntoView({
                      behavior: "instant",
                      block: "center",
                    });
                  }}
                >
                  {item}
                </button>
              ))}

              <div className="mx-auto my-2 w-1/5 border-b-2 border-sciquelTeal" />
              <button
                type="button"
                onClick={() => {
                  if (fullDictionary.word) {
                    if (fullDictionary.previousWords) {
                      // let newHistory = [...fullDictionary.previousWords];
                      // newHistory.push(fullDictionary.word);
                      fullDictionary.setPreviousWords([
                        ...fullDictionary.previousWords,
                        fullDictionary.word,
                      ]);
                    } else {
                      fullDictionary.setPreviousWords([fullDictionary.word]);
                    }
                  }

                  fullDictionary?.setWord(null);
                }}
                className="flex w-full items-center justify-center text-center font-sourceSerif4 text-sciquelCitation"
              >
                See more definitions {">"}
              </button>
            </div>
          ) : (
            Object.keys(fullDictionary.dictionary).map((item, index) => {
              return (
                <div
                  className="px-4 py-2 font-sourceSerif4"
                  key={`${item}-${index}`}
                >
                  <p className="text-sciquelCitation">Term</p>
                  <button
                    type="button"
                    onClick={() => {
                      const copyWord = Object.assign(
                        {},
                        fullDictionary.dictionary[item],
                      ) as SelectedDefinition;
                      copyWord.word = item;

                      fullDictionary?.setWord(copyWord);

                      if (fullDictionary.previousWords) {
                        fullDictionary.setPreviousWords([
                          ...fullDictionary.previousWords,
                          "fullDict",
                        ]);
                      } else {
                        fullDictionary.setPreviousWords(["fullDict"]);
                      }
                    }}
                  >
                    {item}
                  </button>

                  <div className="mb-2 mt-1 w-2/5 border-b-2 border-sciquelTeal" />
                  <p className="text-sciquelCitation">Definition</p>
                  <p className="border-b-2 border-sciquelTeal py-2">
                    {fullDictionary.dictionary[item].definition}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return <></>;
}
