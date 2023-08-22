import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import checkmark from "../Quiz/checkmark.png";
import x_mark from "../Quiz/xmark.png";

interface Props {
  isPreQuiz: boolean; // Boolean value that determines if quiz is a pre- or post-quiz
  themeColor: string; // Theme color of the quiz (hex), matching with story topic tag color
  matchStatements: string[]; // The statements the user must match choices to
  choices: string[]; // The available choices for the question. (in order of display as well)
  correctAnswerMap: Map<string, string[]>; // The correct answer for the question.
  answerExplanation: string[]; // List containing the explanation(s) for the question.
  currentQuestion: number; // The question # the user is looking at.
  totalQuestions: number; // The total number of questions.
  onPrevious: () => void; // The function called when using the previous button.
  onNext: () => void; // The function called when using the next button.
}

export default function MultipleMatchQuiz({
  isPreQuiz,
  themeColor,
  matchStatements,
  choices,
  correctAnswerMap,
  answerExplanation,
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}: Props) {
  const quizContainerId = isPreQuiz ? "prequiz-mm" : "postquiz-mm";
  // const isTouchDevice = "ontouchstart" in window;

  const initialSubmittedAnswers: Record<string, string[]>[] = new Array<
    Record<string, string[]>
  >(totalQuestions).fill({});
  const [submittedAnswersList, setSubmittedAnswersList] = useState(
    initialSubmittedAnswers,
  );

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<boolean | null>
  >(Array.from({ length: totalQuestions }, () => null));

  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );

  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null,
  );

  const initialUserAnswers: string[][][] = new Array(totalQuestions)
    .fill(null)
    .map(() => new Array<string[]>());
  const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers);

  const initialAnswerChoicesList: string[][] = Array.from(
    { length: totalQuestions },
    () => [],
  );
  const [answerChoicesList, setAnswerChoicesList] = useState(
    initialAnswerChoicesList,
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
      ".multiple-match-answer-choice-holder",
    );

    // const fromColString = dragBorder.getAttribute("from-col");
    // const fromCol = fromColString ? parseInt(fromColString, 10) : 0;
    // console.log("fromCol",fromCol);
    // console.log("dragItem", dragItem);
    // console.log("dragBorder", dragBorder);

    setDraggedElement(dragBorder);

    if (dragItem && dragBorder) {
      setTimeout(() => {
        dragItem.style.opacity = "0"; // Hide the original item after a short delay
        dragBorder.style.borderColor = themeColor;
      }, 0);
    }
  };

  /* Called when match option is tapped (for mobile only, in place of drag/drop) */
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const isTouchDevice = "ontouchstart" in window;
    // if (!isTouchDevice && !window.matchMedia("(max-width: 768px)").matches) {
    if (!isTouchDevice) {
      return; //  if not a mobile/touch device, do nothing
    }
    const tapTarget = e.target as HTMLElement;
    const dragBorder = getTargetParent(tapTarget, ".answer-choice-border");

    // if we are not already in process of selecting/moving match statements
    if (!draggedElement) {
      // console.log("we are selecting");

      if (!dragBorder) {
        console.log("dragBorder doesn't exist");
        return;
      }

      setDraggedElement(dragBorder);
    } else if (!dragBorder) {
      // draggedElement has been set, so we are dropping (not selecting)
      // console.log("draggedElement", draggedElement);
      // console.log("we are dropping");

      // determine if swapping (dropping) into column or answer area
      const quizColParent = getTargetParent(tapTarget, ".quiz-col");
      if (quizColParent) {
        handleColDropOrTap(e, quizColParent); // we are dropping into a COLUMN
      } else {
        const answerChoiceArea = getTargetParent(
          tapTarget,
          ".multiple-match-answer-choice-area",
        );
        if (!answerChoiceArea) {
          return;
        }
        handleAnswerChoiceAreaDropOrTap(e); // we are dropping into the ANSWER AREA
      }
      setDraggedElement(null);
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
  const handleColDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dropTarget = e.target as HTMLElement;
    const quizColParent = getTargetParent(dropTarget, ".quiz-col");
    if (!quizColParent) {
      return;
    }
    handleColDropOrTap(e, quizColParent);
  };

  const handleAnswerChoiceAreaDragOver = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
  };

  /* Handles the logic behind dropping/tapping an answer into a column */
  const handleColDropOrTap = (
    e:
      | React.DragEventHandler<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
    quizColParent: HTMLElement,
  ) => {
    const colIndexString = quizColParent.getAttribute("col-index");
    const colIndex = colIndexString ? parseInt(colIndexString, 10) : 0;

    console.log("quizColParent", quizColParent);
    console.log("colIndex", colIndex);

    if (draggedElement) {
      const fromColString = draggedElement.getAttribute("from-col");
      const fromCol = fromColString ? parseInt(fromColString, 10) : 0;

      console.log("fromCol", fromCol);

      const updatedUserAnswersList = [...userAnswersList];
      const currUserAnswers = updatedUserAnswersList[currentQuestion - 1];
      const updatedAnswerChoicesList = [...answerChoicesList];
      let currAnswerChoices = updatedAnswerChoicesList[currentQuestion - 1];

      const matchText =
        draggedElement.querySelector<HTMLElement>(".match-text")?.lastChild
          ?.textContent;

      if (!currUserAnswers[colIndex]) {
        // Initialize the array if it's not already initialized
        currUserAnswers[colIndex] = [];
      }

      console.log("draggedElement", draggedElement);
      console.log("matchText", matchText);

      if (matchText) {
        // remove the answer choice from answerChoices or userAnswers (for the current question)
        if (!fromCol) {
          currAnswerChoices = currAnswerChoices.filter(
            (choice) => choice !== matchText,
          );

          if (
            !currUserAnswers &&
            !updatedAnswerChoicesList[currentQuestion - 1]
          ) {
            // Initialize the array if it's not already initialized AND if user hasn't touched answers
            updatedAnswerChoicesList[currentQuestion - 1] = choices;
          }
        } else {
          // remove from userAnswers (for curr question)
          const draggedElementColIndexString =
            draggedElement.parentElement?.getAttribute("col-index");
          const draggedElementColIndex = draggedElementColIndexString
            ? parseInt(draggedElementColIndexString, 10)
            : 0;

          console.log(
            "draggedElementColIndexString",
            draggedElementColIndexString,
          );
          console.log("draggedElementColIndex", draggedElementColIndex);

          currUserAnswers[draggedElementColIndex] = currUserAnswers[
            draggedElementColIndex
          ].filter((answer) => answer !== matchText);
        }

        // get the dragged answer to update userAnswersList, update under appropriate statement
        currUserAnswers[colIndex].push(matchText);
        console.log("currUserAnswers", currUserAnswers);
        console.log("updatedUserAnswersList", updatedUserAnswersList);
        setUserAnswersList(updatedUserAnswersList);

        updatedAnswerChoicesList[currentQuestion - 1] = currAnswerChoices;
        console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
        setAnswerChoicesList(updatedAnswerChoicesList);
      }
    }
  };

  /* Handles the logic behind dropping/tapping an answer into the answer choice area */
  const handleAnswerChoiceAreaDropOrTap = (
    e:
      | React.DragEventHandler<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
  ) => {
    if (draggedElement) {
      const fromColString = draggedElement.getAttribute("from-col");
      const fromCol = fromColString ? parseInt(fromColString, 10) : 0;

      const updatedUserAnswersList = [...userAnswersList];
      const currUserAnswers = updatedUserAnswersList[currentQuestion - 1];
      const updatedAnswerChoicesList = [...answerChoicesList];
      const currAnswerChoices = updatedAnswerChoicesList[currentQuestion - 1];

      const matchText =
        draggedElement.querySelector<HTMLElement>(".match-text")?.lastChild
          ?.textContent;

      // console.log("draggedElement", draggedElement);
      // console.log("matchText", matchText);

      if (matchText) {
        // remove the answer choice from answerChoices (for the current question)
        if (!fromCol) {
          return; // if dragging from answer choice area back into the area, do nothing
        } else {
          // remove from userAnswers (for curr question)
          const draggedElementColIndexString =
            draggedElement.parentElement?.getAttribute("col-index");
          const draggedElementColIndex = draggedElementColIndexString
            ? parseInt(draggedElementColIndexString, 10)
            : 0;

          console.log("draggedElementColIndex", draggedElementColIndex);

          currAnswerChoices.push(matchText); // add back to area
          currUserAnswers[draggedElementColIndex] = currUserAnswers[
            draggedElementColIndex
          ].filter((answer) => answer !== matchText); // remove from column

          // get the dragged answer to update userAnswersList
          // console.log("currUserAnswers", currUserAnswers);
          console.log("updatedUserAnswersList", updatedUserAnswersList);
          setUserAnswersList(updatedUserAnswersList);

          updatedAnswerChoicesList[currentQuestion - 1] = currAnswerChoices;
          console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
          setAnswerChoicesList(updatedAnswerChoicesList);
        }
      }
    }
  };

  /* Called when user drops answer back into answer choice area */
  const handleAnswerChoiceAreaDrop: React.DragEventHandler<HTMLDivElement> = (
    e,
  ) => {
    const dropTarget = e.target as HTMLElement;
    const answerChoiceArea = getTargetParent(
      dropTarget,
      ".multiple-match-answer-choice-area",
    );
    if (!answerChoiceArea) {
      return;
    }
    handleAnswerChoiceAreaDropOrTap(e);
  };

  /* add animation when hovering over droppable items */
  useEffect(() => {
    // const containers = document.querySelectorAll<HTMLElement>(".quiz-col");
    const emptySlots = document.querySelectorAll<HTMLElement>(
      ".multiple-match-slot",
    );

    emptySlots.forEach((emptySlot) => {
      emptySlot.addEventListener("dragover", (e) => {
        e.preventDefault();
        // emptySlot?.classList.add("shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]");
        emptySlot?.classList.add("!bg-gray-300");
      });

      emptySlot.addEventListener("dragleave", () => {
        // emptySlot?.classList.remove("shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]");
        emptySlot?.classList.remove("!bg-gray-300");
      });

      emptySlot.addEventListener("drop", () => {
        // emptySlot?.classList.remove("shadow-[0_0px_6px_2px_rgba(0,0,0,0.2)]");
        emptySlot?.classList.remove("!bg-gray-300");
      });

      emptySlot.addEventListener("dragenter", (e) => {
        e.preventDefault();
      });
    });
  }, []);

  /**
   * For updating the component when the user clicks the previous/next buttons: Updates match
   * statement display, sets showAnswerExplanation to the appropriate value for the new current
   * question, and sets the class of the MM selection accordingly
   */
  useEffect(() => {
    const multipleMatchQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-mm" : "#postquiz-mm",
    );
    const quizContainer = document.getElementById(quizContainerId);
    const updatedAnswerChoicesList = [...answerChoicesList];

    // console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);

    if (
      !userAnswers[currentQuestion - 1] &&
      !updatedAnswerChoicesList[currentQuestion - 1].length
    ) {
      // Initialize the array if it's not already initialized AND if user hasn't touched answers
      updatedAnswerChoicesList[currentQuestion - 1] = choices;
      console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
      setAnswerChoicesList(updatedAnswerChoicesList);
    }

    if (multipleMatchQuizSelection) {
      if (currentQuestion !== prevCurrentQuestion.current) {
        const hasAnswered = hasAnsweredList[currentQuestion - 1];

        if (hasAnswered && !isPreQuiz) {
          multipleMatchQuizSelection.classList.add("pointer-events-none");
          setShowAnswerExplanation(true);
        } else {
          multipleMatchQuizSelection.classList.remove("pointer-events-none");
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
    const currUserAnswers = userAnswersList[currentQuestion - 1];
    const updatedSubmittedAnswersList = [...submittedAnswersList];

    // save user's submitted answers
    const updatedRecord = currUserAnswers.map(
      (selectedAnswers, statementIndex) => {
        const statement = matchStatements[statementIndex];
        return {
          [statement]: selectedAnswers,
        };
      },
    );

    updatedSubmittedAnswersList[currentQuestion - 1] = Object.assign(
      {},
      updatedSubmittedAnswersList[currentQuestion - 1],
      ...updatedRecord,
    );

    console.log("updatedSubmittedAnswersList", updatedSubmittedAnswersList);

    setSubmittedAnswersList(updatedSubmittedAnswersList);

    // const updatedAnswerCorrectList = [...answerCorrectList];
    // updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    // set class to lock the MM selection
    const multipleMatchQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-mm" : "#postquiz-mm",
    );
    if (multipleMatchQuizSelection) {
      console.log("locking pointer events");
      multipleMatchQuizSelection.classList.add("pointer-events-none");

      console.log("multipleMatchQuizSelection", multipleMatchQuizSelection);
    }

    // give the user points or update their score here ?

    // setAnswerCorrectList(updatedAnswerCorrectList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  const statementCorrect = (statement: string) => {
    const currSubmittedAnswers = submittedAnswersList[currentQuestion - 1];
    const userAnswerArray = currSubmittedAnswers[statement] || [];
    const correctAnswersForStatement = correctAnswerMap.get(statement) || [];

    // Sort the user's answer array and the correct answers array
    const sortedUserAnswerArray = userAnswerArray.slice().sort();
    const sortedCorrectAnswersForStatement = correctAnswersForStatement
      .slice()
      .sort();

    // Compare the sorted arrays
    const isCorrect =
      JSON.stringify(sortedUserAnswerArray) ===
      JSON.stringify(sortedCorrectAnswersForStatement);

    return isCorrect;
  };

  const matchOptionCorrect = (statement: string, userAnswer: string) => {
    // const statement = matchStatements[statementIndex];
    const correctAnswersForStatement = correctAnswerMap.get(statement) || [];

    if (correctAnswersForStatement.includes(userAnswer)) {
      // The target string is included in the array of correct answers for the given match statement
      return true;
    }
    return false;
  };

  const answerChoiceExistsInCorrectAnswers = (answerChoice: string) => {
    const correctAnswersArrays = Array.from(correctAnswerMap.values());

    for (const correctAnswers of correctAnswersArrays) {
      if (correctAnswers.includes(answerChoice)) {
        return true; // User's answer is correct for at least one statement
      }
    }
    return false; // User's answer is not correct for any statement
  };

  /** Handles the previous button of a MM question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious();
  };

  /** Handles the next button of an MM question (called when user clicks "Next" button). */
  const handleNext = () => {
    // call quiz's handle previous function to go forward a question
    onNext();
  };

  const answerCorrect = answerCorrectList[currentQuestion - 1];
  const userAnswers = userAnswersList[currentQuestion - 1];
  const answerChoices = answerChoicesList[currentQuestion - 1];
  const hasAnswered = hasAnsweredList[currentQuestion - 1];

  // boolean values to determine which buttons to show, based on whether quiz is prequiz or not
  const showPreviousButton = currentQuestion > 1;
  const showNextButton =
    (currentQuestion < totalQuestions && isPreQuiz) ||
    (currentQuestion < totalQuestions && hasAnswered);
  const showSubmitButton = !showAnswerExplanation && !isPreQuiz;

  const numRows = Math.ceil(choices.length / matchStatements.length);

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className="multiple-match-selection mb-[20px] flex flex-col items-start"
        id={isPreQuiz ? "prequiz-mm" : "postquiz-mm"}
      >
        <div className="multiple-match-drop-area flex-wrap flex w-full flex-row items-start justify-center gap-3 pb-3">
          {matchStatements.map((statement, statementIndex) => {
            return (
              <div
                className="quiz-col my-3.5 basis-[30%] flex h-full h-full w-full shrink flex-col gap-4 sm-mm:w-[120px] xsm:w-[110px] xsm-mm:w-[100px]"
                onDrop={handleColDrop}
                onClick={handleTap}
                col-index={statementIndex}
                key={statementIndex}
              >
                <div className="multiple-match-statement flex h-full w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-sciquelCardBg p-3 text-center text-[18px] xsm:inline-block xsm-mm:text-[16px]">
                  {statement}
                </div>

                {userAnswers[statementIndex] &&
                  userAnswers[statementIndex].map(
                    (userAnswer, userAnswerIndex) => {
                      return (
                        <div
                          className="answer-choice-border z-1 box-border flex h-full min-h-[50px] w-full rounded-[4px] border-2 border-dashed border-transparent transition-all"
                          from-col="1"
                          key={userAnswerIndex}
                        >
                          <div
                            className={`multiple-match-answer-choice-holder min-w-100 relative box-border flex h-full w-full cursor-move items-center justify-end break-words rounded-[4px] border border-black bg-sciquelCardBg text-center text-[18px] transition duration-300 ease-in-out 
                            ${
                              "ontouchstart" in window &&
                              !hasAnswered &&
                              userAnswer ===
                                draggedElement?.querySelector<HTMLElement>(
                                  ".match-text",
                                )?.lastChild?.textContent
                                ? "selected !bg-gray-200"
                                : ""
                            }  
                            ${
                              hasAnswered &&
                              !matchOptionCorrect(statement, userAnswer)
                                ? "select-incorrect !bg-sciquelIncorrectBG"
                                : ""
                            }  
                            ${
                              hasAnswered &&
                              matchOptionCorrect(statement, userAnswer)
                                ? "select-correct !bg-sciquelCorrectBG"
                                : ""
                            }`}
                            draggable="true"
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            key={userAnswerIndex}
                          >
                            <div
                              className={`image-holder absolute inset-0 flex h-full w-[35%] max-w-[50px] grow items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out
                              ${
                                "ontouchstart" in window &&
                                !hasAnswered &&
                                userAnswer ===
                                  draggedElement?.querySelector<HTMLElement>(
                                    ".match-text",
                                  )?.lastChild?.textContent
                                  ? "selected !bg-[#c2bed0]"
                                  : ""
                              }
                              ${
                                hasAnswered &&
                                !matchOptionCorrect(statement, userAnswer)
                                  ? "select-incorrect !bg-[#d09191]"
                                  : ""
                              }  
                              ${
                                hasAnswered &&
                                matchOptionCorrect(statement, userAnswer)
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
                                (matchOptionCorrect(statement, userAnswer) ? (
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

                            <div className="match-text align-self-center flex w-[72%] max-w-full items-center justify-end justify-self-end hyphens-auto break-words p-3 text-center !inline-block md:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px]">
                              {userAnswer}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                {/* 
                {!hasAnswered && (
                  <div className="multiple-match-slot h-[50px] w-full rounded-[4px] border bg-gray-200 p-3 transition duration-300"></div>
                )} */}
                <div className="multiple-match-slot h-[50px] w-full rounded-[4px] border bg-gray-200 p-3 transition duration-300"></div>
              </div>
            );
          })}
        </div>

        <div
          className={`multiple-match-answer-choice-area grid w-full place-items-center gap-2 border-t-[1.75px] pt-6 ${
            !hasAnswered ? "mb-14 min-h-[80px]" : ""
          }`}
          style={{
            gridTemplateColumns: `repeat(${matchStatements.length}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, auto)`,
            borderColor: `${themeColor}`,
          }}
          onDragOver={handleAnswerChoiceAreaDragOver}
          onDrop={handleAnswerChoiceAreaDrop}
          onClick={handleTap}
        >
          {answerChoices.map((choice, choiceIndex) => (
            <div
              key={choiceIndex}
              // choice-index={choiceIndex}
              className="grid-cell h-full w-full overflow-hidden"
              style={{
                gridColumn: `${(choiceIndex % matchStatements.length) + 1}`,
                gridRow: `${
                  Math.floor(choiceIndex / matchStatements.length) + 1
                }`,
              }}
            >
              <div
                className="answer-choice-border z-1 box-border flex h-full min-h-[50px] w-full rounded-[4px] border-2 border-dashed border-transparent transition-all"
                from-col="0"
              >
                <div
                  className={`multiple-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg text-center text-[18px] transition duration-300 ease-in-out 
                  ${
                    "ontouchstart" in window &&
                    !hasAnswered &&
                    choice ===
                      draggedElement?.querySelector<HTMLElement>(".match-text")
                        ?.lastChild?.textContent
                      ? "selected !bg-gray-200"
                      : ""
                  }  
                  ${
                    hasAnswered && answerChoiceExistsInCorrectAnswers(choice)
                      ? "select-incorrect !bg-sciquelIncorrectBG"
                      : ""
                  }  
                  ${
                    hasAnswered && !answerChoiceExistsInCorrectAnswers(choice)
                      ? "select-correct !bg-sciquelCorrectBG"
                      : ""
                  }`}
                  draggable="true"
                  onClick={handleTap}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className={`image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out 
                    ${
                      "ontouchstart" in window &&
                      !hasAnswered &&
                      choice ===
                        draggedElement?.querySelector<HTMLElement>(
                          ".match-text",
                        )?.lastChild?.textContent
                        ? "selected !bg-[#c2bed0]"
                        : ""
                    }
                    ${
                      hasAnswered && answerChoiceExistsInCorrectAnswers(choice)
                        ? "select-incorrect !bg-[#d09191]"
                        : ""
                    }  
                    ${
                      hasAnswered && !answerChoiceExistsInCorrectAnswers(choice)
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
                      (answerChoiceExistsInCorrectAnswers(choice) ? (
                        <Image
                          src={x_mark}
                          className="h-6 w-6 flex-grow-0"
                          alt="x_mark"
                        />
                      ) : (
                        <Image
                          src={checkmark}
                          className="h-5 w-6 flex-grow-0"
                          alt="checkmark"
                        />
                      ))}
                  </div>
                  <div className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto break-words p-3 xsm-mm:text-[16px]">
                    {choice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAnswerExplanation && (
        <div className="answer-explanation-container-tf flex w-full flex-col">
          <ul className="explanation-list w-full list-none p-0">
            {matchStatements.map((statement, statementIndex) => {
              return (
                <li
                  className={
                    statementCorrect(statement)
                      ? "answer-explanation-tf correct font-quicksand my-1 box-border w-full border-l-8 border-sciquelCorrectBG p-4 pl-8 text-[18px] xsm-mm:text-[16px] font-medium leading-6  text-sciquelCorrectText"
                      : "answer-explanation-tf incorrect font-quicksand my-1 box-border w-full border-l-8 border-sciquelIncorrectBG p-4 pl-8 text-[18px] xsm-mm:text-[16px] font-medium leading-6 text-sciquelIncorrectText"
                  }
                >
                  {statementCorrect(statement) ? "Correct. " : "Incorrect. "}
                  {answerExplanation[statementIndex]}
                </li>
              );
            })}
          </ul>

          <div
            className="user-quiz-statistics  ml-auto mt-4 w-full text-right text-[14px] leading-normal text-gray-600"
            style={{ marginLeft: "auto" }}
          >
            {answerCorrect && (
              <>
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </>
            )}
            {!answerCorrect && (
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
