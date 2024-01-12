"use client";

import { Dispatch, SetStateAction } from "react";
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  useQuizContext,
} from "./QuizContext";

interface Props {
  postQuizAnswers: (number | boolean[] | undefined)[];
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
  resetQuiz: () => void;
}

interface CategoryBreakdown {
  numCorrect: number;
  numTotal: number;
  qList: number[];
}

interface CategoryMap {
  // category[0] should be num correct
  // category[1] should be total num questions
  [category: string]: CategoryBreakdown;
}

export default function QuizEndscreen({
  postQuizAnswers,
  setCurrentQuestionIndex,
}: Props) {
  const {
    preQuizAnswers,
    setPreQuizAnswers,
    quizComplete,
    setQuizComplete,
    quizInfo,
  } = useQuizContext();

  const categoryMap = (() => {
    let categoryMap: CategoryMap = {};
    const questionList = quizInfo.questions;
    const finalAnswers = postQuizAnswers;

    questionList.forEach((question, index) => {
      switch (question.questionType) {
        case "multiple choice":
          const currentQ = question as MultipleChoiceQuestion;
          currentQ.categories.forEach((category, cIndex) => {
            if (!categoryMap[category]) {
              categoryMap[category] = {
                numTotal: 1,
                numCorrect: 0,
                qList: [index],
              };
            } else {
              categoryMap[category].numTotal += 1;
              categoryMap[category].qList.push(index);
            }
            if (finalAnswers[index] === currentQ.answerIndex) {
              categoryMap[category].numCorrect += 1;
            }
          });
          return;

        case "true/false":
          const currentTF = question as TrueFalseQuestion;
          const userAnswersList = finalAnswers[index] as boolean[] | undefined;
          console.warn("final tf answers are: ", userAnswersList);
          console.log("index is: ", index);

          currentTF.categories.forEach((category, cIndex) => {
            if (!categoryMap[category]) {
              categoryMap[category] = {
                numTotal: currentTF.answers.length,
                numCorrect: 0,
                qList: [index],
              };
            } else {
              categoryMap[category].numTotal += currentTF.answers.length;
              categoryMap[category].qList.push(index);
            }
            userAnswersList?.forEach((userAnswer, uIndex) => {
              const correctAnswer = currentTF.answers[uIndex];
              if (userAnswer === correctAnswer) {
                categoryMap[category].numCorrect += 1;
              }
            });
          });
          return;

        default:
          return;
      }
    });
    console.log("final category map is: ", categoryMap);
    return categoryMap;
  })();

  const categoryBreakdown = () => {
    return Object.keys(categoryMap).map((key, index) => {
      const buttons = categoryMap[key].qList.map((question, qIndex) => (
        <li
          key={`${categoryMap[key]}-question-${question}-${qIndex}`}
          className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center text-[18px] transition duration-300 hover:bg-gray-100"
          onClick={() => setCurrentQuestionIndex(question)}
        >
          Q{question + 1}
        </li>
      ));

      return (
        <details key={index} className="py-2">
          <summary className="cursor-pointer text-sm">
            <span className="pl-2 text-[20px] text-sciquelTeal">{key}:</span>{" "}
            <span className="text-[20px]">
              {categoryMap[key].numCorrect} / {categoryMap[key].numTotal}{" "}
            </span>
          </summary>

          {/* List all the questions per category */}
          <ul className="my-4 ml-6 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
            {buttons}
          </ul>
        </details>
      );
    });
  };

  const grade = () => {
    let numCorrect = 0;
    postQuizAnswers.forEach((item, index) => {
      switch (quizInfo.questions[index].questionType) {
        case "multiple choice":
          let question = quizInfo.questions[index] as MultipleChoiceQuestion;
          if (item === question.answerIndex) {
            numCorrect += 1;
          }
        default:
      }
    });

    return numCorrect;
  };

  const revisitScore = () => {
    let gainedList: number[] = [];
    let revisitList: number[] = [];
    let alreadyKnewList: number[] = [];

    postQuizAnswers.forEach((answer, index) => {
      switch (quizInfo.questions[index].questionType) {
        case "multiple choice":
          const multQ = quizInfo.questions[index] as MultipleChoiceQuestion;
          if (multQ.answerIndex === answer) {
            if (preQuizAnswers[index] === multQ.answerIndex) {
              alreadyKnewList.push(index);
            } else {
              gainedList.push(index);
            }
          } else {
            revisitList.push(index);
          }

        default:
          break;
      }
    });

    console.log("lists are: ");
    console.log("revisit q's: ", revisitList);
    console.log("already knew q's: ", alreadyKnewList);
    console.log("gained list: ", gainedList);

    return (
      <>
        {/* quiz before and after  */}
        <details className="my-4">
          <summary className="mb-4 cursor-pointer text-[22px] font-semibold md-qz:text-lg">
            How you did before and after reading the story
          </summary>
          {gainedList.length > 0 ? (
            <div className=" box-border w-full border-l-8  border-sciquelTeal py-2 pl-8">
              <h2 className="text-[20px] text-sciquelTeal">
                Areas you gained understanding in
              </h2>
              <ul className="mt-4 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
                {gainedList.map((questionIndex, listIndex) => (
                  <li
                    key={`gained-understanding-question-${questionIndex}-${listIndex}`}
                    className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                    onClick={() => setCurrentQuestionIndex(questionIndex)}
                  >
                    ▴Q{questionIndex + 1}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}

          {revisitList.length > 0 ? (
            <div className=" box-border w-full border-l-8  border-sciquelTeal py-2 pl-8">
              <h2 className="text-[20px] text-sciquelTeal">
                Areas the story may be worth revisiting
              </h2>
              <ul className="mt-4 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
                {revisitList.map((questionIndex, listIndex) => (
                  <li
                    key={`gained-understanding-question-${questionIndex}-${listIndex}`}
                    className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                    onClick={() => setCurrentQuestionIndex(questionIndex)}
                  >
                    ▾Q{questionIndex + 1}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}

          {alreadyKnewList.length > 0 ? (
            <div className=" box-border w-full border-l-8  border-sciquelTeal py-2 pl-8">
              <h2 className="text-[20px] text-sciquelTeal">
                Areas you already knew
              </h2>
              <ul className="mt-4 flex h-full w-full flex-row flex-wrap items-center justify-start gap-3 text-[20px]">
                {alreadyKnewList.map((questionIndex, listIndex) => (
                  <li
                    key={`gained-understanding-question-${questionIndex}-${listIndex}`}
                    className="flex h-[64px] w-[64px] cursor-pointer items-center justify-center rounded-sm border border-black bg-white text-center transition duration-300 hover:bg-gray-100"
                    onClick={() => setCurrentQuestionIndex(questionIndex)}
                  >
                    - Q{questionIndex + 1}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </details>
      </>
    );
  };

  return (
    <div>
      <h1 className="font-quicksand mb-5 mt-2 text-2xl font-bold md-qz:my-5 md-qz:text-center sm-qz:text-[22px] ">
        Quiz Results
      </h1>
      <div className="flex w-full flex-col">
        <div className="font-quicksand mb-4 box-border w-full border-l-8 border-sciquelTeal p-5 pl-8 text-[22px] font-medium leading-7 text-sciquelTeal md-qz:text-lg">
          Your score: {grade()} / {quizInfo.questions.length}
          <div className="ml-auto mt-9 w-full text-right text-xs leading-normal text-gray-600">
            36% of SciQuel readers did as well on their first attempt.
          </div>
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
              navigator.clipboard.writeText(
                `sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`,
              );
            }}
            className="me-3 flex  items-center justify-center"
          >
            icon
          </button>
          <input
            readOnly
            type="text"
            className="w-full border p-2"
            value={`sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`}
            onClick={() => {
              navigator.clipboard.writeText(
                `sciquel.org/stories/2023/06/15/sceleratus-phoebus-coniugis/test-url`,
              );
            }}
          />
        </div>
      </div>

      {/* results breakdown by category here */}
      <div className="my-4">
        <h1 className="mb-4 text-[22px] font-semibold md-qz:text-lg">
          Approximate content breakdown:
        </h1>
        {categoryBreakdown()}
      </div>

      {revisitScore()}
    </div>
  );
}
