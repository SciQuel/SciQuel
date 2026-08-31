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
  correctAnswerMap: Map<string, string[]>; // The correct answers for the question. (key:statement, value:array of correct choices)
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

export default function MultipleMatchQuiz({
  isPreQuiz,
  themeColor,
  matchStatements,
  choices,
  correctAnswerMap,
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
  const { preQuizAnswers, setPreQuizAnswers } = useQuizContext();
  const { solutionList, setSolutionList } = useQuizContext();
  const [isTouchDevice, setIsTouchDevice] = useState(false); // whether the user is using a touch(mobile) device or not
  const initialSubmittedAnswers: Record<string, string[]>[] = new Array<
    Record<string, string[]>
  >(totalQuestions).fill({});
  const [submittedAnswersList, setSubmittedAnswersList] = useState(
    initialSubmittedAnswers,
  ); // stores the answers the user has submitted (key:statement, value:array of submitted choices) for ea/ question

  const initialUserAnswers: string[][][] =
    storedUserAnswersList.length === 0
      ? new Array(totalQuestions).fill(null).map(() => new Array<string[]>())
      : (storedUserAnswersList as string[][][]);
  const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers);

  // const initialUserAnswers: string[][][] = new Array(totalQuestions)
  //   .fill(null)
  //   .map(() => new Array<string[]>());
  // const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers); // the user's answers for ea/ statement for ea/ question

  const initialAnswerChoicesList: string[][] = Array.from(
    { length: totalQuestions },
    () => [],
  );
  const [answerChoicesList, setAnswerChoicesList] = useState(
    initialAnswerChoicesList,
  ); // the user's available choices for ea/ question

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<boolean | null>
  >(Array.from({ length: totalQuestions }, () => null)); // an array of booleans to store overall results (for each question)

  const [questionResultList, setQuestionResultList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );

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
      return null; // no ancestor w/ such class exists
    }
    return targetParent;
  };

  /**
   * Called when the user tries to drag a draggable item (answer choice). Sets the draggedElement
   * state variable appropriately and handles the drag animation (for non-mobile/touch devices).
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

  /**
   * Called when match option is tapped (for mobile only, in place of drag/drop). Performs same
   * actions as a drag if draggedElement is not set, otherwise performs the same actions as a drop
   * if draggedElement is already set.
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

  /** Handles the visual changes when the user stops dragging (for non-mobile/touch devices). */
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
   * Called when match option is dropped onto an answer slot (in column) (for non-mobile/touch
   * devices).
   *
   * @param {React.DragEventHandler<HTMLDivElement>} e - The drag(drop) event.
   */
  const handleColDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const dropTarget = e.target as HTMLElement;
    const quizColParent = getTargetParent(dropTarget, ".quiz-col");
    if (!quizColParent) {
      return;
    }
    handleColDropOrTap(e, quizColParent);
  };

  /** Enables drop over the answer choice area. */
  const handleAnswerChoiceAreaDragOver = (
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
  };

  /**
   * Handles the logic behind dropping/tapping a match option into a column.
   *
   * @param {React.DragEventHandler<HTMLDivElement> | React.MouseEvent<HTMLDivElement>} e - The
   *        drag(drop) OR tap(click) event.
   * @param {HTMLElement} quizColParent - The column being dropped/tapped into.
   */
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
        if (isPreQuiz && !quizComplete) {
          setPreQuizAnswers(updatedUserAnswersList);
        }

        updatedAnswerChoicesList[currentQuestion - 1] = currAnswerChoices;
        console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
        setAnswerChoicesList(updatedAnswerChoicesList);
      }
    }
  };

  /**
   * Handles the logic behind dropping/tapping an answer into the answer choice area.
   *
   * @param {React.DragEventHandler<HTMLDivElement> | React.MouseEvent<HTMLDivElement>} e - The
   *        drag(drop) OR tap(click) event.
   */
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
          if (isPreQuiz && !quizComplete) {
            setPreQuizAnswers(updatedUserAnswersList);
          }

          updatedAnswerChoicesList[currentQuestion - 1] = currAnswerChoices;
          console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
          setAnswerChoicesList(updatedAnswerChoicesList);
        }
      }
    }
  };

  /**
   * Called when match option is dropped onto the answer choice area (for non-mobile/touch devices).
   *
   * @param {React.DragEventHandler<HTMLDivElement>} e - The drag(drop) event.
   */
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

  /** Adds animation when hovering over droppable items. */
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window);
    const emptySlots = document.querySelectorAll<HTMLElement>(
      ".multiple-match-slot",
    );

    emptySlots.forEach((emptySlot) => {
      emptySlot.addEventListener("dragover", (e) => {
        e.preventDefault();
        emptySlot?.classList.add("!bg-gray-300");
      });

      emptySlot.addEventListener("dragleave", () => {
        emptySlot?.classList.remove("!bg-gray-300");
      });

      emptySlot.addEventListener("drop", () => {
        emptySlot?.classList.remove("!bg-gray-300");
      });

      emptySlot.addEventListener("dragenter", (e) => {
        e.preventDefault();
      });
    });
  }, []);

  /**
   * For updating the component when the user clicks the previous/next buttons: Sets
   * showAnswerExplanation to the appropriate value for the new current question.
   */
  useEffect(() => {
    const updatedAnswerChoicesList = [...answerChoicesList];

    const userAnswers =
      storedUserAnswersList.length === 0
        ? userAnswersList[currentQuestion - 1]
        : (storedUserAnswersList as string[][][])[currentQuestion - 1];

    console.log("storedUserAnswersList (PARENT)", storedUserAnswersList);
    console.log("answerChoicesList:", answerChoicesList);
    console.log("solutionList", solutionList);
    console.log("submittedAnswersList", submittedAnswersList);
    // const updatedUserAnswersList = [...userAnswersList];
    // const userAnswers = userAnswersList[currentQuestion - 1];

    // if (!userAnswers.length) {
    //   // Initialize the array if it's not already initialized / if user hasn't touched answers
    //   const updatedUserAnswersList = [...userAnswersList];
    //   updatedUserAnswersList[currentQuestion - 1] = choices;
    //   console.log("updatedUserAnswersList", updatedUserAnswersList);
    //   setUserAnswersList(updatedUserAnswersList);
    //   if (isPreQuiz && !quizComplete) {
    //     setPreQuizAnswers(updatedUserAnswersList);
    //   }
    // }

    // console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);

    // Initialize the list of solutions
    if (!solutionList) {
      setSolutionList(
        Array.from(
          { length: totalQuestions },
          () => new Map<string, string[]>(),
        ),
      );
    }

    // if (
    //   !userAnswers[currentQuestion - 1] &&
    //   !updatedAnswerChoicesList[currentQuestion - 1].length
    // ) {
    // if (!userAnswers || !updatedAnswerChoicesList[currentQuestion - 1].length) {
    if (
      (!userAnswers || !userAnswers.length) &&
      !updatedAnswerChoicesList[currentQuestion - 1].length
    ) {
      // Initialize the array if it's not already initialized AND if user hasn't touched answers
      updatedAnswerChoicesList[currentQuestion - 1] = choices;
      console.log("updatedAnswerChoicesList", updatedAnswerChoicesList);
      setAnswerChoicesList(updatedAnswerChoicesList);
      // if (isPreQuiz && !quizComplete) {
      //   setPreQuizAnswers(updatedAnswerChoicesList);
      // }
    } else if (quizComplete) {
      // set user's previously submitted answers
      const updatedSubmittedAnswersList = [...submittedAnswersList];
      const updatedRecord = userAnswers.map(
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
      // if (isPreQuiz && !quizComplete) {
      //   setPreQuizAnswers(updatedSubmittedAnswersList);
      // }
    }

    if (currentQuestion !== prevCurrentQuestion.current) {
      const hasAnswered = hasAnsweredList[currentQuestion - 1];

      if (hasAnswered && !isPreQuiz) {
        setShowAnswerExplanation(true);
      } else {
        setShowAnswerExplanation(false);
      }

      prevCurrentQuestion.current = currentQuestion;
    }
  }, [currentQuestion, isPreQuiz, hasAnsweredList]);

  /**
   * Handles the submission of an MM question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into a
   * record, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const currUserAnswers = userAnswersList[currentQuestion - 1];
    const updatedSubmittedAnswersList = [...submittedAnswersList];

    if (solutionList) {
      const updatedSolutionList = [...solutionList]; // Create a copy of the array
      updatedSolutionList[currentQuestion - 1] = correctAnswerMap;
      setSolutionList(updatedSolutionList);
    }

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

    // const questionResult = getQuestionResult();
    // console.log("questionResult", questionResult);

    // const updatedQuestionResultList = [...questionResultList];
    // updatedQuestionResultList[currentQuestion - 1] = questionResult; // save the overall result for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    // setAnswerCorrectList(updatedAnswerCorrectList);
    // setQuestionResultList(updatedQuestionResultList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  /**
   * Returns whether the user's submitted answers for a particular statement are all correct (all
   * match options must match the answer key, cannot be missing any, otherwise it'd be marked
   * incorrect).
   *
   * @param {string} statement - The statement we are checking.
   */
  const statementCorrect = (statement: string) => {
    const solutionMap = solutionList[currentQuestion - 1] as Map<
      string,
      string[]
    >;
    const currSubmittedAnswers = submittedAnswersList[currentQuestion - 1];
    const userAnswerArray = currSubmittedAnswers[statement] || [];
    // const correctAnswersForStatement = correctAnswerMap.get(statement) || [];
    const correctAnswersForStatement = solutionMap.get(statement) || [];

    // Sort the user's answer array and the correct answers array
    const sortedUserAnswerArray = userAnswerArray.slice().sort();
    const sortedCorrectAnswersForStatement = correctAnswersForStatement
      .slice()
      .sort();

    // Compare the sorted arrays
    const isCorrect =
      JSON.stringify(sortedUserAnswerArray) ===
      JSON.stringify(sortedCorrectAnswersForStatement);

    console.log("statement", statement);
    console.log("sortedUserAnswerArray", sortedUserAnswerArray);
    console.log(
      "sortedCorrectAnswersForStatement",
      sortedCorrectAnswersForStatement,
    );
    console.log("isCorrect", isCorrect);

    return isCorrect;
  };

  /**
   * Returns whether a particular match option was submitted under the correct statement (for answers submitted into the columns).
   *
   * @param {string} statement - The statement we are checking.
   * @param {string} userAnswer - The submitted match option we are checking.
   */
  const matchOptionCorrect = (statement: string, userAnswer: string) => {
    // const statement = matchStatements[statementIndex];
    const solutionMap = solutionList[currentQuestion - 1] as Map<
      string,
      string[]
    >;
    // const correctAnswersForStatement = correctAnswerMap.get(statement) || [];
    const correctAnswersForStatement = solutionMap.get(statement) || [];

    if (correctAnswersForStatement.includes(userAnswer)) {
      // The target string is included in the array of correct answers for the given match statement
      return true;
    }
    return false;
  };

  /**
   * Returns whether a particular match option unused by the user was part of the answer key (for answers choices left in the answer choice area).
   *
   * @param {string} answerChoice - The match option / answer choice we are checking.
   */
  const answerChoiceExistsInCorrectAnswers = (answerChoice: string) => {
    const solutionMap = solutionList[currentQuestion - 1] as Map<
      string,
      string[]
    >;
    // const correctAnswersArrays = Array.from(correctAnswerMap.values());
    const correctAnswersArrays = Array.from(solutionMap.values());

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
    onPrevious(userAnswersList);
    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(userAnswersList);
    }
  };

  /** Handles the next button of an MM question (called when user clicks "Next" button). */
  const handleNext = () => {
    if (currentQuestion == totalQuestions) {
      // get results from prequiz?
      // const preQuizResults = [true, false, false];
      const preQuizResults = generateQuizResults(preQuizAnswers); // take preQuizAnswers and grade them -- call the grade function
      const postQuizResults = generateQuizResults(userAnswersList); // take preQuizAnswers and grade them -- call the grade function
      console.log("preQuizResults:", preQuizResults);
      toQuizResultsScreen(preQuizResults, postQuizResults);
    } else {
      // call quiz's handle next function to go forward a question
      onNext(userAnswersList);
      if (isPreQuiz && !quizComplete) {
        setPreQuizAnswers(userAnswersList);
      }
    }
  };

  const generateQuizResults = (answersList: string[][][]) => {
    console.log("generating preQuiz results, answerList:", answersList);
    if (answersList == null) {
      return Array.from({ length: totalQuestions }, () => false);
    }
    // grade each question
    const updatedSubmittedAnswersList = [...submittedAnswersList];
    const quizResults = answersList.map((userAnswers, index) => {
      if (userAnswers == null || userAnswers.length === 0) {
        console.log("null or empty:", userAnswers);
        return false; // Handle the case where userAnswers is null or empty.
      }

      if (isPreQuiz) {
        // save user's submitted answers
        // "submit" the prequiz answers
        const updatedRecord = userAnswers.map(
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
      }

      console.log("userAnswers:", userAnswers);
      const questionResult = getQuestionResult();
      console.log("questionResult:", questionResult);
      return questionResult;
    });

    console.log("quizResults:", quizResults);

    return quizResults;
  };

  const getQuestionResult = () => {
    const questionResult = matchStatements.every((statement, _) => {
      if (!statementCorrect(statement)) {
        return false; // Return false if any statement is incorrect.
      }
      return true;
    });
    console.log("questionResult", questionResult);
    return questionResult;
  };

  const answerCorrect = answerCorrectList[currentQuestion - 1]; // if current question was answered fully correctly or not
  const userAnswers = userAnswersList[currentQuestion - 1]; // current question's match options dropped into the columns for ea/ statement (array of string arrays)
  const answerChoices = answerChoicesList[currentQuestion - 1]; // current question's remaining answer options (string array)
  const hasAnswered = hasAnsweredList[currentQuestion - 1]; // if current question has been submitted or not

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

  const numRows = Math.ceil(choices.length / matchStatements.length); // determine # of rows for answer choice area grid

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className={`multiple-match-selection mb-[20px] flex flex-col items-start ${
          hasAnswered || quizComplete ? "pointer-events-none" : ""
        }`}
        id={isPreQuiz ? "prequiz-mm" : "postquiz-mm"}
      >
        <div className="multiple-match-drop-area flex w-full flex-row flex-wrap items-start justify-center gap-3 pb-3">
          {matchStatements.map((statement, statementIndex) => {
            return (
              <div
                className="quiz-col my-3.5 flex h-full w-full shrink basis-[30%] flex-col gap-4 sm-mm:w-[120px] xsm-qz:w-[110px] xsm-mm:w-[100px]"
                onDrop={handleColDrop}
                onClick={handleTap}
                col-index={statementIndex}
                key={statementIndex}
              >
                <div className="multiple-match-statement flex h-full w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-white p-3 text-center text-[18px] xsm-qz:inline-block xsm-mm:text-[16px]">
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
                            className={`multiple-match-answer-choice-holder min-w-100 relative box-border flex h-full w-full cursor-move items-center justify-end break-words rounded-[4px] border border-black bg-white text-center text-[18px] transition duration-300 ease-in-out 
                            ${
                              isTouchDevice &&
                              !showFeedback &&
                              userAnswer ===
                                draggedElement?.querySelector<HTMLElement>(
                                  ".match-text",
                                )?.lastChild?.textContent
                                ? "selected !bg-gray-200"
                                : ""
                            }  
                            ${
                              showFeedback &&
                              !matchOptionCorrect(statement, userAnswer)
                                ? "select-incorrect !bg-sciquelIncorrectBG"
                                : ""
                            }  
                            ${
                              showFeedback &&
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
                                isTouchDevice &&
                                !showFeedback &&
                                userAnswer ===
                                  draggedElement?.querySelector<HTMLElement>(
                                    ".match-text",
                                  )?.lastChild?.textContent
                                  ? "selected !bg-[#c2bed0]"
                                  : ""
                              }
                              ${
                                showFeedback &&
                                !matchOptionCorrect(statement, userAnswer)
                                  ? "select-incorrect !bg-[#E29899]"
                                  : ""
                              }  
                              ${
                                showFeedback &&
                                matchOptionCorrect(statement, userAnswer)
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

                            <div className="match-text align-self-center !inline-block flex w-[72%] max-w-full items-center justify-end justify-self-end hyphens-auto break-words p-3 text-center md-qz:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px]">
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
          className={`multiple-match-answer-choice-area grid w-full place-items-center gap-2 border-t-[1.75px] pt-6 
          ${!showFeedback ? "mb-6 min-h-[80px]" : ""}
          ${isTouchDevice && !showFeedback ? "min-h-[190px]" : ""}
          `}
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
                  className={`multiple-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white text-center text-[18px] transition duration-300 ease-in-out 
                  ${
                    isTouchDevice &&
                    !showFeedback &&
                    choice ===
                      draggedElement?.querySelector<HTMLElement>(".match-text")
                        ?.lastChild?.textContent
                      ? "selected !bg-gray-200"
                      : ""
                  }  
                  ${
                    showFeedback && answerChoiceExistsInCorrectAnswers(choice)
                      ? "select-incorrect !bg-sciquelIncorrectBG"
                      : ""
                  }  
                  ${
                    showFeedback && !answerChoiceExistsInCorrectAnswers(choice)
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
                      isTouchDevice &&
                      !showFeedback &&
                      choice ===
                        draggedElement?.querySelector<HTMLElement>(
                          ".match-text",
                        )?.lastChild?.textContent
                        ? "selected !bg-[#c2bed0]"
                        : ""
                    }
                    ${
                      showFeedback && answerChoiceExistsInCorrectAnswers(choice)
                        ? "select-incorrect !bg-[#E29899]"
                        : ""
                    }  
                    ${
                      showFeedback &&
                      !answerChoiceExistsInCorrectAnswers(choice)
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

      {((quizComplete && showFeedback) || showAnswerExplanation) && (
        <div className="answer-explanation-container-tf flex w-full flex-col">
          <ul className="explanation-list w-full list-none p-0">
            {matchStatements.map((statement, statementIndex) => {
              return (
                <li
                  key={statementIndex}
                  className={
                    statementCorrect(statement)
                      ? "answer-explanation-tf correct font-quicksand my-1 box-border w-full border-l-8 border-sciquelCorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelCorrectText  xsm-mm:text-[16px]"
                      : "answer-explanation-tf incorrect font-quicksand my-1 box-border w-full border-l-8 border-sciquelIncorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelIncorrectText xsm-mm:text-[16px]"
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
            {getQuestionResult() && (
              <>
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </>
            )}
            {!getQuestionResult() && (
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
