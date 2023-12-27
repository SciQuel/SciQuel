"use client";

import { StoryTopic } from "@prisma/client";
import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { useQuizContext } from "./QuizContext";
import QuizFooter from "./QuizFooter";

interface Props {
  isPreQuiz: boolean;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;

  progressBar: ReactNode;

  userAnswerList: (number | boolean | undefined)[];
  setUserAnswerList: Dispatch<SetStateAction<(number | boolean | undefined)[]>>;

  finalAnswers?: (number | boolean | undefined)[];
  setFinalAnswers?: Dispatch<SetStateAction<(number | boolean | undefined)[]>>;
}

export default function QuizContainer({
  isPreQuiz,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  children,
  userAnswerList,
  setUserAnswerList,
  progressBar,
  finalAnswers,
  setFinalAnswers,
}: PropsWithChildren<Props>) {
  const quizInfo = useQuizContext();
  const questionList = quizInfo.quizInfo.questions;

  return (
    <div className="quiz-body mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white md-qz:w-full">
      <div className="quiz-subheader ml-5 mt-6 md-qz:mx-3">
        <h3 className="w-full font-sourceSerif4 text-base font-normal text-black md-qz:text-center">
          {quizInfo.quizInfo.objective}
        </h3>
      </div>
      <div
        id={isPreQuiz ? "prequiz-progress" : "postquiz-progress"}
        className="quiz-progress-container mt-2 md-qz:mb-4"
      >
        {progressBar}
      </div>
      <div className="grid auto-rows-auto grid-cols-[10%_1fr_10%]">
        <div className=" ">
          <p className="question-number font-sm  mt-4 text-center font-sourceSerif4 text-sm">
            {currentQuestionIndex < questionList.length
              ? `${currentQuestionIndex + 1} of ${questionList.length}`
              : ""}
          </p>
        </div>
        <div className=" ">{children}</div>
        <div className=" "> </div>
        <div className="col-start-2 ">
          <QuizFooter
            userAnswers={userAnswerList}
            questionIndex={currentQuestionIndex}
            setQuestionIndex={setCurrentQuestionIndex}
            quizLength={questionList.length}
            isPreQuiz={isPreQuiz}
            finalPostAnswers={isPreQuiz ? undefined : finalAnswers}
            setFinalPostAnswers={isPreQuiz ? undefined : setFinalAnswers}
            reset={
              isPreQuiz
                ? undefined
                : () => {
                    if (setFinalAnswers) {
                      setFinalAnswers([]);
                      setUserAnswerList([]);
                      setCurrentQuestionIndex(0);
                    }
                  }
            }
          />
        </div>
      </div>
    </div>
  );
}
