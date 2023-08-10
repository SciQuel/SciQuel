import QuizButtons from "@/components/QuizButtons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import checkmark from "../Quiz/checkmark.png";
import x_mark from "../Quiz/xmark.png";

interface Props {
  isPreQuiz: boolean; // Boolean value that determines if quiz is a pre- or post-quiz
  choices: string[]; // The available choices for the question.
  correctAnswer: string[]; // The correct answer for the question.
  answerExplanation: string[]; // List containing the explanation(s) for the question.
  currentQuestion: number; // The question # the user is looking at.
  totalQuestions: number; // The total number of questions.
  onPrevious: () => void; // The function called when using the previous button.
  onNext: () => void; // The function called when using the next button.
}

export default function MultipleChoiceQuiz({
  isPreQuiz,
  choices,
  correctAnswer,
  answerExplanation,
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>(
    Array(totalQuestions).fill(null),
  );
  const [answerCorrectList, setAnswerCorrectList] = useState<
    (boolean | null)[]
  >(Array(totalQuestions).fill(null));
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false);
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  /**
   * For updating the component when the user clicks the previous/next buttons: Sets
   * showAnswerExplanation to the appropriate value for the new current question, and sets the class
   * of the MC selection accordingly
   */
  useEffect(() => {
    const multChoiceQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-mc" : "#postquiz-mc",
    );

    if (multChoiceQuizSelection) {
      if (currentQuestion !== prevCurrentQuestion.current) {
        const hasAnswered = hasAnsweredList[currentQuestion - 1];

        if (hasAnswered && !isPreQuiz) {
          multChoiceQuizSelection.classList.add("pointer-events-none");
          setShowAnswerExplanation(true);
        } else {
          multChoiceQuizSelection.classList.remove("pointer-events-none");
          setShowAnswerExplanation(false);
        }
      }

      prevCurrentQuestion.current = currentQuestion;
    }
  }, [currentQuestion, isPreQuiz, hasAnsweredList]);

  /**
   * Handles the selection of an answer option (called when user clicks a one of the choices):
   * Updates selectedOptions, the array containing the answers that the user has selected.
   *
   * @param {string} option - The MC option selected by the user.
   */
  const handleOptionSelect = (option: string) => {
    console.log("this option was clicked on:", option);

    if (hasAnsweredList[currentQuestion - 1]) {
      console.log(
        "this is hasAnsweredList:",
        hasAnsweredList[currentQuestion - 1],
      );
      return; // Prevent selecting an answer if the question has already been submitted
    }

    setSelectedOptions((prevState) => {
      const newSelectedOptions = [...prevState];
      newSelectedOptions[currentQuestion - 1] =
        newSelectedOptions[currentQuestion - 1] === option
          ? null // if the user clicks on the option clicked on previously, unselect it
          : option; // otherwise, select the option that was clicked
      return newSelectedOptions;
    });
  };

  /**
   * Handles the submission of a MC question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswer = selectedOptions[currentQuestion - 1];

    if (userAnswer === null) {
      return;
    }

    const answerCorrect =
      selectedOptions[currentQuestion - 1] === correctAnswer[0];

    const updatedAnswerCorrectList = [...answerCorrectList];
    updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

    const updatedHasAnsweredList = [...hasAnsweredList];
    updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

    // set class to lock the MC selection
    const multChoiceQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-mc" : "#postquiz-mc",
    );

    if (multChoiceQuizSelection) {
      multChoiceQuizSelection.classList.add("pointer-events-none");
    }

    // give the user points or update their score here ?

    setAnswerCorrectList(updatedAnswerCorrectList);
    setShowAnswerExplanation(true);
    setHasAnsweredList(updatedHasAnsweredList);
  };

  /** Handles the previous button of a MC question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious();
  };

  /** Handles the next button of a MC question (called when user clicks "Next" button). */
  const handleNext = () => {
    // call quiz's handle previous function to go forward a question
    onNext();
  };

  const selectedOption = selectedOptions[currentQuestion - 1];
  const answerCorrect = answerCorrectList[currentQuestion - 1];
  const hasAnswered = hasAnsweredList[currentQuestion - 1];

  // boolean values to determine which buttons to show, based on whether quiz is prequiz or not
  const showPreviousButton = currentQuestion > 1;
  const showNextButton =
    (currentQuestion < totalQuestions && isPreQuiz) ||
    (currentQuestion < totalQuestions && hasAnswered);
  const showSubmitButton = !showAnswerExplanation && !isPreQuiz;

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className="multiple-choice-selection flex flex-col items-start"
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
              hasAnswered && answerCorrect && selectedOption === option
                ? "select-correct bg-sciquelCorrectBG"
                : ""
            }
            ${
              hasAnswered && !answerCorrect && selectedOption === option
                ? "select-incorrect bg-sciquelIncorrectBG"
                : ""
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
            {hasAnswered &&
              selectedOption === option &&
              (answerCorrect ? (
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

      {showAnswerExplanation && (
        <div className="answer-explanation-container flex flex-col">
          {answerCorrect ? (
            <div className="answer-explanation correct font-quicksand my-4 box-border w-full border-l-8 border-sciquelCorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelCorrectText md:text-lg">
              Correct. {answerExplanation}
              <div className="user-quiz-statistics ml-auto mt-4 w-full text-right text-xs leading-normal text-gray-600">
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </div>
            </div>
          ) : (
            <div className="answer-explanation incorrect font-quicksand my-4 box-border w-full border-l-8 border-sciquelIncorrectBG p-5 pl-8 text-base font-medium leading-7 text-sciquelIncorrectText md:text-lg">
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
