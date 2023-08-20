import QuizButtons from "@/components/QuizButtons";
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

export default function TrueFalseQuiz({
  isPreQuiz,
  choices,
  correctAnswer,
  answerExplanation,
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
}: Props) {
  const [selectedOptions, setSelectedOptions] = useState<
    Array<Array<boolean | null>>
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

  const prevCurrentQuestion = useRef<number>(currentQuestion);

  /**
   * For updating the component when the user clicks the previous/next buttons: Sets
   * showAnswerExplanation to the appropriate value for the new current question, and sets the class
   * of the MC selection accordingly
   */
  useEffect(() => {
    const trueFalseQuizSelection = document.querySelector(
      isPreQuiz ? "#prequiz-tf" : "#postquiz-tf",
    );
    const trueFalseContainers = document.querySelectorAll(
      isPreQuiz
        ? "#prequiz-tf .true-false-container"
        : "#postquiz-tf .true-false-container",
    );

    // if the question was previously submitted, update the display showing answers/feedback
    if (trueFalseQuizSelection) {
      if (currentQuestion !== prevCurrentQuestion.current) {
        const hasAnswered = hasAnsweredList[currentQuestion - 1];
        const answerCorrect = answerCorrectList[currentQuestion - 1];

        // Selects or deselects a given T/F box
        const setSelectBoxState = (
          element: HTMLElement | null, // either a selectBoxTrue or selectBoxFalse
          selected: boolean, // true when selecting, false when deselecting
          index: number, // index of given T/F box
        ) => {
          if (element) {
            if (selected) {
              element.classList.add("selected");
              if (!hasAnswered) {
                // user hasn't submitted yet, so leave selected answers as checks
                element.style.backgroundImage = `url('${checkmark.src}')`;
              } else {
                // user has submitted, determine whether the T/F box should display check or x-mark
                element.style.backgroundImage = answerCorrect[index]
                  ? `url('${checkmark.src}')`
                  : `url('${x_mark.src}')`;
              }
            } else {
              element.classList.remove("selected");
              element.style.backgroundImage = "none";
            }
          }
        };

        // Indices of the T/F statements that have not been answered
        const unselectedIndices = selectedOptions[currentQuestion - 1]
          .map((option, index) => {
            if (option === null) {
              return index;
            }
          })
          .filter((index): index is number => index !== undefined);

        // Update the classes for each true/false box for the current question (to update the display)
        trueFalseContainers.forEach((container, index) => {
          const selectBoxTrue =
            container.querySelector<HTMLElement>(".select-box-true");
          const selectBoxFalse =
            container.querySelector<HTMLElement>(".select-box-false");

          if (unselectedIndices.includes(index)) {
            // Remove ".selected" classes if T/F box was originally unselected
            setSelectBoxState(selectBoxFalse, false, index);
            setSelectBoxState(selectBoxTrue, false, index);
          } else {
            // Set ".selected" class to appropriate T/F boxes and update check/x-mark display
            if (selectedOptions[currentQuestion - 1][index]) {
              setSelectBoxState(selectBoxFalse, false, index);
              setSelectBoxState(selectBoxTrue, true, index);
            } else {
              setSelectBoxState(selectBoxTrue, false, index);
              setSelectBoxState(selectBoxFalse, true, index);
            }
          }
        });

        // if the question was previously submitted, update the display showing answers/feedback
        if (hasAnswered && !isPreQuiz) {
          trueFalseQuizSelection.classList.add("pointer-events-none");
          setShowAnswerExplanation(true);
        } else {
          trueFalseQuizSelection.classList.remove("pointer-events-none");
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
  const handleOptionSelect = (
    optionIndex: number,
    trueFalseOption: boolean,
  ) => {
    // console.log("this option # was clicked on:", optionIndex);
    // console.log("this option was clicked on:", trueFalseOption);

    if (hasAnsweredList[currentQuestion - 1]) {
      return; // Prevent selecting an answer if the question has already been submitted
    }

    // the container of the t/f statement that the user has selected an answer choice for
    const trueFalseContainer = document.querySelectorAll(
      isPreQuiz
        ? "#prequiz-tf .true-false-container"
        : "#postquiz-tf .true-false-container",
    )[optionIndex] as HTMLElement;
    const selectBoxTrue = trueFalseContainer.querySelector(
      ".select-box-true",
    ) as HTMLElement;
    const selectBoxFalse = trueFalseContainer.querySelector(
      ".select-box-false",
    ) as HTMLElement;

    // // if true was selected, add .selected to select-box-true and remove it from select-box-false, and vice versa
    if (trueFalseOption) {
      // add .selected to .select-box-true and remove it from .select-box-false
      if (selectBoxFalse.classList.contains("selected")) {
        selectBoxFalse.classList.remove("selected");
        selectBoxFalse.style.backgroundImage = "none";
      }
      selectBoxTrue.classList.add("selected");
      Object.assign(selectBoxTrue.style, {
        backgroundImage: `url('${checkmark.src}')`,
        backgroundSize: "65%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      });
    } else {
      // add .selected to .select-box-true and remove it from .select-box-false
      if (selectBoxTrue.classList.contains("selected")) {
        selectBoxTrue.classList.remove("selected");
        selectBoxTrue.style.backgroundImage = "none";
      }
      selectBoxFalse.classList.add("selected");
      Object.assign(selectBoxFalse.style, {
        backgroundImage: `url('${checkmark.src}')`,
        backgroundSize: "65%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      });
    }

    setSelectedOptions((prevState) => {
      const newSelectedOptions = prevState.map((options, questionIndex) => {
        if (questionIndex === currentQuestion - 1) {
          return options.map((option, index) => {
            if (index === optionIndex) {
              return trueFalseOption;
            }
            return option;
          });
        }
        return options;
      });
      return newSelectedOptions;
    });
  };

  /**
   * Handles the submission of a MC question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswers = selectedOptions[currentQuestion - 1];

    // make sure that user has answered each box, otherwise do nothing
    if (userAnswers.every((answer) => answer !== null)) {
      // for each T/F statement, check if the selected answer is correct
      const answerCorrect: boolean[] = userAnswers.map(
        (userAnswer, index) => userAnswer === (correctAnswer[index] === "true"),
      );

      const updatedAnswerCorrectList = [...answerCorrectList];
      updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

      const updatedHasAnsweredList = [...hasAnsweredList];
      updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

      // set class to lock the TF selection
      const trueFalseQuizSelection = document.querySelector(
        isPreQuiz ? "#prequiz-tf" : "#postquiz-tf",
      );
      if (trueFalseQuizSelection) {
        trueFalseQuizSelection.classList.add("pointer-events-none");
      }

      // give the user points or update their score here ?

      setAnswerCorrectList(updatedAnswerCorrectList);
      setShowAnswerExplanation(true);
      setHasAnsweredList(updatedHasAnsweredList);
    }
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
        className="true-false-selection mb-3 flex flex-col items-start gap-3"
        id={isPreQuiz ? "prequiz-tf" : "postquiz-tf"}
      >
        <div className="true-false-letters mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6 md:mt-0">
          <div className="blankspace flex aspect-[8/1] basis-[80%] items-center justify-between gap-5"></div>
          <div className="true-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            T
          </div>
          <div className="false-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            F
          </div>
        </div>

        {choices.map((option: string, index: number) => (
          <div
            key={`tf-option-${index}`}
            className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6"
          >
            <div className="true-false-statement 3text-base flex aspect-[8/1] basis-[80%] items-center justify-between gap-5 rounded-md border border-black p-4 font-medium md:p-0">
              <p className="p-5">{option}</p>
            </div>

            <div
              id={isPreQuiz ? "prequiz-box" : "postquiz-box"}
              className={`select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-contain bg-[65%] bg-no-repeat transition duration-300 hover:bg-gray-300
              ${
                hasAnswered && answerCorrect?.[index] && selectedOption[index]
                  ? "select-correct-tf bg-sciquelCorrectBG"
                  : ""
              }
              ${
                hasAnswered && !answerCorrect?.[index] && selectedOption[index]
                  ? "select-incorrect-tf bg-sciquelIncorrectBG"
                  : ""
              }`}
              style={{
                backgroundImage: hasAnswered
                  ? selectedOption[index]
                    ? answerCorrect?.[index]
                      ? `url('${checkmark.src}')`
                      : `url('${x_mark.src}')`
                    : "none"
                  : "none",
              }}
              onClick={() => handleOptionSelect(index, true)}
            ></div>

            <div
              id={isPreQuiz ? "prequiz-box" : "postquiz-box"}
              className={`select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-contain bg-[65%] bg-no-repeat transition duration-300 hover:bg-gray-300 ${
                hasAnswered && answerCorrect?.[index] && !selectedOption[index]
                  ? "select-correct-tf bg-sciquelCorrectBG"
                  : ""
              }
              ${
                hasAnswered && !answerCorrect?.[index] && !selectedOption[index]
                  ? "select-incorrect-tf bg-sciquelIncorrectBG"
                  : ""
              }`}
              style={{
                backgroundImage: hasAnswered
                  ? !selectedOption[index]
                    ? answerCorrect?.[index]
                      ? `url('${checkmark.src}')`
                      : `url('${x_mark.src}')`
                    : "none"
                  : "none",
              }}
              onClick={() => handleOptionSelect(index, false)}
            ></div>
          </div>
        ))}
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
