"use client";

import env from "@/lib/env";
import { type QuizQuestion } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import MultipChoice from "../Quiz/MulitpleChoice";
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
  Quizzes: {
    quizzes: Quiz[];
  };
}

export type answerInfo = {
  quizId: number;
  answer: number | boolean | [number];
};
export type resInfo = {
  results: { correct: boolean[]; explanation: string }[];
  correct_option_counts: number[] | null;
  score: number;
};

export default function Quiz({ Quizzes }: Props) {
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

  {
    /* quiz multiple choice useState  */
  }

  const [selected, setSelected] = useState([] as answerInfo[]);
  /**
   * Set the answerInfo for the current question.
   *
   * @param answer The answer info to set, which includes the quiz ID and the answer.
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
  };
  // function removeNullEmptyUndefined(arr: (number | null)[][]) {
  //   return arr.map((subArray) =>
  //     subArray.filter((item) => item !== null && item !== undefined),
  //   );
  // }
  async function submitAnswer() {
    const selectedAnswer = selected[currentQuestion];
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
  const handleSubmit = async () => {
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
    <div className="quiz-body md-qz:w-full mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white">
      <div className="quiz-subheader ml-5 mt-6">
        <h2 className="font-sourceSerif4 text-base font-normal text-black">
          How much do you know already know about microglia?
        </h2>
      </div>
      <ProgBar
        current={prog}
        numOfQues={numQues}
        answered={answered}
        setCurrent={setCurrentQuestion}
        progress={prog}
        gap={gap}
        setProgress={setProg}
      ></ProgBar>
      <div className="quiz-content md-qz:self-center mt-6 flex h-full w-full flex-col items-center px-11 py-3">
        <div className="question-container md-qz:flex md-qz:flex-col md-qz:p-0 relative w-full px-5">
          <div className="absolute left-[-4%] top-[1%] w-[7%]">
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
                  <MultipChoice
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
                    answer={selected[currentQuestion]?.answer}
                    disable={disabled[currentQuestion]}
                    current={currentQuestion}
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
                    current={currentQuestion}
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
                    current={currentQuestion}
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
          {currentQuestion == numQues ? (
            <Result resultInfo={respon}></Result>
          ) : null}
        </div>
      </div>
      {/* Previous submit and next button functionality  */}
      <div className="m-4 flex  justify-between">
        <button
          className="border-dark flex w-[15%] rounded-lg border bg-white py-2 text-black"
          type="button"
          // style={{
          //   visibility: currentQuestion != 0 ? "visible" : "hidden",
          //   display: currentQuestion + 1 > numQues ? "none" : "block",
          // }}
          onClick={currentQuestion >= numQues ? handleReview : handlePrevious}
        >
          <div className="m-auto flex">
            {currentQuestion >= numQues ? (
              "Review Quiz"
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
                Previous
              </>
            )}
          </div>
        </button>

        <button
          className="border-dark flex w-[15%] rounded-lg border bg-white py-2 text-black "
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
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
}
