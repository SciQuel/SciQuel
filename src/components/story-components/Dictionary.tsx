"use client";

import Image from "next/image";
import { useContext } from "react";
import closeButton from "../../../public/assets/images/close.png";
import {
  DictionaryContext,
  type SelectedDefinition,
} from "./DictionaryContext";

export default function Dictionary() {
  const fullDictionary = useContext(DictionaryContext);

  if (fullDictionary) {
    return (
      <div
        className={`${
          fullDictionary.open ? "border-4 " : "max-w-0 "
        } fixed inset-y-0 right-0 z-10 flex h-screen w-80 flex-col justify-between self-end border-sciquelTeal bg-sciquelCardBg pt-20`}
      >
        <div className="w-100 flex justify-end px-5 align-middle">
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
                    fullDictionary.word?.inContext[
                      item
                    ].current?.scrollIntoView({
                      behavior: "instant",
                      block: "center",
                    });
                  }}
                >
                  {item}
                </button>
              ))}

              <div className="my-2 w-2/5 border-b-2 border-sciquelTeal" />
              <p className="text-sciquelCitation">Synonyms & Antonyms</p>
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
        {fullDictionary?.word ? (
          <button
            type="button"
            onClick={() => {
              fullDictionary?.setWord(null);
            }}
            className="flex h-8 items-center justify-center bg-sciquelTeal text-center font-sourceSerif4 text-base text-sciquelCardBg"
          >
            See more definitions
          </button>
        ) : (
          <div className="flex h-8 items-center justify-center bg-sciquelTeal text-center font-sourceSerif4 text-base text-sciquelCardBg"></div>
        )}
      </div>
    );
  }

  return <></>;
}
