"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Checkmark from "../../Quiz/checkmark.png";
import { useQuizContext, type TrueFalseQuestion } from "../QuizContext";

interface Props {
  question: TrueFalseQuestion;
  index: number;

  answers: boolean[] | undefined;

  setAnswers: (answerIndex: number, answer: boolean) => void;

  showFeedback: boolean;
}

export default function TrueFalseQuestion({
  question,
  index,
  answers,
  setAnswers,
  showFeedback,
}: Props) {
  useEffect(() => {
    console.log("in tf question");
    console.log(answers, " are answers");
  }, []);

  return (
    <div>
      <h1 className="question-heading font-quicksand mb-5 mt-2 text-2xl font-bold md-qz:my-5 md-qz:text-center sm-qz:text-[22px] ">
        {question.questionText}
      </h1>
      <div>
        <div className="true-false-letters mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6 md-qz:mt-0">
          <div className="blankspace flex aspect-[8/1] basis-[80%] items-center justify-between gap-5"></div>
          <div className="true-letter flex aspect-[1/1] w-16 items-center justify-center text-lg font-bold">
            T
          </div>
          <div className="false-letter me-1 ms-2 flex aspect-[1/1] w-16 items-center justify-center text-lg font-bold">
            F
          </div>
        </div>
        {question.questionOptions.map((item, index) => (
          <div
            key={`tf-question-${index}`}
            className="my-2 flex w-full flex-row items-center"
          >
            <p
              className="true-false-statement 3text-base flex flex-1 
             items-center justify-between gap-5 rounded-md border
              border-black p-8 font-medium md-qz:p-0 "
            >
              {item}
            </p>
            <button
              onClick={() => {
                setAnswers(index, true);
              }}
              className={`select-box-true ms-6 flex aspect-[1/1] h-16 w-16 
                cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat
              transition duration-300 hover:bg-gray-300`}
              type="button"
            >
              {/* True{" "} */}
              {answers && answers[index] ? (
                <Image src={Checkmark} alt="checkmark" className="p-2" />
              ) : (
                ""
              )}
            </button>
            <button
              onClick={() => {
                setAnswers(index, false);
              }}
              className={`select-box-true ms-6 flex aspect-[1/1] h-16 w-16  
               cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat
            transition duration-300 hover:bg-gray-300`}
              type="button"
            >
              {answers && answers[index] === false ? (
                <Image src={Checkmark} alt="checkmark" className="p-2" />
              ) : (
                ""
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
