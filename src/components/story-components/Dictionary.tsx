"use client";

import Image from "next/image";
import { useState } from "react";
import closeButton from "../../../public/assets/images/close.png";

interface DictionaryWord {
  word: string;
  definition: string;
  inContext: string[];
  pronunciation: string;
}

const testWords: DictionaryWord[] = [
  {
    word: "camouflage",
    definition:
      "Tum et sublimibus moenia aut tamen terras, alto arcus servare.",
    pronunciation: "cam·ou·flage \n/ˈkaməˌflä(d)ZH/",
    inContext: [
      "Grave harum viridis iuvenis et guttae ingens bibulas pars, ubi.",
      "Populator iam, ille, curvamine munus certaminis tenues: cum nec?",
    ],
  },
  {
    word: "enzymes",
    definition:
      "Tum et sublimibus moenia aut tamen terras, alto arcus servare.",
    pronunciation: "en·zyme \n/ˈenˌzīm/",
    inContext: [
      "Grave harum viridis iuvenis et guttae ingens bibulas pars, ubi.",
      "Populator iam, ille, curvamine munus certaminis tenues: cum nec?",
    ],
  },
  {
    word: "lipopolysaccharides",
    definition:
      "Tum et sublimibus moenia aut tamen terras, alto arcus servare.",
    pronunciation:
      "lip·o·pol·y·sac·cha·ride \n/ˌlipōˌpälēˈsakəˌrīd,ˌlīpōˌpälēˈsakəˌrīd/",
    inContext: [
      "Grave harum viridis iuvenis et guttae ingens bibulas pars, ubi.",
      "Populator iam, ille, curvamine munus certaminis tenues: cum nec?",
    ],
  },
];

export default function Dictionary() {
  const [isOpen, setIsOpen] = useState(true);

  const [selectedItem, setSelectedItem] = useState<null | DictionaryWord>(null);

  return (
    <div
      className={`${
        isOpen ? "border-4 " : "max-w-0 "
      } fixed inset-y-0 right-0 flex h-screen w-80 flex-col justify-between self-end  border-sciquelTeal bg-sciquelCardBg pt-24`}
    >
      <div className="w-100 flex justify-end px-5 align-middle">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
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
      <div className="flex-1">
        {selectedItem ? (
          <div className="px-4 py-2 font-sourceSerif4">
            <div className="border-b-2 border-sciquelTeal">
              <p className="text-sciquelCitation ">Term</p>
              <p className="pb-2 pt-3 text-center font-bold">
                {selectedItem.word}
              </p>
              <p className="whitespace-pre-line pb-4 text-center">
                {selectedItem.pronunciation}
              </p>
            </div>
            <p className="mt-2 text-sciquelCitation">Definition</p>
            <p>{selectedItem.definition}</p>
            <div className="my-2 w-2/5 border-b-2 border-sciquelTeal" />
            <p className="text-sciquelCitation">In Context</p>
            <p>{selectedItem.inContext}</p>
            <div className="my-2 w-2/5 border-b-2 border-sciquelTeal" />
            <p className="text-sciquelCitation">Synonyms & Antonyms</p>
          </div>
        ) : (
          testWords.map((item, index) => {
            return (
              <div className="px-4 py-2 font-sourceSerif4">
                <p className="text-sciquelCitation">Term</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(item);
                  }}
                >
                  {item.word}
                </button>

                <div className="mb-2 mt-1 w-2/5 border-b-2 border-sciquelTeal" />
                <p className="text-sciquelCitation">Definition</p>
                <p className="border-b-2 border-sciquelTeal py-2">
                  {item.definition}
                </p>
              </div>
            );
          })
        )}
      </div>
      {selectedItem ? (
        <button
          type="button"
          onClick={() => {
            setSelectedItem(null);
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
