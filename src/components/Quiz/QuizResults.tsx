import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Props {
  // isPreQuiz: boolean;
  shareLinkUser: string;
  preQuizResults: (boolean | null)[];
  postQuizResults: (boolean | null)[];
  themeColor: string; // Theme color of the quiz (hex), matching with story topic tag color
  jumpToQuestion: (questionNumber: number) => void;
  prevQuestion: number;
}

interface Category {
  id: number;
  name: string;
  questions: number[];
}

export default function QuizResults({
  // isPreQuiz,
  shareLinkUser,
  preQuizResults,
  postQuizResults,
  themeColor,
  jumpToQuestion,
  prevQuestion,
}: Props) {
  /* component state variables */

  let numberCorrect = 0;
  const resultComparisonCategories: string[] = [
    "Areas you gained understanding in",
    "Areas the story may be worth revisiting",
    "Areas you already knew",
  ];
  const quizQuestionCategories: Category[] = [
    {
      id: 1,
      name: "Squid development",
      // questions: [1],
      questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    },
    {
      id: 2,
      name: "Lipopolysaccharides in maturation",
      questions: [2],
    },
    {
      id: 3,
      name: "V. fischeri migration",
      questions: [3],
    },
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

  const handleRevisit = (prevQuestion: number) => {
    jumpToQuestion(prevQuestion - 1);
  };

  // const getNumCorrectGivenCategory = (questions: number[]) => {
  //   let numCorrect = 0;
  //   // iterate through questions list
  //   // check if question for this given category was answered correctly by checking value of postQuizResults[number - 1]
  //   // return the number of questions user answered correctly under this category
  // };

  const getNumCorrectGivenCategory = (questions: number[]): number => {
    let numCorrect = 0;

    for (const question of questions) {
      // Assuming the question number corresponds to the index in postQuizResults
      const questionIndex = question - 1;

      if (questionIndex >= 0 && questionIndex < postQuizResults.length) {
        if (postQuizResults[questionIndex]) {
          numCorrect++;
        }
      }
    }
    return numCorrect;
  };

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
        <div className="font-quicksand mb-4 box-border w-full border-l-8 border-sciquelTeal p-5 pl-8 text-[22px] font-medium leading-7 text-sciquelTeal md-qz:text-lg">
          Your score: {numberCorrect} / {postQuizResults.length}
          <div className="ml-auto mt-9 w-full text-right text-xs leading-normal text-gray-600">
            36% of SciQuel readers did as well on their first attempt.
          </div>
        </div>

        {/* share link here  */}
        <div className="my-4 flex w-full flex-row items-center">
          <h3 className="w-2/5 text-[18px] text-sciquelTeal">
            Share your result:
          </h3>
          <div className=" flex w-full flex-row justify-center rounded-t border-x-2 border-t-2 border-sciquelCardBorder bg-sciquelCardBg p-2 transition-all lg:h-fit xl:rounded xl:border-2">
            {/* floating input for copying link */}
            <button
              type="button"
              onClick={() => {
                // navigator.clipboard.writeText(`sciquel.org${pathname}`);
                navigator.clipboard.writeText(
                  `sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`,
                );
                // dispatchJustCopied({ type: "show" });
              }}
              className="me-3 flex  items-center justify-center"
            >
              {/* <ClipboardIcon className={"m-0 h-11 w-11 p-0"} /> */}
              icon
            </button>
            <input
              // ref={inputRef}
              readOnly
              type="text"
              className="w-full border p-2"
              // value={`sciquel.org${pathname}`}
              value={`sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`}
              onClick={() => {
                // navigator.clipboard.writeText(`sciquel.org${pathname}`);
                navigator.clipboard.writeText(
                  `sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`,
                );
                // dispatchJustCopied({ type: "show" });
              }}
            />
          </div>
        </div>

        {/* results breakdown by category here */}
        <div className="my-4">
          <h3 className="mb-4 text-[22px] font-semibold md-qz:text-lg">
            Approximate content breakdown:
          </h3>
          {quizQuestionCategories.map((category, index) => (
            <details key={index} className="py-2">
              <summary className="cursor-pointer text-sm">
                <span className="pl-2 text-[20px] text-sciquelTeal">
                  {category.name}:
                </span>{" "}
                <span className="text-[20px]">
                  {getNumCorrectGivenCategory(category.questions)} /{" "}
                  {category.questions.length}{" "}
                </span>
              </summary>

              {/* List all the questions per category */}
              <ul className="my-4 ml-6 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
                {category.questions.map((question, questionIndex) => (
                  <li
                    key={questionIndex}
                    className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center text-[18px] transition duration-300 hover:bg-gray-100"
                    onClick={() => jumpToQuestion(question)}
                  >
                    Q{question}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* user that shared the link, if applicable  */}
        {shareLinkUser && shareLinkUser.length > 0 && (
          <div className="mx-auto my-4 flex w-full max-w-screen-lg items-center justify-center bg-sciquelTeal p-4 md-qz:w-full">
            <p className="text-[18px] text-white">{`${shareLinkUser} scored 6 / 7. Let them know how you did?`}</p>
          </div>
        )}

        {/* quiz before and after  */}
        <details className="my-4">
          <summary className="mb-4 cursor-pointer text-[22px] font-semibold md-qz:text-lg">
            How you did before and after reading the story
          </summary>

          {resultComparisonCategories.map(
            (category, index) =>
              !isCategoryEmpty(category) && (
                <div
                  className=" box-border w-full border-l-8  border-sciquelTeal py-2 pl-8"
                  key={index}
                >
                  <h3 className="text-[20px] text-sciquelTeal">{category}</h3>
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
                            - Q{item + 1}
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              ),
          )}
        </details>

        {/* button to go back  */}
        <button
          onClick={() => handleRevisit(prevQuestion)}
          className="font-quicksand border-radius-4 ml-auto flex h-10
             cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
        >
          Revisit Question
        </button>
      </div>
    </div>
  );
}
