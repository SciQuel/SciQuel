import { useEffect, useState } from "react";
import Explanation from "../Explanation";
import { type resInfo } from "../index";

interface Props {
  question: string[];
  show: boolean;
  answers: (params: { quizId: string; answer: number | null }) => void;
  quizQuestionId: string;
  responed: resInfo;
  disable: boolean;
  current: string;
  reset: boolean[];
}
export default function MultipleChoice({
  question,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  current,
  reset,
}: Props) {
  const [mtAnswer, setMTAnswer] = useState(null as number | null);

  useEffect(() => {
    if (show) {
      answers({ quizId: quizQuestionId, answer: mtAnswer });
    }
  }, [mtAnswer, show]);

  useEffect(() => {
    if (reset.length === 0) {
      setMTAnswer(null);
    }
  }, [reset]);

  const handler = (index: number) => {
    setMTAnswer(index);
  };

  return (
    <div className="text-black" style={{ display: show ? "block" : "none" }}>
      <p className="mb-6 text-left">
        <strong className="font-quicksand mb-1 text-2xl font-bold">
          {/* What are microglia? */}
          {current}
        </strong>
      </p>
      <div className="flex flex-col ">
        {question.map((choice, index) => (
          <button
            key={index}
            className="multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-5 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200"
            onClick={() => handler(index)}
            disabled={disable}
            style={{
              pointerEvents: disable ? "none" : "auto",

              backgroundColor:
                responed &&
                index === mtAnswer &&
                responed.results[0]?.correct[0] === true
                  ? "#A3C9A8"
                  : responed &&
                    index === mtAnswer &&
                    responed.results[0]?.correct[0] === false
                  ? "#E79595"
                  : index === mtAnswer
                  ? "#D5E5FD"
                  : "white",
            }}
          >
            {choice}
            {responed &&
            index === mtAnswer &&
            responed.results[0]?.correct[0] === true ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-8 w-8"
                style={{
                  color: "#437E64",
                }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            ) : responed &&
              index === mtAnswer &&
              responed.results[0]?.correct[0] === false ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-8 w-8"
                style={{
                  color: "#B85D5D",
                }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : null}
          </button>
        ))}
      </div>

      <Explanation explanation={responed} quizType="MULTIPLE_CHOICE" />

      {/* Explanation Area */}
      {/* {responed && (
        <div className="col my-2 text-center">
          {responed.results[0]?.correct[0] === true ? (
            <div className="modal-content w-full border border-none">
              <div
                className="modal-body"
                style={{
                  background: "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                }}
              >
                <p
                  className="p-4 text-left font-bold"
                  style={{ color: "#437E64" }}
                >
                  Correct.
                  <span className="font-normal text-black">
                    {responed.results[0]?.explanation}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="modal-content w-full border border-none">
              <div
                className="modal-body"
                style={{
                  background: "linear-gradient(to right,#E79595 1%,white 1%)",
                }}
              >
                <p
                  className="p-4 text-left font-bold"
                  style={{ color: "#D06363" }}
                >
                  Incorrect.{" "}
                  <span className="font-normal text-black">
                    {responed.results[0]?.explanation}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}
