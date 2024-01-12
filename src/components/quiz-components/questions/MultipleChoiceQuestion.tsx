"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { type MultipleChoiceQuestion } from "../QuizContext";
import QuestionButton from "./QuestionButton";

interface Props {
  question: MultipleChoiceQuestion;
  index: number;

  selectedAnswer: number | boolean[] | undefined;

  setAnswer: (answerIndex: number) => void;

  showFeedback: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  index,
  setAnswer,
  selectedAnswer,

  showFeedback,
}: Props) {
  return (
    <div className="flex flex-col ">
      <h1 className="question-heading font-quicksand mb-5 mt-2 text-2xl font-bold md-qz:my-5 md-qz:text-center sm-qz:text-[22px] ">
        {question.questionText}
      </h1>
      {question.questionOptions.map((option, answerIndex) => {
        return (
          <QuestionButton
            onClick={() => {
              console.log(
                "option " +
                  (answerIndex + 1) +
                  " pressed in question " +
                  (index + 1),
              );

              setAnswer(answerIndex);
            }}
            selected={selectedAnswer == answerIndex}
            showFeedback={showFeedback}
            correctOption={question.answerIndex == answerIndex}
            key={`mult-choice-option-${question.questionOptions[index]}-${index}`}
          >
            {option}
          </QuestionButton>
        );
      })}
      {showFeedback ? (
        selectedAnswer == question.answerIndex ? (
          <div className="answer-explanation-container flex flex-col">
            <div className="answer-explanation correct font-quicksand my-4 box-border w-full border-l-8 border-sciquelCorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelCorrectText md-qz:text-lg">
              Correct. {question.explanation}
              <div className="user-quiz-statistics ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
                You and {(question.correctAnswersRatio * 100).toFixed(1)}% of
                SciQuel readers answered this question correctly. Great job!
              </div>
            </div>{" "}
          </div>
        ) : (
          <div className="answer-explanation incorrect font-quicksand my-4 box-border w-full border-l-8 border-sciquelIncorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelIncorrectText md-qz:text-lg">
            Incorrect. {question.explanation}
            <div className="user-quiz-statistics ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
              {(question.correctAnswersRatio * 100).toFixed(1)}% of SciQuel
              readers answered this question correctly.
            </div>
          </div>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
