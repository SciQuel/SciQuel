"use client";

import {
  type MultipleMatchQuestion,
  type OneMatchQuestion,
  type Question,
} from "@/lib/Question";
import { type StoryTopic } from "@prisma/client";
import React, { useEffect, useState } from "react";
import MultipleChoiceQuiz from "../MulitpleChoiceQuiz";
import MultipleMatchQuiz from "../MultipleMatchQuiz";
import OneMatchQuiz from "../OneMatchQuiz";
import TrueFalseQuiz from "../TrueFalseQuiz";

interface Props {
  isPreQuiz: boolean; // true/false value to determine if quiz component is prequiz/postquiz
  topic: StoryTopic; // topic of the story article this quiz is part of
  quizObjective: string; // objective that displays at the top of the quiz (above progress bar)
  quizQuestionType: string; // determines type of quiz: "Multiple Choice", "True/False", "One Match", or "Multiple Match"
  questionList: Question[] | OneMatchQuestion[] | MultipleMatchQuestion[];
} // list of questions for this quiz

export default function Quiz({
  isPreQuiz,
  topic,
  quizObjective,
  quizQuestionType,
  questionList,
}: Props) {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
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

  /**
   * Retrieves the quiz's theme color based on the story topic and determines whether to lower the
   * opacity or not.
   *
   * @param lowerOpacity - Determines whether to lower the opacity of the theme color.
   * @returns The theme color string.
   */
  const getThemeColor = (lowerOpacity: boolean): string => {
    // const themeColor = topic ? topic.replace("_", " ").toLowerCase() : "";
    const themeColor = topic ? themeColors[topic] : "";

    if (lowerOpacity) {
      return `rgba(${parseInt(themeColor.slice(1, 3), 16)}, ${parseInt(
        themeColor.slice(3, 5),
        16,
      )}, ${parseInt(themeColor.slice(5, 7), 16)}, 0.45)`;
    } else {
      return themeColor;
    }
  };

  /** Updates the current question after the next button is pressed. */
  const handleNext: () => void = () => {
    setCurrentQuestion((prevQuestion: number) => prevQuestion + 1);
  };

  /** Updates the current question after the previous button is pressed. */
  const handlePrevious: () => void = () => {
    setCurrentQuestion((prevQuestion: number) => prevQuestion - 1);
  };

  /**
   * Updates the progress bar and circle visuals based on the current question the user is viewing.
   */
  useEffect(() => {
    const progressContainerId = isPreQuiz
      ? "#prequiz-progress"
      : "#postquiz-progress";
    const progressContainer = document.querySelector<HTMLElement>(
      `${progressContainerId}.quiz-progress-container`,
    );

    if (progressContainer) {
      const progressCircles = progressContainer.querySelectorAll<HTMLElement>(
        ".progress-circle-outer",
      );

      const progress =
        progressContainer.querySelector<HTMLElement>("#progress-bar");
      const isComplete = isPreQuiz
        ? currentQuestion === questionList.length
        : false; // change this later for the post quiz results screen
      let activeCircles: NodeListOf<HTMLElement> | null = null;
      let barWidth = "";

      // Update each progress circle based on the current question being viewed
      progressCircles.forEach((circle, index) => {
        const isQuestionActive = index < currentQuestion;

        circle.classList.toggle("progress-active", isQuestionActive);
        circle.style.borderColor = getThemeColor(!isQuestionActive);
      });

      // Calculate the width of the progress bar
      if (progress && isComplete) {
        progress.style.width = "100%";
        return;
      }
      activeCircles =
        progressContainer.querySelectorAll<HTMLElement>(".progress-active");
      barWidth = `${
        (activeCircles.length / (progressCircles.length + 1)) * 100
      }%`;

      if (progress) {
        progress.style.width = barWidth;
      }
    }
  }, [currentQuestion]);

  /**
   * Sets the position of the quiz number element based on the quiz question element. The position
   * is updated when the window is resized, and it is only applied on screen sizes over 820px.
   */
  useEffect(() => {
    // Updates the position of the quiz number element.
    const updateQuizNumberPosition = () => {
      // const screenWidth = window.innerWidth;
      const quizQuestionElement = document.querySelector<HTMLElement>(
        `#${isPreQuiz ? "prequiz" : "postquiz"}-question-heading`,
      );
      const quizNumberElement = document.querySelector<HTMLElement>(
        `#${isPreQuiz ? "prequiz" : "postquiz"}-question-number`,
      );

      if (quizQuestionElement && quizNumberElement) {
        const quizQuestionTop = quizQuestionElement.offsetTop;
        quizNumberElement.style.top = `${quizQuestionTop + 6}px`;
      }
    };

    const handleResize = () => {
      // if (window.innerWidth > 767) {
      updateQuizNumberPosition();
      // }
    };

    updateQuizNumberPosition(); // Initial update of the quiz number position

    window.addEventListener("resize", handleResize); // Add event listener for window resize

    // Remove the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isPreQuiz]);

  return (
    <div className="quiz-body mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white md-qz:w-full">
      <div className="quiz-subheader ml-5 mt-6 md-qz:mx-3">
        <h3 className="w-full font-sourceSerif4 text-base font-normal text-black md-qz:text-center">
          {quizObjective}
        </h3>
      </div>

      <div
        id={isPreQuiz ? "prequiz-progress" : "postquiz-progress"}
        className="quiz-progress-container mt-2 md-qz:mb-4"
      >
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
            }}
          ></div>

          <div className="progress-circles flex w-full justify-evenly">
            {questionList.map((_, index) => (
              <div
                className={`progress-circle-outer z-[2] box-border flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white`}
                key={index}
                style={{
                  border: `2px solid ${getThemeColor(true)}`,
                  ...(index + 1 === currentQuestion
                    ? { border: `2px solid ${getThemeColor(false)}` }
                    : {}),
                }}
              >
                {index + 1 <= currentQuestion && (
                  <div
                    className="h-3.5 w-3.5 rounded-full"
                    style={{
                      backgroundColor: getThemeColor(false),
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-content flex h-full w-full flex-col items-center px-11 py-3 md-qz:self-center">
        <div className="question-container relative w-full px-5 md-qz:flex md-qz:flex-col md-qz:p-0">
          <div
            className="question-number font-sm absolute bottom-[15px] left-[-1.5rem] font-sourceSerif4 text-sm md-qz:relative md-qz:!top-0 md-qz:left-[0] md-qz:mb-1.5 md-qz:text-center "
            id={
              isPreQuiz ? "prequiz-question-number" : "postquiz-question-number"
            }
          >
            {currentQuestion} of {questionList.length}
          </div>
          <h2
            className="question-heading font-quicksand mb-5 mt-2 text-2xl font-bold md-qz:my-5 md-qz:text-center sm-qz:text-[22px] "
            id={
              isPreQuiz
                ? "prequiz-question-heading"
                : "postquiz-question-heading"
            }
          >
            {questionList[currentQuestion - 1].questionText}
          </h2>
        </div>

        <div className="quiz-answers-container w-full px-5 py-4 pb-1.5 pt-2.5 sm-qz:w-[110%] xsm-qz:w-[125%]">
          {(() => {
            switch (quizQuestionType) {
              case "Multiple Choice":
                return (
                  <MultipleChoiceQuiz
                    isPreQuiz={isPreQuiz}
                    choices={questionList[currentQuestion - 1].choices}
                    correctAnswer={
                      (questionList[currentQuestion - 1] as Question)
                        .correctAnswer
                    }
                    answerExplanation={
                      questionList[currentQuestion - 1].answerExplanation
                    }
                    currentQuestion={currentQuestion}
                    totalQuestions={questionList.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                );

              case "True/False":
                return (
                  <TrueFalseQuiz
                    isPreQuiz={isPreQuiz}
                    choices={questionList[currentQuestion - 1].choices}
                    correctAnswer={
                      (questionList[currentQuestion - 1] as Question)
                        .correctAnswer
                    }
                    answerExplanation={
                      questionList[currentQuestion - 1].answerExplanation
                    }
                    currentQuestion={currentQuestion}
                    totalQuestions={questionList.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                );

              case "Multiple Match":
                const multMatchQuestionList =
                  questionList as MultipleMatchQuestion[];
                const correctAnswerMapData =
                  multMatchQuestionList[currentQuestion - 1].correctAnswerMap;
                const correctAnswerMap = new Map(correctAnswerMapData);

                console.log("correctAnswerMap", correctAnswerMap);
                console.log(
                  "correctAnswerMap map?",
                  correctAnswerMap instanceof Map,
                );

                return (
                  <MultipleMatchQuiz
                    isPreQuiz={isPreQuiz}
                    themeColor={getThemeColor(false)}
                    matchStatements={
                      (
                        questionList[
                          currentQuestion - 1
                        ] as MultipleMatchQuestion
                      ).matchStatements
                    }
                    choices={
                      (
                        questionList[
                          currentQuestion - 1
                        ] as MultipleMatchQuestion
                      ).choices
                    }
                    correctAnswerMap={correctAnswerMap}
                    answerExplanation={
                      questionList[currentQuestion - 1].answerExplanation
                    }
                    currentQuestion={currentQuestion}
                    totalQuestions={questionList.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                );

              case "One Match":
                return (
                  <OneMatchQuiz
                    isPreQuiz={isPreQuiz}
                    themeColor={getThemeColor(false)}
                    matchStatements={
                      (questionList[currentQuestion - 1] as OneMatchQuestion)
                        .matchStatements
                    }
                    choices={
                      (questionList[currentQuestion - 1] as OneMatchQuestion)
                        .choices
                    }
                    correctAnswer={
                      (questionList[currentQuestion - 1] as OneMatchQuestion)
                        .correctAnswer
                    }
                    answerExplanation={
                      questionList[currentQuestion - 1].answerExplanation
                    }
                    currentQuestion={currentQuestion}
                    totalQuestions={questionList.length}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                  />
                );

              default:
                return <>not a valid type of quiz</>;
            }
          })()}
        </div>
      </div>
    </div>
  );
}
