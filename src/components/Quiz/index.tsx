"use client";

import { type Quizzes, type resp } from "@/app/api/quizzes/route";
import env from "@/lib/env";
import { type Subpart } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import MultipChoice from "../Quiz/MulitpleChoice";
import MultipMatch from "../Quiz/MultipleMatch";
import OneMatch from "../Quiz/OneMatch";
import ProgBar from "../Quiz/ProgressBar";
import TrueFalse from "../Quiz/TrueFalse";
import questions from "./questions.json";

interface Props {
  Quizzes: Quizzes;
}
export type resps = {
  subpartId: string;
  subpartUserAns: string;
};
export type selectInfo = {
  index: string;
  quizType: string;
  questionID: string;
  quizID: number;
  userAns: resps[];
};

export default function Quiz({ Quizzes }: Props) {
  const mp = "MULTIPLE_CHOICE";
  const barMax = 100;
  const storyId = "";
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

  const [isCorrect, setIsCorrect] = useState([] as boolean[]);
  const [explaination, setExplaination] = useState([] as string[]);
  const [resp, setResp] = useState([] as resp[]);
  {
    /* quiz multiple choice useState  */
  }

  const [selected, setSelected] = useState([] as selectInfo[]);
  {
    /*  Previous,Next,submit buttons */
  }
  const updateUserAns = (userAnsInfo: selectInfo) => {
    setSelected([(selected[currentQuestion] = userAnsInfo)]);
    setSelected([...selected]);
    console.log("userAns: ", selected[currentQuestion]);
  };

  const handlePrevious = () => {
    const prevQues = currentQuestion - 1;
    prevQues >= 0 && setCurrentQuestion(prevQues);
  };

  const handleNext = () => {
    const nextQues = currentQuestion + 1;
    nextQues < questions.quiz.length && setCurrentQuestion(nextQues);
    setProg(String(Number(prog) + Number(gap)));
  };

  async function submitAnswer() {
    try {
      const response = await axios.post(
        `${env.NEXT_PUBLIC_SITE_URL}/api/grade`,
        {
          storyId: storyId,
          questionType: selected[currentQuestion].quizType,
          userId: "647ad6fda9efff3abe83044f",
          quizQuestionId: selected[currentQuestion].quizID,
          responseSubparts: selected[currentQuestion].userAns,
        },
      );
      if (response.status == 200) {
        console.log("res", response);
        return response;
      }
    } catch (err) {
      console.error(err);
    }
    return;
  }
  function updateRespon(resps: resp) {
    resps.gradeSubpart.map(
      (res) => (
        setIsCorrect([(isCorrect[currentQuestion] = res.isCorrect)]),
        setIsCorrect([...isCorrect]),
        setExplaination([(explaination[currentQuestion] = res.explanation)]),
        setExplaination([...explaination])
      ),
    );
  }
  const handleSubmit = async () => {
    setAnswered([(answered[currentQuestion] = true)]);
    setAnswered([...answered]);
    setSubmitButton([(submitButton[currentQuestion] = true)]);
    setSubmitButton([...submitButton]);
    setDisabled([(disabled[currentQuestion] = true)]);
    setDisabled([...disabled]);
    const res = await submitAnswer();
    const udp = res?.data as resp;

    updateRespon(udp);
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
          {/* 
          {Quizzes.quizzes.map((q, index) => {
            storyId = q.storyId;
            switch (q.questionType) {
              case mp:
                return (
                  <MultipChoice
                    key={index}
                    question={q.subparts}
                    show={index === currentQuestion ? true : false}
                    disable={disabled[currentQuestion]}
                    updateUserAns={updateUserAns}
                    isCorrect={isCorrect[currentQuestion]}
                    exp={explaination[currentQuestion]}
                    selec={selected[currentQuestion]?.index}
                  />
                );

              case "TRUE_FALSE":
                return (
                  <TrueFalse
                    key={index}
                    question={q.subparts}
                    show={index === currentQuestion ? true : false}
                    disable={disabled[currentQuestion]}
                    updateUserAns={updateUserAns}
                    isCorrect={isCorrect[currentQuestion]}
                    exp={explaination[currentQuestion]}
                    selec={selected[currentQuestion]?.index}
                  />
                );

              case "DIRECT_MATCHING":
                return (
                  <OneMatch
                    options={q.subparts}
                    show={index === currentQuestion ? true : false}
                  />
                );
              case "COMPLEX_MATCHING":
                return (
                  <MultipMatch
                    options={q.subparts.options}
                    show={index === currentQuestion ? true : false}
                  />
                );
              default:
                return <p>{q.questionType}</p>;
            }
          })} */}
          {questions.quiz.map((q, index) => {
            switch (q.type) {
              case "onematch":
                return (
                  <OneMatch
                    options={q.category}
                    show={index === currentQuestion ? true : false}
                  />
                );
              case "multiplematch":
                return (
                  <MultipMatch
                    options={q.category}
                    show={index === currentQuestion ? true : false}
                  />
                );
              default:
                return <p>hello</p>;
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
            submitButton[currentQuestion] === true ? handleNext : handleNext
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
