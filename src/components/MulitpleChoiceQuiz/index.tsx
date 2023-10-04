import { useQuizContext } from "@/components/Quiz/QuizContext";
import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import checkmark from "../Quiz/checkmark.png";
import x_mark from "../Quiz/xmark.png";

interface Props {
  isPreQuiz: boolean; // Boolean value that determines if quiz is a pre- or post-quiz
  choices: string[]; // The available MC choices for the question.
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

export default function MultipleChoiceQuiz({
  isPreQuiz,
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
  const { preQuizAnswers, setPreQuizAnswers } = useQuizContext();
  const { solutionList, setSolutionList } = useQuizContext();

  // const initialUserAnswers =
  //   storedUserAnswersList.length === 0
  //     ? Array.from({ length: totalQuestions }, () => [])
  //     : (storedUserAnswersList as (string | null)[]);
  // // const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers); // stores the user's answers (for ea/ question)

  // const [userAnswersList, setUserAnswersList] = useState<(string | null)[]>(
  //   Array(totalQuestions).fill(null),
  // ); // an array of strings to store the user's selected MC choice (for each question)

  const [userAnswersList, setUserAnswersList] = useState<(string | null)[]>(
    storedUserAnswersList.length === 0
      ? Array(totalQuestions).fill(null)
      : (storedUserAnswersList as (string | null)[]),
  );

  const [answerCorrectList, setAnswerCorrectList] = useState<
    (boolean | null)[]
  >(Array(totalQuestions).fill(null)); // an array of booleans to store answer results (for each question)
  const [questionResultList, setQuestionResultList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false); // determines if explanation should be shown
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  ); // an array of booleans to store whether user has submitted (for each question)

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  /**
   * For updating the component when the user clicks the previous/next buttons: Sets
   * showAnswerExplanation to the appropriate value for the new current question, and sets the class
   * of the MC selection accordingly (to allow/prevent pointer events)
   */
  useEffect(() => {
    // Initialize the list of solutions
    if (!solutionList) {
      setSolutionList(
        Array.from({ length: totalQuestions }, () => [] as string[]),
      );
    }

    if (currentQuestion !== prevCurrentQuestion.current) {
      const hasAnswered = hasAnsweredList[currentQuestion - 1];
      if (hasAnswered && !isPreQuiz) {
        setShowAnswerExplanation(true);
      } else {
        setShowAnswerExplanation(false);
      }
    }
    prevCurrentQuestion.current = currentQuestion;
  }, [currentQuestion, isPreQuiz, hasAnsweredList]);

  /**
   * Handles the selection of an answer option (called when the user clicks one of the choices):
   * Updates userAnswersList, the array containing the answers that the user has selected.
   *
   * @param {string} option - The MC option selected by the user.
   */
  const handleOptionSelect = (option: string) => {
    const updatedUserAnswersList = [...userAnswersList]; // Create a copy of the current userAnswersList

    updatedUserAnswersList[currentQuestion - 1] =
      updatedUserAnswersList[currentQuestion - 1] === option
        ? null // if the user clicks on the option clicked on previously, unselect it
        : option; // otherwise, select the option that was clicked

    setUserAnswersList(updatedUserAnswersList); // Update the state

    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(updatedUserAnswersList);
    }
  };

  /**
   * Handles the submission of a MC question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswer = userAnswersList[currentQuestion - 1];
    if (userAnswer === null) {
      return; // prevent user from submitting without selecting an answer
    }

    if (solutionList) {
      const updatedSolutionList = [...solutionList]; // Create a copy of the array
      updatedSolutionList[currentQuestion - 1] = correctAnswer;
      setSolutionList(updatedSolutionList);
    }

    const answerCorrect =
      userAnswersList[currentQuestion - 1] === correctAnswer[0];
    const updatedAnswerCorrectList = [...answerCorrectList];
    updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

    const updatedQuestionResultList = [...questionResultList];
    updatedQuestionResultList[currentQuestion - 1] = answerCorrect; // save the overall result for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    setAnswerCorrectList(updatedAnswerCorrectList);
    setQuestionResultList(updatedQuestionResultList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  /** Handles the previous button of a MC question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious(userAnswersList);
    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(userAnswersList);
    }
  };

  /** Handles the next button of a MC question (called when user clicks "Next" button). */
  const handleNext = () => {
    // call quiz's handle previous function to go forward a question
    // onNext(userAnswersList);

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
  };

  const choiceCorrect = (questionNumber: number, userAnswer: string) => {
    const result = userAnswer === (solutionList as string[])[questionNumber][0];
    return result;
  };

  const generateQuizResults = (answersList: (string | null)[]) => {
    console.log("generating preQuiz results, answerList:", answersList);
    if (answersList == null) {
      return Array.from({ length: totalQuestions }, () => false);
    }
    const quizResults = answersList.map((userAnswer, index) => {
      if (userAnswer == null || userAnswer.length === 0) {
        console.log("null or empty:", userAnswer);
        return false; // Handle the case where userAnswers is null or empty.
      }
      if (choiceCorrect(index, userAnswer)) {
        return true;
      }
      return false;
    });

    console.log("quizResults:", quizResults);

    return quizResults;
  };

  const selectedOption = userAnswersList[currentQuestion - 1]; // current question's selected MC option (a string)
  const answerCorrect = answerCorrectList[currentQuestion - 1]; // current question's result (boolean. null if not submitted)
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

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className={`multiple-choice-selection flex flex-col items-start ${
          hasAnswered || quizComplete ? "pointer-events-none" : ""
        }`}
        id={isPreQuiz ? "prequiz-mc" : "postquiz-mc"}
      >
        {choices.map((option, index) => (
          <div
            key={index}
            className={`multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-7 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200 ${
              selectedOption === option
                ? "selected bg-gray-300 hover:bg-gray-300"
                : ""
            } ${
              showFeedback &&
              selectedOption &&
              choiceCorrect(currentQuestion - 1, selectedOption) &&
              selectedOption === option
                ? "select-correct bg-sciquelCorrectBG"
                : ""
            }
            ${
              showFeedback &&
              selectedOption &&
              !choiceCorrect(currentQuestion - 1, selectedOption) &&
              selectedOption === option
                ? "select-incorrect bg-sciquelIncorrectBG"
                : ""
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
            {showFeedback &&
              selectedOption &&
              selectedOption === option &&
              (choiceCorrect(currentQuestion - 1, selectedOption) ? (
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
        ))}
      </div>

      {((quizComplete && showFeedback) || showAnswerExplanation) &&
        selectedOption && (
          <div className="answer-explanation-container flex flex-col">
            {choiceCorrect(currentQuestion - 1, selectedOption) ? (
              <div className="answer-explanation correct font-quicksand my-4 box-border w-full border-l-8 border-sciquelCorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelCorrectText md-qz:text-lg">
                Correct. {answerExplanation}
                <div className="user-quiz-statistics ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
                  You and 87.6% of SciQuel readers answered this question
                  correctly. Great job!
                </div>
              </div>
            ) : (
              <div className="answer-explanation incorrect font-quicksand my-4 box-border w-full border-l-8 border-sciquelIncorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelIncorrectText md-qz:text-lg">
                Incorrect. {answerExplanation}
                <div className="user-quiz-statistics ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
                  87.6% of SciQuel readers answered this question correctly.
                </div>
              </div>
            )}
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
