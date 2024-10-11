"use client";

import env from "@/lib/env";
import { type QuizQuestion } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import MultipChoice from "../Quiz/MulitpleChoice";
import MultipMatch from "../Quiz/MultipleMatch";
import OneMatch from "../Quiz/OneMatch";
import ProgBar from "../Quiz/ProgressBar";
import SelectAll from "../Quiz/SelectAll";
import TrueFalse from "../Quiz/TrueFalse";

interface Props {
  Quizzes: QuizQuestion;
}

export type answerInfo = {
  quizId: number;
  answer: number | boolean | [number];
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
  const [respon, setRespon] = useState([] as any);

  {
    /* quiz multiple choice useState  */
  }

  const [selected, setSelected] = useState([] as answerInfo[]);
  {
    /*  Previous,Next,submit buttons */
  }

  const getAnswerInfo = (answer: answerInfo) => {
    console.log("Answer Info ", answer);
    setSelected([(selected[currentQuestion] = answer)]);
    setSelected([...selected]);
  };

  const handlePrevious = () => {
    const prevQues = currentQuestion - 1;
    prevQues >= 0 && setCurrentQuestion(prevQues);
  };

  const handleNext = () => {
    const nextQues = currentQuestion + 1;
    nextQues < numQues && setCurrentQuestion(nextQues);

    setProg(String(Number(prog) + Number(gap)));
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
          quiz_record_id: Quizzes.quiz_record_id,
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
    const resp = res?.data;
    console.log("resp ", resp?.results);
    setRespon((respon[currentQuestion] = resp.results));
    setRespon([...respon]);
  };

  return (
    <div className="quiz-body mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white md-qz:w-full">
      <div className="quiz-subheader ml-5 mt-6">
        <h2 className="font-sourceSerif4 text-base font-normal text-black">
          How much do you know already know about microglia?
        </h2>
      </div>
      <ProgBar current={prog} numOfQues={numQues} answered={answered}></ProgBar>
      <div className="quiz-content mt-6 flex h-full w-full flex-col items-center px-11 py-3 md-qz:self-center">
        <div className="question-container relative w-full px-5 md-qz:flex md-qz:flex-col md-qz:p-0">
          <div className="absolute left-[-4%] top-[1%] w-[7%]">
            <p>
              {currentQuestion + 1} of {numQues}
            </p>
          </div>

          {Quizzes.quizzes.map((q, index) => {
            switch (q.question_type) {
              case "MULTIPLE_CHOICE":
                return (
                  <MultipChoice
                    key={index}
                    question={q.options}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={q.question}
                  />
                );

              case "TRUE_FALSE":
                return (
                  <TrueFalse
                    key={index}
                    questions={q.questions}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={currentQuestion}
                  />
                );

              case "DIRECT_MATCHING":
                return (
                  <OneMatch
                    key={index}
                    categories={q.categories}
                    options={q.options}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={currentQuestion}
                  />
                );
              case "COMPLEX_MATCHING":
                return (
                  <MultipMatch
                    key={index}
                    categories={q.categories}
                    options={q.options}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={currentQuestion}
                  />
                );
              case "SELECT_ALL":
                return (
                  <SelectAll
                    key={index}
                    options={q.options}
                    show={index === currentQuestion ? true : false}
                    answers={getAnswerInfo}
                    quizQuestionId={q.quiz_question_id}
                    responed={respon[currentQuestion]}
                    disable={disabled[currentQuestion]}
                    current={q.question}
                  />
                );

              default:
                return <p>{q.questionType}</p>;
            }
          })}
        </div>
      </div>
      {/* Previous submit and next button functionality  */}
      <div className="m-4 flex  justify-between">
        <button
          className="border-dark flex w-[15%] rounded-lg border bg-white py-2 text-black"
          type="button"
          style={{
            visibility:
              submitButton[currentQuestion] === true ? "visible" : "hidden",
            display: currentQuestion + 1 > numQues ? "none" : "block",
          }}
          onClick={handlePrevious}
        >
          <div className="m-auto flex">
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
          </div>
        </button>

        <button
          className="border-dark flex w-[15%] rounded-lg border bg-white py-2 text-black "
          type="button"
          onClick={
            submitButton[currentQuestion] === true ? handleNext : handleSubmit
          }
        >
          <div className="m-auto flex">
            {submitButton[currentQuestion] === true ? "Next" : "Submit"}
            {submitButton[currentQuestion] === true ? (
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
