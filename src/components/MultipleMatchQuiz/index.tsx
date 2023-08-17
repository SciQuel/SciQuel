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

  const [selectedOptions, setSelectedOptions] = useState<
    Array<Array<string | null>>
  >(
    Array.from({ length: totalQuestions }, () =>
      Array.from({ length: choices.length }, () => null),
    ),
  );

  // const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<string, string[]>>({});

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<Array<boolean | null>>
  >(
    Array.from({ length: totalQuestions }, () =>
      Array.from({ length: choices.length }, () => null),
    ),
  );

  const initialMatchResultsList: string[][] = Array.from(
    { length: totalQuestions },
    () => [],
  );
  const [matchResultsList, setMatchResultsList] = useState(
    initialMatchResultsList,
  );

  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );

  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null,
  );
  // const [draggedFromCol, setDraggedFromCol] = useState(0);

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

  /* Called when the user tries to drag a draggable item (answer choice) */
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dragTarget = e.target as HTMLElement; // the item being dragged
    let isAllowedDrag = false;
    let parentElement = dragTarget;

    while (parentElement) {
      if (parentElement.classList.contains("answer-choice-border")) {
        isAllowedDrag = true;
        break;
      }
      if (parentElement.parentElement) {
        parentElement = parentElement.parentElement;
      }
    }

    if (!isAllowedDrag) {
      return; // User is dragging outside of allowed elements
    }

    // const dragCell = dragTarget.closest(".grid-cell") as HTMLElement;
    // if (!dragCell) {
    //   return;
    // }
    // const dragBorder = dragCell.querySelector<HTMLElement>(
    //   ".answer-choice-border",
    // );

    const dragBorder = dragTarget.closest(
      ".answer-choice-border",
    ) as HTMLElement;
    if (!dragBorder) {
      return;
    }
    const dragItem = dragBorder?.querySelector<HTMLElement>(
      ".multiple-match-answer-choice-holder",
    );

    // const fromColString = dragBorder.getAttribute("from-col");
    // const fromCol = fromColString ? parseInt(fromColString, 10) : 0;

    // console.log("fromCol",fromCol);

    // console.log("selectedOptions:", selectedOptions);
    console.log("dragItem", dragItem);
    console.log("dragBorder", dragBorder);

    setDraggedElement(dragBorder);
    // setDraggedElement(dragCell);
    // setDraggedElementText(dragItemText);

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
  const handleColDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dropTarget = e.target as HTMLElement;

    // Check if the drop target or any of its ancestors have the class "quiz-col"
    let isAllowedDrop = false;
    let parentElement = dropTarget;

    while (parentElement) {
      if (parentElement.classList.contains("quiz-col")) {
        isAllowedDrop = true;
        break;
      }
      if (parentElement.parentElement) {
        parentElement = parentElement.parentElement;
      }
    }

    if (!isAllowedDrop) {
      return; // User is dropping outside of allowed elements
    }

    // Get the nearest .quiz-col parent
    const quizColParent = dropTarget.closest(".quiz-col") as HTMLElement;
    if (!quizColParent) {
      return;
    }

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

  const handleAnswerChoiceAreaDragOver = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
  };

  /* Called when user drops answer back into answer choice area */
  const handleAnswerChoiceAreaDrop: React.DragEventHandler<HTMLDivElement> = (
    e,
  ) => {
    console.log("dropped back");
    console.log("dropTarget", e.target);

    const dropTarget = e.target as HTMLElement;

    // Check if the drop target or any of its ancestors have the class "quiz-col"
    let isAllowedDrop = false;
    let parentElement = dropTarget;

    while (parentElement) {
      if (
        parentElement.classList.contains("multiple-match-answer-choice-area")
      ) {
        isAllowedDrop = true;
        break;
      }
      if (parentElement.parentElement) {
        parentElement = parentElement.parentElement;
      }
    }

    if (!isAllowedDrop) {
      return; // User is dropping outside of allowed elements
    }

    const answerChoiceArea = dropTarget.closest(
      ".multiple-match-answer-choice-area",
    ) as HTMLElement;
    if (!answerChoiceArea) {
      return;
    }

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
   * question, and sets the class of the OM selection accordingly
   */
  useEffect(() => {
    const oneMatchQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-om" : "#postquiz-om",
    );

    const quizContainer = document.getElementById(quizContainerId);
    const draggables = quizContainer?.querySelectorAll<HTMLElement>(
      ".multiple-match-answer-choice-holder",
    );

    const updatedSelectedOptions = [...selectedOptions]; // Create a copy of the current selectedOptions array
    const updatedAnswerChoicesList = [...answerChoicesList]; // Create a copy of the current selectedOptions array

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

    // for each statement, update the match statement display based on what user had before
    draggables?.forEach((draggable, index) => {
      if (
        draggable.lastChild &&
        !updatedSelectedOptions[currentQuestion - 1].every(
          (value) => value === null,
        )
      ) {
        draggable.lastChild.textContent =
          updatedSelectedOptions[currentQuestion - 1][index];
      }
    });

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
    let userAnswers = selectedOptions[currentQuestion - 1];

    // if userAnswers is empty (user did not move options), submit the initial answer order
    if (userAnswers.every((value) => value === null)) {
      // const updatedSelectedOptions = [...selectedOptions];
      const updatedSelectedOptions = selectedOptions;

      userAnswers = choices;
      updatedSelectedOptions[currentQuestion - 1] = choices;
      setSelectedOptions(updatedSelectedOptions);
    }

    // for each T/F statement, check if the selected answer is correct
    // const answerCorrect: boolean[] = userAnswers.map(
    //   (userAnswer, index) => userAnswer === correctAnswer[index],
    // );

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

  const answerCorrect = answerCorrectList[currentQuestion - 1]; // an array of strings, ex: ["00", "111"]
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
        <div className="multiple-match-drop-area flex w-full flex-row items-start gap-3 pb-3">
          {matchStatements.map((statement, statementIndex) => {
            return (
              <div
                className="quiz-col my-3.5 flex h-full w-full flex-col gap-4"
                onDrop={handleColDrop}
                col-index={statementIndex}
                key={statementIndex}
              >
                <div className="multiple-match-statement flex w-full flex-wrap items-center justify-center overflow-hidden hyphens-auto rounded-[4px] border border-black bg-sciquelCardBg p-3 text-[18px]">
                  {statement}
                </div>

                {/* for every user answer under this statement (based on index), render the answer choice holder/border */}
                {userAnswers[statementIndex] &&
                  userAnswers[statementIndex].map(
                    (userAnswer, userAnswerIndex) => {
                      return (
                        <div
                          className="answer-choice-border z-1 box-border flex h-full min-h-[50px] w-full rounded-[4px] border-2 border-dashed border-transparent transition-all"
                          from-col="1"
                        >
                          <div
                            className={`multiple-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg text-center text-[18px] transition duration-300 ease-in-out`}
                            draggable="true"
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            key={userAnswerIndex}
                          >
                            <div
                              className={`image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out`}
                            >
                              {!hasAnswered && (
                                <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                                </span>
                              )}

                              {hasAnswered &&
                                (answerCorrect[userAnswerIndex] ? (
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
                            <div className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3">
                              {userAnswer}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}

                <div className="multiple-match-slot h-[50px] rounded-[4px] border bg-gray-200 p-3 transition duration-300"></div>
              </div>
            );
          })}
        </div>

        <div
          className="multiple-match-answer-choice-area grid min-h-[120px] w-full place-items-center gap-2 border-t-[1.75px] pt-6"
          style={{
            gridTemplateColumns: `repeat(${matchStatements.length}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, auto)`,
            borderColor: `${themeColor}`,
          }}
          onDragOver={handleAnswerChoiceAreaDragOver}
          onDrop={handleAnswerChoiceAreaDrop}
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
                  className={`multiple-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg text-center text-[18px] transition duration-300 ease-in-out`}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className={`image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out`}
                  >
                    {!hasAnswered && (
                      <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      </span>
                    )}

                    {hasAnswered &&
                      (answerCorrect[choiceIndex] ? (
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
                  <div className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3">
                    {choice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
