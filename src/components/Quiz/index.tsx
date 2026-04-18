"use client";

import env from "@/lib/env";
import axios from "axios";
import { useState } from "react";
import MultipleChoice from "../Quiz/MultipleChoice";
import MultipMatch from "../Quiz/MultipleMatch";
import OneMatch from "../Quiz/OneMatch";
import ProgBar from "../Quiz/ProgressBar";
import Result from "../Quiz/Results";
import SelectAll from "../Quiz/SelectAll";
import TrueFalse from "../Quiz/TrueFalse";

interface Quiz {
  quiz_question_id: number;
  question_type: string;
  question?: string;
  options?: string[];
  categories?: string[];
  questions?: string[];
}

interface Props {
  quizMode: string;
  Quizzes: {
    quizzes: Quiz[];
  };
}

export type answerInfo = {
  quizId: number;
  answer: number | boolean | number[];
};
export type resInfo = {
  results: { correct: boolean[]; explanation: string }[];
  correct_option_counts: number[] | null;
  score: number;
};

export default function Quiz({ quizMode, Quizzes }: Props) {
  console.log("quiz", Quizzes);
  const barMax = 100;
  const numQues = Quizzes.quizzes.length;
  const gap = barMax / numQues;
  const [prog, setProg] = useState(
    (gap / 2).toLocaleString({
      style: "percent",
    } as unknown as string),
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitButton, setSubmitButton] = useState([] as boolean[]);
  const [answered, setAnswered] = useState([] as boolean[]);
  const [disabled, setDisabled] = useState([false] as boolean[]);
  const [respon, setRespon] = useState([] as resInfo[]);
  const [reviewMode, setReviewMode] = useState(false);
  const [showNoAnswerModal, setShowNoAnswerModal] = useState(false);
  const [selected, setSelected] = useState([] as answerInfo[]);
  /**
   * Set the answerInfo for the current question.
   *
   * @param answer The answer info to set, which includes the quiz ID and the answer.
   */
  /**
   * Saves the answer for the current question. The component keeps answers in `selected` by index
   * (currentQuestion).
   */
  const getAnswerInfo = (answer: answerInfo) => {
    console.log("Answer Info ", answer);
    setSelected([(selected[currentQuestion] = answer)]);
    setSelected([...selected]);
  };

  /** Decrements the current question index and updates the progress bar. */
  const handlePrevious = () => {
    const prvQues = currentQuestion - 1;
    prvQues >= 0 && setCurrentQuestion(prvQues);
    setProg(String(Number(prog) - Number(gap)));
  };

  const handleNext = () => {
    const nextQues = currentQuestion + 1;
    setCurrentQuestion(nextQues);
    // nextQues < numQues &&
    setProg(String(Number(prog) + Number(gap)));
    if (nextQues === numQues) {
      setReviewMode(true);
    }
  };
  const handleReview = () => {
    setCurrentQuestion(0);
    setProg(String(gap / 2));
  };
  const handleRetake = () => {
    setCurrentQuestion(0);
    setProg(String(gap / 2));
    setSelected([]);
    setAnswered([]);
    setDisabled([false]);
    setSubmitButton([]);
    setRespon([]);
    setReviewMode(false);
  };
  const jumpToResult = () => {
    setCurrentQuestion(numQues);
    setProg("100");
  };
  // Sends the selected answer for the current question to the grading API
  // and returns the API response. Caller handles updating UI state.
  async function submitAnswer() {
    const selectedAnswer = selected[currentQuestion];
    console.log("currentQuestion ", currentQuestion);
    console.log("selectedAnswer ", selectedAnswer);
    try {
      const response = await axios.post(
        `${env.NEXT_PUBLIC_SITE_URL}/api/grade`,
        {
          quiz_question_id: selectedAnswer.quizId,
          answer: selectedAnswer.answer,
        },
      );
      if (response.status === 200) {
        return response;
      }
    } catch (err) {
      console.error(err);
    }

    return;
  }
  /**
   * Called when the user clicks the Submit button for the current question. If no answer is
   * selected this will open the `showNoAnswerModal` prompt. Otherwise it will post the answer and
   * update local UI state (disabled, answered, and respon arrays).
   */
  const handleSubmit = async () => {
    if (selected[currentQuestion] === undefined) {
      // Show modal asking user to pick an answer first
      setShowNoAnswerModal(true);
      return;
    }
    setSubmitButton([(submitButton[currentQuestion] = true)]);
    setSubmitButton([...submitButton]);
    setDisabled([(disabled[currentQuestion] = true)]);
    setDisabled([...disabled]);
    console.log(
      "Current ",
      " selected ",
      currentQuestion,
      selected[currentQuestion],
    );
    const res = await submitAnswer();
    const resp: resInfo = res?.data as resInfo;
    console.log("resp ", resp);
    console.log("resp.results ", resp.results);
    setRespon([
      (respon[currentQuestion] = {
        results: resp.results,
        correct_option_counts: resp.correct_option_counts
          ? resp.correct_option_counts
          : [-1, -1, -1],
        score: resp.score,
      }),
    ]);
    setRespon([...respon]);
    setAnswered([(answered[currentQuestion] = true)]);
    setAnswered([...answered]);
  };

  return (
    <div className="quiz-body mx-auto my-6 flex w-full max-w-screen-lg  flex-col rounded-sm border border-sciquelCardBorder bg-white md:w-[768px]">
      <div className="quiz-subheader ml-5 mt-6">
        <h2 className="font-sourceSerif4 text-base font-normal text-black">
          How much do you know already know about microglia?
        </h2>
      </div>
      <ProgBar
        quizMode={quizMode}
        current={prog}
        numOfQues={numQues}
        answered={answered}
        setCurrent={setCurrentQuestion}
        setProgress={setProg}
      ></ProgBar>
      <div className="quiz-content md-qz:self-center mt-6 flex h-full w-full flex-col items-center px-11 py-3">
        <div className="question-container md-qz:flex md-qz:flex-col md-qz:p-0 relative w-full px-5">
          <div className="absolute left-[-4%] top-[1%] w-[7%] max-sm:static max-sm:w-full">
            {currentQuestion >= numQues ? null : (
              <p>
                {currentQuestion + 1} of {numQues}
              </p>
            )}
          </div>

          {Quizzes.quizzes.map((q, index) => {
            switch (q.question_type) {
              case "MULTIPLE_CHOICE":
                return (
                  <MultipleChoice
                    key={index}
                    question={q.options ?? []}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id.toString()}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={q.question ?? ""}
                    reset={answered}
                  />
                );

              case "TRUE_FALSE":
                return (
                  <TrueFalse
                    key={index}
                    questions={q.questions ?? []}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id.toString()}
                    responed={respon[currentQuestion]}
                    answer={
                      selected[currentQuestion]?.answer as
                        | number
                        | boolean
                        | [number]
                    }
                    disable={disabled[currentQuestion]}
                    reset={answered}
                  />
                );

              case "DIRECT_MATCHING":
                return (
                  <OneMatch
                    key={index}
                    categories={q.categories ?? []}
                    options={q.options ?? []}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id.toString()}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    reset={answered}
                  />
                );
              case "COMPLEX_MATCHING":
                return (
                  <MultipMatch
                    key={index}
                    categories={q.categories ?? []}
                    options={q.options ?? []}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id.toString()}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    reset={answered}
                  />
                );
              case "SELECT_ALL":
                return (
                  <SelectAll
                    key={index}
                    options={q.options ?? []}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id.toString()}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={q.question ?? ""}
                    reset={answered}
                  />
                );

              default:
                return <p>{q.question_type}</p>;
            }
          })}
          {currentQuestion === numQues ? (
            <Result resultInfo={respon} quizzes={Quizzes.quizzes}></Result>
          ) : null}
        </div>
      </div>
      {/* Previous submit and next button functionality  */}
      <div className="m-4 flex  justify-between">
        <button
          className="border-dark flex w-[20%] rounded-lg border bg-white py-2 text-black"
          type="button"
          style={{
            visibility: currentQuestion === 0 ? "hidden" : "visible",
            // display: currentQuestion === 0 ? "none" : "block",
          }}
          onClick={currentQuestion >= numQues ? handleReview : handlePrevious}
        >
          <div className="m-auto flex">
            {currentQuestion >= numQues ? (
              "Review Quiz"
            ) : currentQuestion != 0 ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                Previous
              </>
            ) : null}
          </div>
        </button>

        <button
          className="border-dark flex w-[20%] rounded-lg border bg-white py-2 text-black"
          type="button"
          style={{
            display:
              reviewMode === true && currentQuestion < numQues
                ? "block"
                : "none",
          }}
          onClick={jumpToResult}
        >
          <div className=" m-auto">
            {currentQuestion < numQues ? "To Results " : null}
          </div>
        </button>
        {quizMode === "preQuiz" ? (
          <button
            className="border-dark flex w-[20%] rounded-lg border bg-white py-2 text-black "
            type="button"
            onClick={handleNext}
          >
            <div className="m-auto flex">
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </div>
          </button>
        ) : (
          <button
            className="border-dark flex w-[20%] rounded-lg border bg-white py-2 text-black "
            type="button"
            onClick={
              currentQuestion >= numQues
                ? handleRetake
                : submitButton[currentQuestion] === true
                ? handleNext
                : handleSubmit
            }
          >
            <div className="m-auto flex">
              {currentQuestion >= numQues
                ? "Retake Quiz"
                : submitButton[currentQuestion] === true &&
                  answered[currentQuestion]
                ? "Next"
                : "Submit"}
              {submitButton[currentQuestion] === true &&
              answered[currentQuestion] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              ) : null}
            </div>
          </button>
        )}
      </div>
      {showNoAnswerModal && (
        <div
          id="default-modal"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          className="fixed left-0 right-0 top-0 z-50 flex h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-70"
            onClick={() => setShowNoAnswerModal(false)}
          />
          <div className="relative z-10 max-h-full w-full max-w-xl p-4">
            <div className="relative rounded-lg border bg-white p-6 text-black shadow-lg md:p-8">
              {/* Modal header: descriptive title and a close button */}
              <div className="flex items-center justify-between border-b pb-4 md:pb-5">
                <h3 className="text-heading text-xl font-semibold text-black">
                  Please select an answer
                </h3>
                <button
                  type="button"
                  className="text-body hover:bg-neutral-tertiary hover:text-heading rounded-base ms-auto inline-flex h-9 w-9 items-center justify-center bg-transparent text-sm"
                  onClick={() => setShowNoAnswerModal(false)}
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18 17.94 6M18 18 6.06 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="space-y-4 py-4 md:space-y-6 md:py-6">
                {/* Modal body: explanatory message */}
                <div className="space-y-4 py-4 md:space-y-6 md:py-6">
                  <p className="text-body text-base leading-relaxed text-gray-800">
                    Please choose an answer before submitting this question.
                  </p>
                </div>
              </div>

              {/* Modal actions: primary and secondary buttons */}
              <div className="flex items-center space-x-4 border-t pt-4 md:pt-5">
                <button
                  type="button"
                  className="bg-brand hover:bg-brand-strong focus:ring-brand-medium shadow-xs rounded-base box-border border border-transparent px-4 py-2.5 text-sm font-medium leading-5 text-white focus:outline-none focus:ring-4"
                  onClick={() => setShowNoAnswerModal(false)}
                >
                  OK
                </button>
                <button
                  type="button"
                  className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-neutral-tertiary shadow-xs rounded-base box-border border px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-4"
                  onClick={() => setShowNoAnswerModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
