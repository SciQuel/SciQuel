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
  const [draggedElementText, setDraggedElementText] =
    useState<HTMLElement | null>(null);

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  // const handleDragStart = (e: DragEvent) => {
  const handleDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dragItem = e.target as HTMLElement; // the item being dragged
    // const dragItemText = e.target?.lastChild as HTMLElement;
    const dragItemText = (e.target as HTMLElement)?.lastChild as HTMLElement;
    const dragBorder = dragItem?.parentElement as HTMLElement; // the original box/spot of the dragged item

    // console.log("selectedOptions:", selectedOptions);
    // console.log("dragItem", dragItem?.innerHTML);
    // console.log("dragItem.lastChild", dragItemText.lastChild);
    // console.log("dragItemText.innerText", dragItemText.innerText);

    setDraggedElement(dragItem);
    setDraggedElementText(dragItemText);

    // e.dataTransfer.setData("text/html", dragItem.innerHTML);
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/html", dragItemText.innerText);
    }

    if (dragItem && dragBorder) {
      setTimeout(() => {
        dragItem.style.opacity = "0"; // Hide the original item after a short delay
        dragBorder.style.borderColor = themeColor;
      }, 0);
    }
  };

  const handleDragEnd = () => {
    const dragBorder = draggedElement?.parentElement as HTMLElement;

    if (draggedElement) {
      draggedElement.style.opacity = "1"; // Restore opacity when dragging ends
    }

    if (dragBorder) {
      dragBorder.style.borderColor = "transparent";
    }

    setDraggedElement(null);
  };

  // const handleDrop = (e: DragEvent) => {
  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const switchElement = e.target as HTMLElement;
    const dragBorder = draggedElement?.parentElement as HTMLElement;

    const quizContainer = document.getElementById(quizContainerId);
    const draggables = quizContainer?.querySelectorAll<HTMLElement>(
      ".multiple-match-answer-choice-holder",
    );

    // Create a copy of the current selectedOptions array
    const updatedSelectedOptions = [...selectedOptions];

    console.log("switchElement:", switchElement);

    e.stopPropagation();

    if (
      draggedElement !== switchElement &&
      switchElement.classList.contains("match-text") &&
      switchElement.lastChild
    ) {
      // draggedElement.innerHTML = switchElement.innerHTML;
      if (
        switchElement.lastChild &&
        switchElement.lastChild.nodeType === Node.TEXT_NODE &&
        draggedElementText
      ) {
        draggedElementText.innerText = switchElement.lastChild.nodeValue ?? "";
      }

      // console.log("draggedElement", draggedElement?.innerHTML);
      // console.log(
      //   "dataTransfer, draggedElement.innerHTML:",
      //   e.dataTransfer.getData("text/html"),
      // );

      // switchElement.innerHTML = e.dataTransfer.getData("text/html");
      switchElement.lastChild.nodeValue = e.dataTransfer.getData("text/html");
    }

    // update the new answers
    draggables?.forEach((draggable, index) => {
      // Update the specific question's selectedOptions with userAnswers
      updatedSelectedOptions[currentQuestion - 1][index] = draggable.innerText;

      // Set the state with the updated array
      setSelectedOptions(updatedSelectedOptions);
    });

    console.log("selectedOptions:", selectedOptions);

    e.preventDefault();

    // Animate the item swap
    switchElement.style.opacity = "1";
    if (draggedElement) {
      draggedElement.style.opacity = "1";
    }
    dragBorder.style.borderColor = "transparent";
  };

  /* add drop shadow animation when hovering over rows */
  useEffect(() => {
    const containers = document.querySelectorAll<HTMLElement>(".quiz-row");

    containers.forEach((container) => {
      const switchElement = container.querySelector<HTMLElement>(
        ".multiple-match-answer-choice-holder",
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

    const quizContainer = document.getElementById(quizContainerId);
    const draggables = quizContainer?.querySelectorAll<HTMLElement>(
      ".one-match-answer-choice-holder",
    );

    const updatedSelectedOptions = [...selectedOptions]; // Create a copy of the current selectedOptions array

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

  const answerCorrect = answerCorrectList[currentQuestion - 1];
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
          {matchStatements.map((statement, index) => {
            return (
              <div className="quiz-col my-3.5 flex w-full flex-col gap-4">
                <div className="multiple-match-statement min-w-100 flex w-full flex-wrap items-center justify-center overflow-hidden hyphens-auto rounded-[4px] border border-black bg-sciquelCardBg p-3 text-[18px]">
                  {statement}
                </div>
                <div className="multiple-match-slot h-[50px] rounded-[4px] border bg-gray-200 p-3"></div>
              </div>
            );
          })}
        </div>

        <div
          className="multiple-match-answer-choice-area grid w-full place-items-center gap-2 border-t-[1.75px] pt-6"
          style={{
            gridTemplateColumns: `repeat(${matchStatements.length}, 1fr)`,
            gridTemplateRows: `repeat(${numRows}, auto)`, // Adjust auto to control row height
            borderColor: `${themeColor}`
          }}
        >
          {choices.map((choice, choiceIndex) => (
            <div
              key={choiceIndex}
              className="grid-cell h-full w-full overflow-hidden"
              style={{
                gridColumn: `${(choiceIndex % matchStatements.length) + 1}`,
                gridRow: `${
                  Math.floor(choiceIndex / matchStatements.length) + 1
                }`,
              }}
            >
              <div className="answer-choice-border z-1 box-border flex h-full min-h-[50px] w-full rounded-[4px] border-2 border-dashed border-transparent transition-all">
                <div
                  // className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg pr-3 text-center text-[18px] transition-all "
                  className={`one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-sciquelCardBg text-center text-[18px] transition duration-300 ease-in-out 
                  ${
                    hasAnswered && !answerCorrect[choiceIndex]
                      ? "select-incorrect !bg-sciquelIncorrectBG"
                      : ""
                  }  
                  ${
                    hasAnswered && answerCorrect[choiceIndex]
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
                    hasAnswered && !answerCorrect[choiceIndex]
                      ? "select-incorrect !bg-[#d09191]"
                      : ""
                  }  
                  ${
                    hasAnswered && answerCorrect[choiceIndex]
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

              {/* <div className="answer-option">{choice}</div> */}
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
