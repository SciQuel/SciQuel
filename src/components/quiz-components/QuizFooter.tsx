"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect } from "react";
import next_arrow from "../Quiz/next_arrow.png";
import prev_arrow from "../Quiz/prev_arrow.png";

interface Props {
  userAnswers: (number | boolean | undefined)[];

  questionIndex: number;

  setQuestionIndex: Dispatch<SetStateAction<number>>;

  quizLength: number;

  isPreQuiz: boolean;

  finalPostAnswers?: (number | boolean | undefined)[];

  setFinalPostAnswers?: Dispatch<
    SetStateAction<(number | boolean | undefined)[]>
  >;

  reset?: () => void;
}

export default function QuizFooter({
  userAnswers,
  questionIndex,
  setQuestionIndex,
  quizLength,
  isPreQuiz,
  finalPostAnswers,
  setFinalPostAnswers,
  reset,
}: Props) {
  useEffect(() => {
    console.log("in quiz footer");
    console.log("should we show submit?");
    console.log(!isPreQuiz);
    console.log(questionIndex, " is index and ", quizLength, " is length");
    console.log("final answers? : ", finalPostAnswers);
    console.log(
      "final answer index?: ",
      finalPostAnswers ? finalPostAnswers[questionIndex] : null,
    );
  }, [questionIndex]);

  const NextButton = (
    <button
      type={"button"}
      onClick={() => setQuestionIndex((state) => state + 1)}
      className="font-quicksand border-radius-4 ml-auto flex h-10
   cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
    >
      Next
      <Image src={next_arrow} className="h-auto w-2" alt="next arrow" />
    </button>
  );

  const PrevButton = (
    <button
      type={"button"}
      onClick={() => {
        setQuestionIndex((state) => {
          return state - 1;
        });
      }}
      className="font-quicksand border-radius-4 mr-auto flex h-10
       cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
    >
      <Image src={prev_arrow} className="h-auto w-2" alt="prev arrow" />
      Previous
    </button>
  );

  const SubmitButton = (
    <button
      type={"button"}
      onClick={() => {
        console.log(setFinalPostAnswers);
        if (setFinalPostAnswers) {
          setFinalPostAnswers((state) => {
            let newState = [...state];
            newState[questionIndex] = userAnswers[questionIndex];
            return newState;
          });
        }
      }}
      className="font-quicksand border-radius-4 ml-auto h-10 cursor-pointer rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
    >
      Submit
    </button>
  );

  const ResultsButton = (
    <button
      type={"button"}
      onClick={() => {
        setQuestionIndex((state) => state + 1);
      }}
      className="font-quicksand border-radius-4 ml-auto flex h-10
   cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
    >
      Results Summary
    </button>
  );

  const ResetButton = (
    <button
      type={"button"}
      onClick={reset}
      className="font-quicksand border-radius-4 ml-auto flex h-10
    cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-white px-4 py-1 text-lg font-medium text-black transition duration-300 hover:bg-gray-200 md-qz:text-base"
    >
      Redo Quiz
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16"
        width="16"
        viewBox="0 0 512 512"
      >
        {/* The content of your SVG path */}
        <path d="M500.3 0h-47.4a12 12 0 0 0 -12 12.6l4 82.8A247.4 247.4 0 0 0 256 8C119.3 8 7.9 119.5 8 256.2 8.1 393.1 119.1 504 256 504a247.1 247.1 0 0 0 166.2-63.9 12 12 0 0 0 .5-17.4l-34-34a12 12 0 0 0 -16.4-.6A176 176 0 1 1 402.1 157.8l-101.5-4.9a12 12 0 0 0 -12.6 12v47.4a12 12 0 0 0 12 12h200.3a12 12 0 0 0 12-12V12a12 12 0 0 0 -12-12z" />
      </svg>
    </button>
  );

  return (
    <div className="mb-5 mt-4 flex w-full flex-row">
      {questionIndex > 0 && questionIndex < quizLength ? PrevButton : <></>}

      {(isPreQuiz && questionIndex < quizLength - 1) ||
      (!isPreQuiz &&
        questionIndex < quizLength - 1 &&
        finalPostAnswers &&
        finalPostAnswers[questionIndex] !== undefined) ? (
        NextButton
      ) : (
        <></>
      )}

      {/* {!isPreQuiz && questionIndex < quizLength && finalPostAnswers ? (
        finalPostAnswers[questionIndex] === undefined ? (
          SubmitButton
        ) : (
          <></>
        )
      ) : (
        <></>
      )} */}

      {!isPreQuiz && questionIndex < quizLength && finalPostAnswers ? (
        finalPostAnswers[questionIndex] === undefined ? (
          SubmitButton
        ) : questionIndex == quizLength - 1 ? (
          ResultsButton
        ) : (
          <></>
        )
      ) : (
        <></>
      )}

      {questionIndex >= quizLength ? ResetButton : <></>}

      {/* {!isPreQuiz && questionIndex == quizLength - 1 ? ResultsButton : <></>} */}
    </div>
  );
}
