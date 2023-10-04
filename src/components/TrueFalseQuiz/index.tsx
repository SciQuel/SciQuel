import { useQuizContext } from "@/components/Quiz/QuizContext";
import QuizButtons from "@/components/QuizButtons";
import React, { useEffect, useRef, useState } from "react";
import checkmark from "../Quiz/checkmark.png";
import x_mark from "../Quiz/xmark.png";

interface Props {
  isPreQuiz: boolean; // Boolean value that determines if quiz is a pre- or post-quiz
  choices: string[]; // The available choices for the question. (the T/F statements)
  correctAnswer: string[]; // The correct answer for each T/F statement. (containing either "true"/"false")
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

export default function TrueFalseQuiz({
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
  //     : (storedUserAnswersList as string[][]);
  // const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers); // stores the user's answers (for ea/ question)

  // const [userAnswersList, setUserAnswersList] = useState<(boolean | null)[][]>(
  //   storedUserAnswersList.length === 0
  //     ? Array.from({ length: totalQuestions }, () => [] as (boolean | null)[])
  //     : (storedUserAnswersList as (boolean | null)[][]),
  // ); // an array of boolean arrays to store the user's selected T/F choices (for ea/ T/F statement, for ea/ question)

  const initialUserAnswers =
    storedUserAnswersList.length === 0
      ? Array.from({ length: totalQuestions }, () => [])
      : (storedUserAnswersList as (boolean | null)[][]);
  const [userAnswersList, setUserAnswersList] = useState(initialUserAnswers); // stores the user's answers (for ea/ question)

  // const [userAnswersList, setUserAnswersList] = useState<
  //   Array<Array<boolean | null>>
  // >(Array.from({ length: totalQuestions }, () => [])); // an array of boolean arrays to store the user's selected T/F choices (for ea/ T/F statement, for ea/ question)

  // const [userAnswersList, setUserAnswersList] = useState<(boolean | null)[][]>(
  //   storedUserAnswersList.length === 0
  //     ? Array(totalQuestions).fill(null)
  //     : (storedUserAnswersList as (boolean | null)[][]),
  // );

  const [answerCorrectList, setAnswerCorrectList] = useState<
    Array<Array<boolean | null>>
  >(Array.from({ length: totalQuestions }, () => [])); // an array of boolean arrays to store answer results (for ea/ T/F statement, for ea/ question)
  const [questionResultList, setQuestionResultList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  );
  const [showAnswerExplanation, setShowAnswerExplanation] = useState(false); // determines if explanations should be shown
  const [hasAnsweredList, setHasAnsweredList] = useState<boolean[]>(
    Array(totalQuestions).fill(false),
  ); // an array of booleans to store whether user has submitted (for each question)
  const prevCurrentQuestion = useRef<number>(currentQuestion);

  /**
   * For updating the component when the user clicks the previous/next buttons: Initializes
   * updatedUserAnswersList and updatedAnswerCorrectList if needed, and locks quiz pointer events if
   * question was previously submitted
   */
  useEffect(() => {
    // const userAnswers = userAnswersList[currentQuestion - 1];
    const userAnswers =
      storedUserAnswersList.length === 0
        ? userAnswersList[currentQuestion - 1]
        : (storedUserAnswersList as (boolean | null)[][])[currentQuestion - 1];
    const answerCorrect = answerCorrectList[currentQuestion - 1];

    console.log("storedUserAnswersList", storedUserAnswersList);
    console.log("solutionList", solutionList);

    if (!userAnswers.length) {
      // Initialize the array for the current question if it's not already initialized
      const updatedUserAnswersList = [...userAnswersList];
      updatedUserAnswersList[currentQuestion - 1] = Array.from(
        { length: choices.length },
        () => null,
      );
      console.log("updatedUserAnswersList", updatedUserAnswersList);
      setUserAnswersList(updatedUserAnswersList);
      if (isPreQuiz && !quizComplete) {
        setPreQuizAnswers(updatedUserAnswersList);
      }
    }

    // Initialize the list of solutions
    if (!solutionList) {
      setSolutionList(
        Array.from({ length: totalQuestions }, () => [] as boolean[]),
      );
    }

    if (!answerCorrect.length) {
      // Initialize the array for the current question if it's not already initialized
      const updatedAnswerCorrectList = [...answerCorrectList];
      updatedAnswerCorrectList[currentQuestion - 1] = Array.from(
        { length: choices.length },
        () => null,
      );
      console.log("updatedAnswerCorrectList", updatedAnswerCorrectList);
      setAnswerCorrectList(updatedAnswerCorrectList);
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
  }, [currentQuestion, isPreQuiz]);

  /**
   * Handles the selection of an answer option (called when user clicks one of the boxes): Updates
   * userAnswersList, the array containing the answers that the user has selected.
   *
   * @param {string} optionIndex - The index of the T/F box selected by the user.
   * @param {boolean} trueFalseOption - The T/F box selected by the user (true or false).
   */
  const handleOptionSelect = (
    optionIndex: number,
    trueFalseOption: boolean,
  ) => {
    const updatedUserAnswersList = userAnswersList.map(
      (userAnswers, questionIndex) => {
        if (questionIndex === currentQuestion - 1) {
          return userAnswers.map((option, index) => {
            // update T/F selection at optionIndex
            if (index === optionIndex) {
              if (option === trueFalseOption) {
                return null; // deselect the T/F option (was selected before)
              } else {
                return trueFalseOption; // select T/F (was unselected before)
              }
            }
            return option; // leave the others as they were
          });
        }
        return userAnswers;
      },
    );
    console.log("updatedUserAnswersList", updatedUserAnswersList);
    setUserAnswersList(updatedUserAnswersList);

    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(updatedUserAnswersList);
    }
  };

  /**
   * Handles the submission of a T/F question (called when user clicks "Submit" button): Checks the
   * user's selected answers for the current question against the solution, stores the result into
   * an array, sets current question as answered/submitted, and sets showAnswerExplanation to true
   */
  const handleSubmit = () => {
    const userAnswers = userAnswersList[currentQuestion - 1];

    // make sure that user has answered each box, otherwise do nothing
    if (userAnswers.every((answer) => answer !== null)) {
      // for each T/F statement, check if the selected answer is correct
      const answerCorrect: boolean[] = userAnswers.map(
        (userAnswer, index) => userAnswer === (correctAnswer[index] === "true"),
      );

      if (solutionList) {
        // const booleanCorrectAnswer: boolean[] = correctAnswer.map((value) => value === "true");
        const updatedSolutionList = [...solutionList]; // Create a copy of the array
        updatedSolutionList[currentQuestion - 1] = correctAnswer.map(
          (value) => value === "true",
        );
        setSolutionList(updatedSolutionList);
      }

      const questionResult = answerCorrect.every((isCorrect) => isCorrect);

      const updatedAnswerCorrectList = [...answerCorrectList];
      updatedAnswerCorrectList[currentQuestion - 1] = answerCorrect; // save the results for the current question

      const updatedQuestionResultList = [...questionResultList];
      updatedQuestionResultList[currentQuestion - 1] = questionResult; // save the overall result for the current question

      const updatedHasAnsweredList = [...hasAnsweredList];
      updatedHasAnsweredList[currentQuestion - 1] = true; // set current question as answered

      setAnswerCorrectList(updatedAnswerCorrectList);
      setShowAnswerExplanation(true);
      setQuestionResultList(updatedQuestionResultList);
      setHasAnsweredList(updatedHasAnsweredList);
    }
  };

  /** Handles the previous button of a T/F question (called when user clicks "Previous" button). */
  const handlePrevious = () => {
    // call quiz's handle previous function to go back a question
    onPrevious(userAnswersList);
    if (isPreQuiz && !quizComplete) {
      setPreQuizAnswers(userAnswersList);
    }
  };

  /** Handles the next button of a T/F question (called when user clicks "Next" button). */
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
  };

  const generateQuizResults = (answersList: (boolean | null)[][]) => {
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
      const questionResult = getQuestionResult(index, userAnswers as boolean[]);
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
   * @param {(boolean | null)[]} userAnswers - The user's answers for the question.
   */
  const statementCorrect = (
    questionNumber: number,
    index: number,
    userAnswers: (boolean | null)[],
  ) => {
    // if (userAnswers[index] === correctAnswer[index]) {
    // userAnswer === (correctAnswer[index] === "true")
    if (userAnswers[index] === solutionList[questionNumber][index]) {
      return true;
    }
    return false;
  };

  const getQuestionResult = (
    questionNumber: number,
    userAnswers: (boolean | null)[],
  ) => {
    const questionResult = userAnswers.every((_, index) => {
      console.log("userAnswers[index]", userAnswers[index]);
      // console.log(
      //   "userAnswers[index] === correctAnswer[index]",
      //   userAnswers[index] === correctAnswer[index],
      // );

      if (!statementCorrect(questionNumber, index, userAnswers)) {
        // console.log("userAnswers FALSE:", userAnswers);
        return false; // Return false if any answer is incorrect.
      }
      // console.log("userAnswers TRUE:", userAnswers);
      return true;
    });
    console.log("questionResult", questionResult);
    return questionResult;
  };

  const userAnswers = userAnswersList[currentQuestion - 1]; // user's answers for current question's (string array)
  const selectedOption = userAnswersList[currentQuestion - 1]; // current question's selected T/F options (bool array. null where not selected)
  const answerCorrect = answerCorrectList[currentQuestion - 1]; // current question's results for ea/ statement (bool array. null if not submitted)
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

  return (
    <div key={isPreQuiz ? "prequiz" : "postquiz"}>
      <div
        className={`true-false-selection mb-3 flex flex-col items-start gap-3 ${
          hasAnswered || quizComplete ? "pointer-events-none" : ""
        }`}
        id={isPreQuiz ? "prequiz-tf" : "postquiz-tf"}
      >
        <div className="true-false-letters mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6 md-qz:mt-0">
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
            key={index}
            option-index={index}
            className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6"
          >
            <div className="true-false-statement 3text-base flex aspect-[8/1] basis-[80%] items-center justify-between gap-5 rounded-md border border-black p-4 font-medium md-qz:p-0">
              <p className="p-5">{option}</p>
            </div>

            <div
              id={isPreQuiz ? "prequiz-box" : "postquiz-box"}
              className={`select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300
              ${
                // showFeedback && answerCorrect?.[index] && selectedOption[index]
                showFeedback &&
                statementCorrect(currentQuestion - 1, index, userAnswers) &&
                userAnswers[index]
                  ? "select-correct-tf bg-sciquelCorrectBG"
                  : ""
              }
              ${
                showFeedback &&
                userAnswers[index] !== null &&
                !statementCorrect(currentQuestion - 1, index, userAnswers) &&
                userAnswers[index]
                  ? "select-incorrect-tf bg-sciquelIncorrectBG"
                  : ""
              }`}
              style={{
                backgroundImage: showFeedback
                  ? userAnswers[index]
                    ? statementCorrect(currentQuestion - 1, index, userAnswers)
                      ? `url('${checkmark.src}')`
                      : `url('${x_mark.src}')`
                    : "none"
                  : userAnswers[index]
                  ? `url('${checkmark.src}')`
                  : "none",
              }}
              onClick={() => handleOptionSelect(index, true)}
            ></div>

            <div
              id={isPreQuiz ? "prequiz-box" : "postquiz-box"}
              className={`select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 ${
                showFeedback &&
                statementCorrect(currentQuestion - 1, index, userAnswers) &&
                !userAnswers[index]
                  ? "select-correct-tf bg-sciquelCorrectBG"
                  : ""
              }
              ${
                showFeedback &&
                userAnswers[index] !== null &&
                !statementCorrect(currentQuestion - 1, index, userAnswers) &&
                !userAnswers[index]
                  ? "select-incorrect-tf bg-sciquelIncorrectBG"
                  : ""
              }`}
              style={{
                backgroundImage: showFeedback
                  ? !userAnswers[index] && userAnswers[index] !== null
                    ? statementCorrect(currentQuestion - 1, index, userAnswers)
                      ? `url('${checkmark.src}')`
                      : `url('${x_mark.src}')`
                    : "none"
                  : userAnswers[index] === false
                  ? `url('${checkmark.src}')`
                  : "none",
              }}
              onClick={() => handleOptionSelect(index, false)}
            ></div>
          </div>
        ))}
      </div>

      {((quizComplete && showFeedback) || showAnswerExplanation) && (
        <div className="answer-explanation-container-tf flex w-full flex-col">
          <ul className="explanation-list w-full list-none p-0">
            {choices.map((_, index: number) => (
              <li
                key={index}
                className={
                  statementCorrect(currentQuestion - 1, index, userAnswers)
                    ? "answer-explanation-tf correct font-quicksand my-1 box-border w-full border-l-8 border-sciquelCorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelCorrectText  sm-qz:text-[16px]"
                    : "answer-explanation-tf incorrect font-quicksand my-1 box-border w-full border-l-8 border-sciquelIncorrectBG p-4 pl-8 text-[18px] font-medium leading-6 text-sciquelIncorrectText sm-qz:text-[16px]"
                }
              >
                {statementCorrect(currentQuestion - 1, index, userAnswers)
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
