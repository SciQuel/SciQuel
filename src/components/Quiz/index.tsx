"use client";

import { useQuizContext } from "@/components/Quiz/QuizContext";
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
import QuizResults from "../Quiz/QuizResults";
import QuizResultsChart from "../Quiz/QuizResultsChart";
import TrueFalseQuiz from "../TrueFalseQuiz";

interface Props {
  isPreQuiz: boolean; // true/false value to determine if quiz component is prequiz/postquiz
  shareLinkIdentifier: string;
  topic: StoryTopic; // topic of the story article this quiz is part of
  quizObjective: string; // objective that displays at the top of the quiz (above progress bar)
  quizQuestionType: string; // determines type of quiz: "Multiple Choice", "True/False", "One Match", or "Multiple Match"
  questionList: Question[] | OneMatchQuestion[] | MultipleMatchQuestion[];
} // list of questions for this quiz

export default function Quiz({
  isPreQuiz,
  shareLinkIdentifier,
  topic,
  quizObjective,
  quizQuestionType,
  questionList,
}: Props) {
  type UserAnswerType =
    | (string | null)[]
    | (boolean | null)[][]
    | string[][]
    | string[][][];

  // type UserAnswerType = "";

  const userAnswersInitialValue =
    quizQuestionType === "Multiple Choice"
      ? ([] as (string | null)[])
      : quizQuestionType === "True/False"
      ? ([] as (boolean | null)[][])
      : quizQuestionType === "One Match"
      ? ([] as string[][])
      : quizQuestionType === "Multiple Match"
      ? ([] as string[][][])
      : ([] as (string | null)[]);

  const [progressBarWidth, setProgressBarWidth] = useState<string>(`0`);
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  // const [userAnswers, setUserAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState(userAnswersInitialValue);
  // const [quizComplete, setQuizComplete] = useState(false);
  const { quizComplete, setQuizComplete } = useQuizContext();
  const [atQuizResults, setAtQuizResults] = useState(false);
  // const [preQuizResults, setPreQuizResults] = useState<boolean[]>();
  const [preQuizResults, setPreQuizResults] = useState<(boolean | null)[]>([]);
  // const { preQuizAnswers, setPreQuizAnswers } = useQuizContext();
  // const [postQuizResults, setPostQuizResults] = useState<boolean[]>();
  const [postQuizResults, setPostQuizResults] = useState<(boolean | null)[]>(
    [],
  );

  // let preQuizResults: boolean[] = [];
  // let postQuizResults: boolean[] = [];

  const [shareLinkUser, setShareLinkUser] = useState("");

  // Function to get user information based on the unique identifier
  const getUserInfoFromIdentifier = (identifier: string) => {
    // This is where you would make a request to your server or database
    // to retrieve user information based on the unique identifier
    // For simplicity, let's assume you have a hardcoded mapping
    const userMappings: Record<string, string> = {
      // Hardcoded mapping for illustration purposes
      [identifier]: "John Doe",
    };

    if (identifier.length > 0) {
      return userMappings[identifier];
    }
    return "";
  };

  useEffect(() => {
    // const identifierString = shareLinkIdentifier.uid as string;
    // Fetch user details based on the unique identifier and customize the page
    console.log(`Fetching user details for UID: ${shareLinkIdentifier}`);
    const userInfo = getUserInfoFromIdentifier(shareLinkIdentifier);
    setShareLinkUser(userInfo);
  }, [shareLinkIdentifier]);

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
  const handleNext: (userAnswersList: UserAnswerType) => void = (
    userAnswersList,
  ) => {
    setCurrentQuestion((prevQuestion: number) => prevQuestion + 1);
    setUserAnswers(userAnswersList);
    // console.log("userAnswers (parent):", userAnswers);
  };

  /** Updates the current question after the previous button is pressed. */
  const handlePrevious: (userAnswersList: UserAnswerType) => void = (
    userAnswersList,
  ) => {
    setCurrentQuestion((prevQuestion: number) => prevQuestion - 1);
    setUserAnswers(userAnswersList);
  };

  const toQuizResultsScreen = (
    userAnswersList: UserAnswerType,
    preQuizQuestionResults: boolean[],
    postQuizQuestionResults: boolean[],
  ) => {
    if (!preQuizResults.length && !postQuizResults.length) {
      console.log("pre", preQuizQuestionResults);
      console.log("post", postQuizQuestionResults);
      setPreQuizResults(preQuizQuestionResults);
      setPostQuizResults(postQuizQuestionResults);
    }
    setCurrentQuestion((prevQuestion: number) => prevQuestion + 1);
    setUserAnswers(userAnswersList);
    setQuizComplete(true);
    setAtQuizResults(true);
  };

  const jumpToQuestion = (questionNumber: number) => {
    setCurrentQuestion(questionNumber);
    setAtQuizResults(false);
  };

  /**
   * Updates the progress bar width.
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
      const isComplete = isPreQuiz
        ? currentQuestion === questionList.length
        : atQuizResults; // change this later for the post quiz results screen
      const activeCircles =
        progressContainer.querySelectorAll<HTMLElement>(".progress-active");

      const barWidth = isComplete
        ? "100%"
        : `${(activeCircles.length / (progressCircles.length + 1)) * 100}%`;

      setProgressBarWidth(barWidth);
    }
  }, [currentQuestion, atQuizResults]);

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
  }, [isPreQuiz, currentQuestion]);

  return (
    <div>
      {/* {isPreQuiz && shareLinkUser && shareLinkUser.length > 0 && (
        <div className="mx-auto mt-6 flex w-[720px] max-w-screen-lg items-center justify-center bg-sciquelTeal p-4 md-qz:w-full">
          <div className="ml-1 mr-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h0"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
          <p className="text-base text-white">{`${shareLinkUser} answered some trivia questions at the end of this article and wanted to share it with you.`}</p>
        </div>
      )} */}

      <div className="quiz-body mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white md-qz:w-full">
      {isPreQuiz && shareLinkUser && shareLinkUser.length > 0 && (
        <div className="mx-auto mt-6 flex w-full max-w-screen-lg items-center justify-center bg-sciquelTeal p-4 md-qz:w-full">
          <div className="ml-1 mr-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h0"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
          <p className="text-base text-white">{`${shareLinkUser} answered some trivia questions at the end of this article and wanted to share it with you.`}</p>
        </div>
      )}
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
                width: progressBarWidth,
              }}
            ></div>

            <div className="progress-circles flex w-full justify-evenly">
              {questionList.map((_, index) => (
                <div
                  className={`progress-circle-outer z-[2] box-border flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white
                ${
                  index < currentQuestion || atQuizResults
                    ? "progress-active"
                    : ""
                }`}
                  key={index}
                  style={{
                    border: `2px solid ${getThemeColor(true)}`,
                    ...(index < currentQuestion || atQuizResults
                      ? { border: `2px solid ${getThemeColor(false)}` }
                      : {}),
                  }}
                >
                  {(index + 1 <= currentQuestion || atQuizResults) && (
                    <div
                      className="h-3.5 w-3.5 cursor-pointer rounded-full"
                      onClick={() => jumpToQuestion(index + 1)}
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
            {!atQuizResults && (
              <div
                className="question-number font-sm absolute bottom-[15px] left-[-1.5rem] font-sourceSerif4 text-sm md-qz:relative md-qz:!top-0 md-qz:left-[0] md-qz:mb-1.5 md-qz:text-center "
                id={
                  isPreQuiz
                    ? "prequiz-question-number"
                    : "postquiz-question-number"
                }
              >
                {currentQuestion} of {questionList.length}
              </div>
            )}

            <h2
              className="question-heading font-quicksand mb-5 mt-2 text-2xl font-bold md-qz:my-5 md-qz:text-center sm-qz:text-[22px] "
              id={
                isPreQuiz
                  ? "prequiz-question-heading"
                  : "postquiz-question-heading"
              }
            >
              {!atQuizResults
                ? questionList[currentQuestion - 1].questionText
                : "Quiz Results"}
            </h2>
          </div>

          {!atQuizResults ? (
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
                        storedUserAnswersList={userAnswers}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        toQuizResultsScreen={toQuizResultsScreen}
                        quizComplete={quizComplete}
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
                        storedUserAnswersList={userAnswers}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        toQuizResultsScreen={toQuizResultsScreen}
                        quizComplete={quizComplete}
                      />
                    );

                  case "Multiple Match":
                    const multMatchQuestionList =
                      questionList as MultipleMatchQuestion[];
                    const correctAnswerMapData =
                      multMatchQuestionList[currentQuestion - 1]
                        .correctAnswerMap;
                    const correctAnswerMap = new Map(correctAnswerMapData);
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
                        storedUserAnswersList={userAnswers}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        toQuizResultsScreen={toQuizResultsScreen}
                        quizComplete={quizComplete}
                      />
                    );

                  case "One Match":
                    return (
                      <OneMatchQuiz
                        isPreQuiz={isPreQuiz}
                        themeColor={getThemeColor(false)}
                        matchStatements={
                          (
                            questionList[
                              currentQuestion - 1
                            ] as OneMatchQuestion
                          ).matchStatements
                        }
                        choices={
                          (
                            questionList[
                              currentQuestion - 1
                            ] as OneMatchQuestion
                          ).choices
                        }
                        correctAnswer={
                          (
                            questionList[
                              currentQuestion - 1
                            ] as OneMatchQuestion
                          ).correctAnswer
                        }
                        answerExplanation={
                          questionList[currentQuestion - 1].answerExplanation
                        }
                        currentQuestion={currentQuestion}
                        totalQuestions={questionList.length}
                        storedUserAnswersList={userAnswers}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        toQuizResultsScreen={toQuizResultsScreen}
                        quizComplete={quizComplete}
                      />
                    );

                  default:
                    return <>not a valid type of quiz</>;
                }
              })()}
            </div>
          ) : (
            <QuizResults
              // isPreQuiz={isPreQuiz}
              shareLinkUser={shareLinkUser}
              preQuizResults={preQuizResults}
              postQuizResults={postQuizResults}
              themeColor={getThemeColor(false)}
              jumpToQuestion={jumpToQuestion}
              prevQuestion={currentQuestion}
            />

            // <div className="quiz-results-container flex h-full w-full flex-col items-center gap-12 px-11 py-3 md-qz:self-center">
            //   <div className="quiz-results-graphs flex h-full w-full flex-row items-center justify-center gap-6">
            //     {/* <figure id="prequiz-results"></figure> */}
            //     <QuizResultsChart
            //       isPreQuiz={true}
            //       quizResults={preQuizResults}
            //       themeColor={getThemeColor(false)}
            //     />

            //     {/* <div
            //       id="results-key"
            //       className=" flex h-full w-full flex-col content-start gap-1"
            //     >
            //       <div className="flex flex-row items-center gap-1 text-left">
            //         <div className="h-[20px] w-[20px] bg-sciquelCorrectBG"></div>
            //         Correct
            //       </div>
            //       <div className="flex flex-row items-center gap-1 text-left">
            //         <div className="h-[20px] w-[20px] bg-sciquelIncorrectBG"></div>
            //         Incorrect
            //       </div>
            //       <div className="flex flex-row items-center gap-1 text-left">
            //         <div className="h-[20px] w-[20px] bg-gray-200"></div>
            //         Unanswered
            //       </div>
            //     </div> */}

            //     {/* <figure id="postquiz-results"></figure> */}
            //     <QuizResultsChart
            //       isPreQuiz={false}
            //       quizResults={postQuizResults}
            //       themeColor={getThemeColor(false)}
            //     />
            //   </div>

            //   <div className="quiz-question-buttons flex h-full w-full flex-row items-center justify-start gap-5">
            //     {postQuizResults?.map((result: boolean | null, index: number) => (
            //       <button
            //         // className="text-center "
            //         className={`flex h-[72px] w-[72px] items-center justify-center rounded-sm border border-black bg-white text-center text-[22px] font-semibold transition duration-300 hover:bg-gray-100
            //           ${
            //             result
            //               ? " text-sciquelCorrectText"
            //               : " text-sciquelIncorrectText"
            //           }
            //         `}
            //         key={index}
            //         onClick={() => jumpToQuestion(index + 1)}
            //       >
            //         Q{index + 1}
            //       </button>
            //     ))}
            //   </div>

            //   {/* {preQuizResults?.map((result: boolean | null, index: number) => (
            //     <div key={index}>
            //       Pre: {result?.toString()}; Post:{" "}
            //       {postQuizResults?.[index]?.toString()}
            //     </div>
            //   ))} */}
            // </div>
          )}
        </div>
      </div>
    </div>
  );
}
