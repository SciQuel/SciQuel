import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import checkmark from "../Quiz/checkmark.png";
import x_mark from "../Quiz/xmark.png";

interface Props {
  isPreQuiz: boolean; // Boolean value that determines if quiz is a pre- or post-quiz
  themeColor: string;
  matchStatements: string[]; // The statements the user must match choices to
  choices: string[]; // The available choices for the question. (in order of display as well)
  correctAnswer: string[]; // The correct answer for the question.
  answerExplanation: string[]; // List containing the explanation(s) for the question.
  currentQuestion: number; // The question # the user is looking at.
  totalQuestions: number; // The total number of questions.
  onPrevious: () => void; // The function called when using the previous button.
  onNext: () => void; // The function called when using the next button.
}

export default function OneMatchQuiz({
  isPreQuiz,
  themeColor,
  matchStatements,
  choices,
  correctAnswer,
  answerExplanation,
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}: Props) {
  const quizContainerId = isPreQuiz ? "prequiz-om" : "postquiz-om";

  const initialUserAnswers: string[][] = Array.from(
    { length: totalQuestions },
    () => [],
  );
  const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers);

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<Array<boolean | null>>
  >(
    Array.from({ length: totalQuestions }, () =>
      Array.from({ length: choices.length }, () => null),
    ),
  );

  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null,
  );

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  const getTargetParent = (target: HTMLElement, targetClass: string) => {
    // Get the nearest targetClass parent
    const targetParent = target.closest(targetClass) as HTMLElement;
    if (!targetParent) {
      return null;
    }
    return targetParent;
  };

  /* Called when the user tries to drag a draggable item (answer choice) */
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dragTarget = e.target as HTMLElement; // the item being dragged
    const dragBorder = getTargetParent(dragTarget, ".answer-choice-border");
    if (!dragBorder) {
      return;
    }
    const dragItem = dragBorder?.querySelector<HTMLElement>(
      ".one-match-answer-choice-holder",
    );

    setDraggedElement(dragBorder);

    if (dragItem && dragBorder) {
      setTimeout(() => {
        dragItem.style.opacity = "0"; // Hide the original item after a short delay
        dragBorder.style.borderColor = themeColor;
      }, 0);
    }
  };

  /* Handles the visual changes when the user stops dragging */
  const handleDragEnd = () => {
    const dragBorder = draggedElement;
    const dragContainer = dragBorder?.firstChild as HTMLElement;
    if (dragContainer) {
      dragContainer.style.opacity = "1"; // Restore opacity when dragging ends
    }
    if (dragBorder) {
      dragBorder.style.borderColor = "transparent";
    }
    setDraggedElement(null);
  };

  /* Called when user drops a match option into one of the answer columns */
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dropTarget = e.target as HTMLElement;
    const quizRowParent = getTargetParent(dropTarget, ".quiz-row");

    const dropRowIndexString = quizRowParent?.getAttribute("row-index");
    const draggedElementRowIndexString =
      draggedElement?.parentElement?.getAttribute("row-index");

    if (
      !quizRowParent ||
      !dropRowIndexString ||
      !draggedElementRowIndexString
    ) {
      console.log("no quiz row found -- invalid drop area");
      return;
    }

    const dropRowIndex = dropRowIndexString
      ? parseInt(dropRowIndexString, 10)
      : 0; // index of the row user drops into
    const draggedElementRowIndex = draggedElementRowIndexString
      ? parseInt(draggedElementRowIndexString, 10)
      : 0;

    // if the row indices of the drop target and dragged element are different, swap
    if (draggedElementRowIndex !== dropRowIndex) {
      handleSwitch(e, quizRowParent);
    }
  };

  /* Handles the logic behind dropping (or tapping to switch) a match option */
  const handleSwitch = (
    e:
      | React.DragEventHandler<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
    quizRowParent: HTMLElement,
  ) => {
    console.log("handling a drop/tap");

    const rowIndexString = quizRowParent.getAttribute("row-index");
    const rowIndex = rowIndexString ? parseInt(rowIndexString, 10) : 0; // index of the row user drops into

    console.log("quizRowParent", quizRowParent);
    console.log("rowIndex", rowIndex);

    // const updatedUserAnswersList = [...userAnswersList];
    const currUserAnswers = [...userAnswersList][currentQuestion - 1];
    const matchText =
      draggedElement?.querySelector<HTMLElement>(".match-text")?.lastChild
        ?.textContent;

    if (draggedElement && matchText) {
      const draggedElementRowIndexString =
        draggedElement.parentElement?.getAttribute("row-index");
      const draggedElementRowIndex = draggedElementRowIndexString
        ? parseInt(draggedElementRowIndexString, 10)
        : 0;

      const updatedUserAnswersList = userAnswersList.map(
        (userAnswers, questionIndex) => {
          if (questionIndex === currentQuestion - 1) {
            return userAnswers.map((answer, answerIndex) => {
              if (answerIndex === draggedElementRowIndex) {
                return currUserAnswers[rowIndex];
              } else if (answerIndex === rowIndex) {
                return matchText;
              }
              return answer;
            });
          }
          return userAnswers;
        },
      );
      setUserAnswersList(updatedUserAnswersList);
    }
  };

  /* add drop shadow animation when hovering over rows */
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>(".quiz-row");

    containers.forEach((container) => {
      const switchElement = container.querySelector<HTMLElement>(
        ".one-match-answer-choice-holder",
      );

      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        switchElement?.classList.add("shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]");
      });

      container.addEventListener("dragleave", () => {
        switchElement?.classList.remove(
          "shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]",
        );
      });

      container.addEventListener("drop", () => {
        switchElement?.classList.remove(
          "shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]",
        );
      });

      container.addEventListener("dragenter", (e) => {
        e.preventDefault();
      });
    });
  }, []);

  /**
   * For updating the component when the user clicks the previous/next buttons: Updates match
   * statement display, sets showAnswerExplanation to the appropriate value for the new current
   * question, and sets the class of the OM selection accordingly
   */
  useEffect(() => {
    const oneMatchQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-om" : "#postquiz-om",
    );

    // const updatedUserAnswersList = [...userAnswersList];
    const userAnswers = userAnswersList[currentQuestion - 1];
    if (!userAnswers.length) {
      // Initialize the array if it's not already initialized / if user hasn't touched answers
      const updatedUserAnswersList = [...userAnswersList];
      updatedUserAnswersList[currentQuestion - 1] = choices;
      console.log("updatedUserAnswersList", updatedUserAnswersList);
      setUserAnswersList(updatedUserAnswersList);
    }

    if (oneMatchQuizSelection) {
      if (currentQuestion !== prevCurrentQuestion.current) {
        const hasAnswered = hasAnsweredList[currentQuestion - 1];

        if (hasAnswered && !isPreQuiz) {
          oneMatchQuizSelection.classList.add("pointer-events-none");
          setShowAnswerExplanation(true);
        } else {
          oneMatchQuizSelection.classList.remove("pointer-events-none");
          setShowAnswerExplanation(false);
        }
      }

      prevCurrentQuestion.current = currentQuestion;
    }
  }, [currentQuestion, isPreQuiz, hasAnsweredList]);

  /**
   * Handles the submission of a MC question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswers = userAnswersList[currentQuestion - 1];

    // for each statement, check if the selected answer is correct
    const answerCorrect: boolean[] = userAnswers.map(
      (userAnswer, index) => userAnswer === correctAnswer[index],
    );

    console.log("answerCorrect", answerCorrect);

    const updatedAnswerCorrectList = [...answerCorrectList];
    updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    // set class to lock the OM selection
    const oneMatchQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-om" : "#postquiz-om",
    );
    if (oneMatchQuizSelection) {
      oneMatchQuizSelection.classList.add("pointer-events-none");
    }

    // give the user points or update their score here ?

    setAnswerCorrectList(updatedAnswerCorrectList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  /** Handles the previous button of a OM question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious();
  };

  /** Handles the next button of an OM question (called when user clicks "Next" button). */
  const handleNext = () => {
    // call quiz's handle previous function to go forward a question
    onNext();
  };

  const userAnswers = userAnswersList[currentQuestion - 1];
  const answerCorrect = answerCorrectList[currentQuestion - 1];
  const hasAnswered = hasAnsweredList[currentQuestion - 1];

  // boolean values to determine which buttons to show, based on whether quiz is prequiz or not
  const showPreviousButton = currentQuestion > 1;
  const showNextButton =
    (currentQuestion < totalQuestions && isPreQuiz) ||
    (currentQuestion < totalQuestions && hasAnswered);
  const showSubmitButton = !showAnswerExplanation && !isPreQuiz;
  let shortenMatchLine = false;

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className="one-match-selection mb-[20px] flex flex-col items-start"
        id={isPreQuiz ? "prequiz-om" : "postquiz-om"}
      >
        {matchStatements.map((statement, index) => {
          const answerText = choices[index];

          // Calculate the length of the answer text and statement text
          const statementTextLength = statement.length;
          const answerTextLength = answerText.length;

          // Determine a threshold for adjusting the width
          const textThreshold = 20;
          let widthClass = "w-[60%]";

          // Conditionally set a class for adjusting the width
          if (
            shortenMatchLine ||
            answerTextLength > textThreshold ||
            statementTextLength > textThreshold
          ) {
            widthClass = "w-[20%]";
            shortenMatchLine = true;
          }

          return (
            <div
              className="quiz-row my-3.5 flex w-full flex-row"
              onDrop={handleDrop}
              key={index}
              row-index={index}
            >
              <div
                className={`one-match-answer-option min-w-100 flex w-[40%] flex-wrap items-center justify-center rounded-[4px] border border-black bg-sciquelCardBg p-3`}
              >
                <p className="match-statement-text w-full break-words text-center text-[18px]">
                  {statement}
                </p>
              </div>
              <div
                className={`line z-10 h-[2px] ${widthClass} self-center transition duration-300 ease-in-out`}
                style={{
                  backgroundColor: themeColor,
                  ...(hasAnswered && !answerCorrect[index]
                    ? {
                        backgroundColor: "#d06363",
                      }
                    : {}),
                  ...(hasAnswered && answerCorrect[index]
                    ? {
                        backgroundColor: "#437e64",
                      }
                    : {}),
                }}
              />
              <div className="answer-choice-border z-1 box-border flex w-1/2 rounded-[4px] border-2 border-dashed border-transparent transition-all">
                <div
                  // className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg pr-3 text-center text-[18px] transition-all "
                  className={`one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg pr-3 text-center text-[18px] transition transition-all duration-300 ease-in-out 
                  ${
                    hasAnswered && !answerCorrect[index]
                      ? "select-incorrect !bg-sciquelIncorrectBG"
                      : ""
                  }  
                  ${
                    hasAnswered && answerCorrect[index]
                      ? "select-correct !bg-sciquelCorrectBG"
                      : ""
                  }`}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {/* <div className="image-holder mr-3 flex h-full w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-3"> */}
                  <div
                    //   className={`image-holder mr-3 flex h-full w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-3 transition duration-300 ease-in-out
                    //   ${hasAnswered ? "!bg-transparent" : ""}
                    // `}
                    className={`image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out                   
                  ${
                    hasAnswered && !answerCorrect[index]
                      ? "select-incorrect !bg-[#d09191]"
                      : ""
                  }  
                  ${
                    hasAnswered && answerCorrect[index]
                      ? "select-correct !bg-[#9dbda1]"
                      : ""
                  }`}
                  >
                    {!hasAnswered && (
                      <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      </span>
                    )}

                    {hasAnswered &&
                      (answerCorrect[index] ? (
                        <Image
                          src={checkmark}
                          className="h-5 w-6 flex-grow-0"
                          alt="checkmark"
                        />
                      ) : (
                        <Image
                          src={x_mark}
                          className="h-6 w-6 flex-grow-0"
                          alt="x_mark"
                        />
                      ))}
                  </div>
                  <div
                    className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3"
                    key={`match_${index}`}
                  >
                    {userAnswers[index]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAnswerExplanation && answerCorrect && (
        <div className="answer-explanation-container-tf flex w-full flex-col">
          <ul className="explanation-list w-full list-none p-0">
            {(answerCorrect as boolean[]).map(
              (result: boolean, index: number) => (
                <li
                  className={
                    result
                      ? "answer-explanation-tf correct font-quicksand my-1 box-border w-full border-l-8 border-sciquelCorrectBG p-4 pl-8 text-[18px] font-medium leading-6  text-sciquelCorrectText"
                      : "answer-explanation-tf incorrect font-quicksand my-1 box-border w-full border-l-8 border-sciquelIncorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelIncorrectText"
                  }
                  key={index}
                >
                  {result ? "Correct. " : "Incorrect. "}
                  {answerExplanation[index]}
                </li>
              ),
            )}
          </ul>

          <div
            className="user-quiz-statistics  ml-auto mt-4 w-full text-right text-[14px] leading-normal text-gray-600"
            style={{ marginLeft: "auto" }}
          >
            {answerCorrect.every(
              (correct: boolean | null) => correct === true,
            ) && (
              <>
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </>
            )}
            {!answerCorrect.every(
              (correct: boolean | null) => correct === true,
            ) && (
              <>87.6% of SciQuel readers answered this question correctly.</>
            )}
          </div>
        </div>
      )}

      <QuizButtons
        showPreviousButton={showPreviousButton}
        showSubmitButton={showSubmitButton}
        showNextButton={showNextButton}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
