import { useQuizContext } from "@/components/Quiz/oldFile/QuizContext";
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
  correctAnswer: string[]; // The correct answer for the question.
  answerExplanation: string[]; // List containing the explanation(s) for the question.
  currentQuestion: number; // The question # the user is looking at.
  totalQuestions: number; // The total number of questions.
  storedUserAnswersList:
    | (string | null)[]
    | (boolean | null)[][]
    | string[][]
    | string[][][];
  onPrevious: (
    userAnswersList:
      | (string | null)[]
      | (boolean | null)[][]
      | string[][]
      | string[][][],
  ) => void; // The function called when using the previous button.
  onNext: (
    userAnswersList:
      | (string | null)[]
      | (boolean | null)[][]
      | string[][]
      | string[][][],
  ) => void; // The function called when using the next button.
  toQuizResultsScreen: (
    preQuizResults: boolean[],
    postQuizResults: boolean[],
  ) => void; // The function called when using the next button after the final question.
  quizComplete: boolean;
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
  storedUserAnswersList,
  onPrevious,
  onNext,
  toQuizResultsScreen,
  quizComplete,
}: Props) {
  /* component state variables */
  const [isTouchDevice, setIsTouchDevice] = useState(false); // whether the user is using a touch(mobile) device or not
  // const initialUserAnswers: string[][] = Array.from(
  //   { length: totalQuestions },
  //   () => [],
  // );

  const initialUserAnswers =
    storedUserAnswersList.length === 0
      ? Array.from({ length: totalQuestions }, () => [])
      : (storedUserAnswersList as string[][]);
  const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers); // stores the user's answers (for ea/ question)
  const { solutionList, setSolutionList } = useQuizContext();

  // const initialAnswerCorrectList =
  //   storedAnswerCorrectList.length === 0
  //     ? Array.from({ length: totalQuestions }, () =>
  //         Array.from({ length: choices.length }, () => null),
  //       )
  //     : (storedAnswerCorrectList as (boolean | null)[][]);
  // const [answerCorrectList, setAnswerCorrectList] = useState(
  //   initialAnswerCorrectList,
  // ); // an array of booleans arrays to store results for ea/ statement (for ea/ question)

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<Array<boolean | null>>
  >(
    Array.from({ length: totalQuestions }, () =>
      Array.from({ length: choices.length }, () => null),
    ),
  ); // an array of booleans arrays to store results for ea/ statement (for ea/ question)
  const [questionResultList, setQuestionResultList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );
  const { preQuizAnswers, setPreQuizAnswers } = useQuizContext();

  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false); // determines if explanations should be shown
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  ); // an array of booleans to store whether user has submitted (for each question)
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(
    null,
  ); // the element user is in process of dragging (null when not dragging)

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  /**
   * Finds/returns the nearest ancestor of an element with a given class.
   *
   * @param {HTMLElement} target - The starting/child element to find the ancestor of.
   * @param {string} targetClass - The class of the ancestor element to find.
   */
  const getTargetParent = (target: HTMLElement, targetClass: string) => {
    // Get the nearest targetClass parent
    const targetParent = target.closest(targetClass) as HTMLElement;
    if (!targetParent) {
      return null;
    }
    return targetParent;
  };

  /**
   * Called when the user tries to drag a draggable item (answer choice). Sets the draggedElement
   * state variable appropriately and handles the drag animation (for non-mobile devices).
   *
   * @param {React.DragEventHandler<HTMLDivElement>} e - The drag event.
   */
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

  /** Handles the visual changes when the user stops dragging (for non-mobile devices). */
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

  /**
   * Called when user drops a match option (for non-mobile/touch devices).
   *
   * @param {React.DragEventHandler<HTMLDivElement>} e - The drag(drop) event.
   */
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

  /**
   * Called when user taps a match option (for mobile/touch device only). Performs same actions as a
   * drag if draggedElement is not set, otherwise performs the same actions as a drop if
   * draggedElement is already set.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - The tap(click) event.
   */
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // const isTouchDevice = "ontouchstart" in window;
    // if (!isTouchDevice && !window.matchMedia("(max-width: 768px)").matches) {
    if (!isTouchDevice) {
      return; //  if not a mobile/touch device, do nothing
    }
    const tapTarget = e.target as HTMLElement;
    const dragBorder = getTargetParent(tapTarget, ".answer-choice-border");

    // if we are not already in process of selecting/moving match statements
    if (!draggedElement) {
      console.log("we are selecting");

      if (!dragBorder) {
        console.log("dragBorder doesn't exist");
        return;
      }
      setDraggedElement(dragBorder);
    } else {
      // draggedElement has been set, so we are dropping (not selecting)
      console.log("we are dropping");

      const quizRowParent = getTargetParent(tapTarget, ".quiz-row");
      if (quizRowParent) {
        handleSwitch(e, quizRowParent);
      }
      setDraggedElement(null);
    }
  };

  /**
   * Handles the logic behind switching options after dropping/tapping onto another match option.
   *
   * @param {React.DragEventHandler<HTMLDivElement> | React.MouseEvent<HTMLDivElement>} e - The
   *        drag(drop) OR tap(click) event.
   */
  const handleSwitch = (
    e:
      | React.DragEventHandler<HTMLDivElement>
      | React.MouseEvent<HTMLDivElement>,
    quizRowParent: HTMLElement,
  ) => {
    if (quizComplete || hasAnsweredList[currentQuestion - 1]) {
      return;
    }
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
      if (isPreQuiz && !quizComplete) {
        setPreQuizAnswers(updatedUserAnswersList);
      }
    }
  };

  /** Add drop shadow animation when hovering over rows. */
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
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
   * For updating the component when the user clicks the previous/next buttons: Sets
   * showAnswerExplanation to the appropriate value for the new current question, and sets the class
   * of the OM selection accordingly (to lock/unlock pointer events).
   */
  useEffect(() => {
    const userAnswers =
      storedUserAnswersList.length === 0
        ? userAnswersList[currentQuestion - 1]
        : (storedUserAnswersList as string[][])[currentQuestion - 1];

    console.log("storedUserAnswersList (PARENT)", storedUserAnswersList);
    // const updatedUserAnswersList = [...userAnswersList];
    // const userAnswers = userAnswersList[currentQuestion - 1];

    if (!userAnswers.length) {
      // Initialize the array if it's not already initialized / if user hasn't touched answers
      const updatedUserAnswersList = [...userAnswersList];
      updatedUserAnswersList[currentQuestion - 1] = choices;
      console.log("updatedUserAnswersList", updatedUserAnswersList);
      setUserAnswersList(updatedUserAnswersList);
      if (isPreQuiz && !quizComplete) {
        setPreQuizAnswers(updatedUserAnswersList);
      }
    }

    // Initialize the list of solutions
    if (!solutionList) {
      setSolutionList(
        Array.from({ length: totalQuestions }, () => [] as string[]),
      );
    }

    console.log("userAnswersList:", userAnswersList);

    if (currentQuestion !== prevCurrentQuestion.current) {
      const hasAnswered = hasAnsweredList[currentQuestion - 1];

      if ((hasAnswered || quizComplete) && !isPreQuiz) {
        setShowAnswerExplanation(true);
      } else {
        setShowAnswerExplanation(false);
      }
    }

    prevCurrentQuestion.current = currentQuestion;
  }, [currentQuestion, isPreQuiz]);

  /**
   * Handles the submission of an OM question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswers = userAnswersList[currentQuestion - 1];

    console.log("userAnswers (SUBMITTING)", userAnswers);

    if (solutionList) {
      const updatedSolutionList = [...solutionList]; // Create a copy of the array
      updatedSolutionList[currentQuestion - 1] = correctAnswer;
      setSolutionList(updatedSolutionList);
    }

    // for each statement, check if the selected answer is correct
    const answerCorrect: boolean[] = userAnswers.map(
      (userAnswer, index) => userAnswer === correctAnswer[index],
    );
    const questionResult = answerCorrect.every((isCorrect) => isCorrect);

    const updatedAnswerCorrectList = [...answerCorrectList];
    updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

    const updatedQuestionResultList = [...questionResultList];
    updatedQuestionResultList[currentQuestion - 1] = questionResult; // save the overall result for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    // set class to lock the OM selection
    // const oneMatchQuizSelection = document.querySelector(
    //   isPreQuiz ? "#prequiz-om" : "#postquiz-om",
    // );
    // if (oneMatchQuizSelection) {
    //   oneMatchQuizSelection.classList.add("pointer-events-none");
    // }

    // give the user points or update their score here ?

    setAnswerCorrectList(updatedAnswerCorrectList);
    setQuestionResultList(updatedQuestionResultList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  /** Handles the previous button of a OM question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious(userAnswersList);
    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(userAnswersList);
    }
  };

  /** Handles the next button of an OM question (called when user clicks "Next" button). */
  const handleNext = () => {
    if (currentQuestion == totalQuestions) {
      // get results from prequiz?
      // const preQuizResults = [true, false, false];
      const preQuizResults = generateQuizResults(preQuizAnswers); // take preQuizAnswers and grade them -- call the grade function
      console.log("preQuizResults:", preQuizResults);
      toQuizResultsScreen(preQuizResults, questionResultList);
    } else {
      // call quiz's handle next function to go forward a question
      onNext(userAnswersList);
      if (isPreQuiz && !quizComplete) {
        setPreQuizAnswers(userAnswersList);
      }
    }

    console.log("solutionList", solutionList);
  };

  const generateQuizResults = (answersList: string[][]) => {
    console.log("generating preQuiz results, answerList:", answersList);
    if (answersList == null) {
      return Array.from({ length: totalQuestions }, () => false);
    }
    const quizResults = answersList.map((userAnswers, index) => {
      if (userAnswers == null || userAnswers.length === 0) {
        console.log("null or empty:", userAnswers);
        return false; // Handle the case where userAnswers is null or empty.
      }
      console.log("userAnswers:", userAnswers);
      const questionResult = getQuestionResult(index, userAnswers);
      console.log("questionResult:", questionResult);
      return questionResult;
    });

    console.log("quizResults:", quizResults);

    return quizResults;
  };

  /**
   * Returns whether a particular match option was submitted under the correct statement.
   *
   * @param {number} index - The index of the statement we are checking.
   * @param {string[]} userAnswers - The user's answers for the question.
   */
  const matchOptionCorrect = (
    questionNumber: number,
    index: number,
    userAnswers: string[],
  ) => {
    // if (userAnswers[index] === correctAnswer[index]) {
    if (userAnswers[index] === solutionList[questionNumber][index]) {
      return true;
    }
    return false;
  };

  const getQuestionResult = (questionNumber: number, userAnswers: string[]) => {
    const questionResult = userAnswers.every((_, index) => {
      console.log("userAnswers[index]", userAnswers[index]);
      console.log(
        "userAnswers[index] === correctAnswer[index]",
        userAnswers[index] === correctAnswer[index],
      );

      if (!matchOptionCorrect(questionNumber, index, userAnswers)) {
        // console.log("userAnswers FALSE:", userAnswers);
        return false; // Return false if any answer is incorrect.
      }
      // console.log("userAnswers TRUE:", userAnswers);
      return true;
    });
    console.log("questionResult", questionResult);
    return questionResult;
  };

  // const userAnswers = userAnswersList[currentQuestion - 1]; // user's answers for current question's (string array)
  const userAnswers = userAnswersList[currentQuestion - 1]; // user's answers for current question's (string array)
  const answerCorrect = answerCorrectList[currentQuestion - 1]; // for ea/ statement, if current question was answered correctly or not (bool array)
  const hasAnswered = hasAnsweredList[currentQuestion - 1]; // if current question has been submitted or not
  const questionResult = questionResultList[currentQuestion - 1];

  // boolean values to determine which buttons to show, based on whether quiz is prequiz or not
  const showPreviousButton = currentQuestion > 1;
  const showNextButton =
    (!isPreQuiz && quizComplete) ||
    (currentQuestion < totalQuestions && isPreQuiz) ||
    (currentQuestion <= totalQuestions && hasAnswered);
  const showSubmitButton =
    !showAnswerExplanation && !isPreQuiz && !quizComplete;
  const showFeedback =
    hasAnswered ||
    (!isPreQuiz && quizComplete) ||
    (isPreQuiz &&
      preQuizAnswers &&
      preQuizAnswers[currentQuestion - 1] &&
      preQuizAnswers[currentQuestion - 1].length > 0 &&
      quizComplete);
  let shortenMatchLine = false;

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className={`one-match-selection mb-[20px] flex flex-col items-start ${
          hasAnswered || quizComplete ? "pointer-events-none" : ""
        }`}
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
                className={`one-match-answer-option min-w-100 flex w-[40%] flex-wrap items-center justify-center rounded-[4px] border border-black bg-white p-3`}
              >
                <p className="match-statement-text w-full break-words text-center text-[18px]">
                  {statement}
                </p>
              </div>
              <div
                className={`line z-10 h-[2px] ${widthClass} self-center transition duration-300 ease-in-out`}
                style={{
                  backgroundColor: themeColor,
                  ...(showFeedback &&
                  !matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                    ? {
                        backgroundColor: "#d06363",
                      }
                    : {}),
                  ...(showFeedback &&
                  matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                    ? {
                        backgroundColor: "#437e64",
                      }
                    : {}),
                }}
              />
              <div className="answer-choice-border z-1 box-border flex w-1/2 rounded-[4px] border-2 border-dashed border-transparent transition-all">
                <div
                  // className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white pr-3 text-center text-[18px] transition-all "
                  className={`one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white pr-3 text-center text-[18px] transition transition-all duration-300 ease-in-out 
                  ${
                    isTouchDevice &&
                    !showFeedback &&
                    userAnswers[index] ===
                      draggedElement?.querySelector<HTMLElement>(".match-text")
                        ?.lastChild?.textContent
                      ? "selected !bg-gray-200"
                      : ""
                  }  
                  ${
                    // hasAnswered && !answerCorrect[index]
                    showFeedback &&
                    !matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                      ? "select-incorrect !cursor-default !bg-sciquelIncorrectBG"
                      : ""
                  }  
                  ${
                    // hasAnswered && answerCorrect[index]
                    showFeedback &&
                    matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                      ? "select-correct !cursor-default !bg-sciquelCorrectBG"
                      : ""
                  }`}
                  draggable="true"
                  onDragStart={handleDragStart}
                  onClick={handleTap}
                  onDragEnd={handleDragEnd}
                >
                  {/* <div className="image-holder mr-3 flex h-full w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-3"> */}
                  <div
                    //   className={`image-holder mr-3 flex h-full w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-3 transition duration-300 ease-in-out
                    //   ${hasAnswered ? "!bg-transparent" : ""}
                    // `}
                    className={`image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out                   
                    ${
                      isTouchDevice &&
                      !showFeedback &&
                      userAnswers[index] ===
                        draggedElement?.querySelector<HTMLElement>(
                          ".match-text",
                        )?.lastChild?.textContent
                        ? "selected !bg-[#c2bed0]"
                        : ""
                    }
                    ${
                      // hasAnswered && !answerCorrect[index]
                      showFeedback &&
                      !matchOptionCorrect(
                        currentQuestion - 1,
                        index,
                        userAnswers,
                      )
                        ? "select-incorrect !bg-[#E29899]"
                        : ""
                    }  
                  ${
                    // hasAnswered && answerCorrect[index]
                    showFeedback &&
                    matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                      ? "select-correct !bg-[#A0C99C]"
                      : ""
                  }`}
                  >
                    {!showFeedback && (
                      <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                        <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      </span>
                    )}

                    {showFeedback &&
                      (matchOptionCorrect(
                        currentQuestion - 1,
                        index,
                        userAnswers,
                      ) ? (
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

      {((quizComplete && showFeedback) || showAnswerExplanation) && (
        <div className="answer-explanation-container-tf flex w-full flex-col">
          <ul className="explanation-list w-full list-none p-0">
            {matchStatements.map((_, index: number) => (
              <li
                className={
                  matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                    ? "answer-explanation-tf correct font-quicksand my-1 box-border w-full border-l-8 border-sciquelCorrectBG p-4 pl-8 text-[18px] font-medium leading-6  text-sciquelCorrectText"
                    : "answer-explanation-tf incorrect font-quicksand my-1 box-border w-full border-l-8 border-sciquelIncorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelIncorrectText"
                }
                key={index}
              >
                {matchOptionCorrect(currentQuestion - 1, index, userAnswers)
                  ? "Correct. "
                  : "Incorrect. "}
                {answerExplanation[index]}
              </li>
            ))}
          </ul>

          <div
            className="user-quiz-statistics  ml-auto mt-4 w-full text-right text-[14px] leading-normal text-gray-600"
            style={{ marginLeft: "auto" }}
          >
            {getQuestionResult(currentQuestion - 1, userAnswers)
              ? "You and 87.6% of SciQuel readers answered this question correctly. Great job!"
              : "87.6% of SciQuel readers answered this question correctly."}
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
