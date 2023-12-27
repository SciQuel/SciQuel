"use client";

import { StoryTopic } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { useQuizContext } from "./QuizContext";

const themeColors: Record<StoryTopic, string> = {
  ASTRONOMY: "#A44A3F",
  BIOLOGY: "#D15B2B",
  CHEMICAL_ENGINEERING: "#E3954F",
  CHEMISTRY: "#C39075",
  COMPUTER_SCIENCE: "#FFC834",
  ELECTRICAL_ENGINEERING: "#ACB377",
  ENVIRONMENTAL_SCIENCE: "#54623A",
  GEOLOGY: "#387270",
  MATHEMATICS: "#50A2A7",
  MECHANICAL_ENGINEERING: "#0A2B5E",
  MEDICINE: "#7282AC",
  PHYSICS: "#AB95B3",
  PSYCHOLOGY: "#624563",
  SOCIOLOGY: "#CC6666",
  TECHNOLOGY: "#4E413F",
} as const;

interface Props {
  isPreQuiz: boolean;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;

  userAnswerList: (number | boolean | undefined)[];
}

export default function QuizProgressBar({
  setCurrentQuestionIndex,
  currentQuestionIndex,
  isPreQuiz,
  userAnswerList,
}: Props) {
  const { preQuizAnswers, quizInfo, quizComplete } = useQuizContext();
  const questionList = quizInfo.questions;

  /**
   * Retrieves the quiz's theme color based on the story topic and determines whether to lower the
   * opacity or not.
   *
   * @param lowerOpacity - Determines whether to lower the opacity of the theme color.
   * @returns The theme color string.
   */
  const getThemeColor = (lowerOpacity: boolean): string => {
    // const themeColor = topic ? topic.replace("_", " ").toLowerCase() : "";
    const themeColor = quizInfo.topic ? themeColors[quizInfo.topic] : "";

    if (lowerOpacity) {
      return `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(
        themeColor.slice(3, 5),
        16,
      )}, ${parseInt(themeColor.slice(5, 7), 16)}, 0.45)`;
    } else {
      return themeColor;
    }
  };

  const progressBarWidth =
    currentQuestionIndex >= questionList.length
      ? "100%"
      : `${((currentQuestionIndex + 1) / (questionList.length + 1)) * 100}%`;

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div
      className="quiz-progress z[0] relative my-5 flex h-1 w-full items-center justify-center"
      style={{
        backgroundColor: getThemeColor(true),
      }}
    >
      <div
        className="progress-bar absolute left-0 top-1/2 z-[1] h-1 w-0 -translate-y-1/2 transform transition-all duration-500"
        id="progress-bar"
        style={{
          backgroundColor: getThemeColor(false),
          width: progressBarWidth,
        }}
      ></div>

      <div className="progress-circles flex w-full justify-evenly">
        {(() => {
          const dotLength = questionList.length - 1;

          const dotList = [];

          for (let i = 0; i < questionList.length; i++) {
            dotList.push(
              <div
                className={`progress-circle-outer z-[2] box-border flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white
              ${
                i < currentQuestionIndex ||
                currentQuestionIndex >= questionList.length
                  ? "progress-active"
                  : ""
              }`}
                key={i}
                style={{
                  border: `2px solid ${getThemeColor(true)}`,
                  ...(i < currentQuestionIndex ||
                  currentQuestionIndex >= questionList.length
                    ? { border: `2px solid ${getThemeColor(false)}` }
                    : {}),
                }}
              >
                <button
                  className={`h-3.5 w-3.5 cursor-pointer rounded-full `}
                  onClick={() => jumpToQuestion(i)}
                  style={{
                    backgroundColor:
                      currentQuestionIndex == i ||
                      userAnswerList[i] !== undefined
                        ? getThemeColor(false)
                        : "",
                  }}
                ></button>
              </div>,
            );
          }
          return dotList;
        })()}
      </div>
    </div>
  );
}
