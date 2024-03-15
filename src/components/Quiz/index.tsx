"use client";

import { useState } from "react";
import MultipChoice from "../Quiz/MulitpleChoice";
import MultipMatch from "../Quiz/MultipleMatch";
import OneMatch from "../Quiz/OneMatch";
import ProgBar from "../Quiz/ProgressBar";
import TrueFalse from "../Quiz/TrueFalse";

export default function Quiz() {
  const barMax = 100;
  const numQues = 4;
  const gap = barMax / numQues;
  const [prog, setProg] = useState(
    (gap / 2).toLocaleString({
      style: "percent",
    } as unknown as string),
  );

  {
    /*  Previous,Next,submit buttons */
  }

  const handleNext = () => {
    setProg(String(Number(prog) + Number(gap)));
  };
  return (
    <div className="quiz-body mx-auto my-6 flex w-[720px] max-w-screen-lg flex-col rounded-sm border border-sciquelCardBorder bg-white md-qz:w-full">
      <ProgBar current={prog} numOfQues={numQues}></ProgBar>
      <div className="quiz-content flex h-full w-full flex-col items-center px-11 py-3 md-qz:self-center">
        <div className="question-container relative w-full px-5 md-qz:flex md-qz:flex-col md-qz:p-0">
          <div className="absolute left-[-6%] w-[6.5%]">
            <p>3 of {numQues}</p>
          </div>
          {/* <MultipChoice></MultipChoice> */}
          {/* <TrueFalse></TrueFalse> */}
          <MultipMatch></MultipMatch>
          {/* <OneMatch></OneMatch> */}
        </div>
      </div>
      {/* Previous submit and next button functionality  */}
      <div className="m-4 flex  justify-between">
        <button
          className="border-dark flex w-[15%] rounded-lg border bg-white py-2 text-black"
          type="button"
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
          onClick={handleNext}
        >
          <div className="m-auto flex">
            Next
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
          </div>
        </button>
      </div>
    </div>
  );
}
