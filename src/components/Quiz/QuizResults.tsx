import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  // isPreQuiz: boolean;
  preQuizResults: (boolean | null)[];
  postQuizResults: (boolean | null)[];
  themeColor: string; // Theme color of the quiz (hex), matching with story topic tag color
  jumpToQuestion: (questionNumber: number) => void;
}

export default function MultipleMatchQuiz({
  // isPreQuiz,
  preQuizResults,
  postQuizResults,
  themeColor,
  jumpToQuestion,
}: Props) {
  /* component state variables */

  let numberCorrect = 0;
  const resultComparisonCategories: string[] = [
    "Areas you gained understanding in",
    "Areas the story may be worth revisiting",
    "Areas you already knew",
  ];
  const knewList: number[] = [];
  const gainedUnderstandingList: number[] = [];
  const revisitList: number[] = [];

  console.log("preQuizResults", preQuizResults);
  console.log("postQuizResults", postQuizResults);

  // Iterate through the postQuizResults
  postQuizResults.forEach((postResult, index) => {
    // Check if the user got the question right or wrong
    if (postResult === true) {
      numberCorrect++;

      // Check if the user got that question right or wrong during the PRE quiz
      const preResult = preQuizResults[index];

      if (preResult === true) {
        // If they got it right during both pre and post quizzes
        knewList.push(index);
      } else if (preResult === false) {
        // If they got it wrong during the pre quiz but right during the post quiz
        gainedUnderstandingList.push(index);
      }
    } else {
      // If user got question wrong
      revisitList.push(index);
    }
  });

  // console.log("knewList", knewList);
  // console.log("gainedUnderstandingList", gainedUnderstandingList);
  // console.log("revisitList", revisitList);

  const isCategoryEmpty = (category: string) => {
    switch (category) {
      case resultComparisonCategories[0]:
        return gainedUnderstandingList.length === 0;
      case resultComparisonCategories[1]:
        return revisitList.length === 0;
      case resultComparisonCategories[2]:
        return knewList.length === 0;
      default:
        return true; // Default to true if the category doesn't match known categories
    }
  };

  return (
    <div className="w-full px-5 py-4 pb-1.5 pt-2.5 sm-qz:w-[110%] xsm-qz:w-[125%]">
      <div className="flex w-full flex-col">
        <div className="font-quicksand box-border w-full border-l-8 border-sciquelTeal p-5 pl-8 text-[22px] font-medium leading-7 text-sciquelTeal md-qz:text-lg">
          Your score: {numberCorrect} / {postQuizResults.length}
          <div className="ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
            36% of SciQuel readers did as well on their first attempt.
          </div>
        </div>

        {/* share link here  */}

        {/* results breakdown by category here */}

        <details className="my-6">
          <summary className="mb-4 cursor-pointer text-[22px] md-qz:text-lg">
            How you did before and after reading the story
          </summary>

          {resultComparisonCategories.map(
            (category, index) =>
              !isCategoryEmpty(category) && (
                <div
                  className=" box-border w-full border-l-8  border-sciquelTeal py-2 pl-8"
                  key={index}
                >
                  <h3 className=" text-[20px] text-sciquelTeal">{category}</h3>
                  <ul className="mt-4 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
                    {category === resultComparisonCategories[0]
                      ? gainedUnderstandingList.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                            onClick={() => jumpToQuestion(item + 1)}
                          >
                            ▴Q{item + 1}
                          </li>
                        ))
                      : category === resultComparisonCategories[1]
                      ? revisitList.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                            onClick={() => jumpToQuestion(item + 1)}
                          >
                            ▾Q{item + 1}
                          </li>
                        ))
                      : category === resultComparisonCategories[2]
                      ? knewList.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                            onClick={() => jumpToQuestion(item + 1)}
                          >
                            -Q{item + 1}
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              ),
          )}
        </details>

        {/* button to go back  */}
      </div>
    </div>
  );
}
