import { useEffect, useState } from "react";
import { type resInfo } from "../index";

interface Props {
  questions: string[];
  show: boolean;
  answers: (params: { quizId: string; answer: boolean[] }) => void;
  quizQuestionId: string;
  responed: resInfo;
  answer: number | boolean | [number];
  disable: boolean;
  reset: boolean[];
}
export default function TrueFalse({
  questions,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  reset,
}: Props) {
  const [numIndex, setNumIndex] = useState([] as string[]);
  const [tfAnswer, setTFAnswer] = useState([] as boolean[]);

  useEffect(() => {
    answers({ quizId: quizQuestionId, answer: tfAnswer });
  }, [tfAnswer]);
  useEffect(() => {
    if (reset.length === 0) {
      setNumIndex([]);
      setTFAnswer([]);
    }
  }, [reset]);
  /**
   * Handler function for true/false questions.
   *
   * @param {boolean} ans The answer to the question (true or false).
   * @param {number} idx The index of the question.
   * @param {string} t The text of the question.
   */
  const handler = (ans: boolean, idx: number, t: string): void => {
    // Save the answer to the state
    setNumIndex([(numIndex[idx] = t)]);
    // Update the state with the new answer
    setNumIndex([...numIndex]);
    // Save the answer to the state
    setTFAnswer([(tfAnswer[idx] = ans)]);
    // Update the state with the new answer
    setTFAnswer([...tfAnswer]);
  };

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <div className="true-false-selection mb-3 flex flex-col items-start gap-3 text-black">
        <p className="mb-3 text-left">
          <strong className="font-quicksand mb-1 text-xl font-bold">
            Mark each statement as true or false.
          </strong>
        </p>
        <div className="true-false-letters md-qz:mt-0 mb-[-35px] mt-[-35px] flex h-[-100px] w-full flex-row items-center justify-center gap-6">
          <div className="blankspace flex aspect-[8/1] basis-[80%] items-center justify-between gap-5"></div>
          <div className="true-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            T
          </div>
          <div className="false-letter flex aspect-[1/1] basis-[10%] items-center justify-center text-lg font-bold">
            F
          </div>
        </div>

        {/* Map of true false questions */}

        {questions?.map((statement, index) => (
          <div className="true-false-container flex h-full w-full flex-row items-center justify-center gap-6">
            <div className="true-false-statement md-qz:p-0 flex aspect-[8/1] basis-[80%] flex-row items-center justify-between gap-5 rounded-md border border-black p-5 text-base font-medium">
              <p>{statement}</p>
            </div>
            <button
              key={String(index) + "T"}
              className="select-box-true flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300 "
              onClick={() => handler(true, index, String(index) + "T")}
              disabled={disable}
              style={{
                pointerEvents: disable ? "none" : "auto",

                backgroundColor:
                  responed &&
                  String(index) + "T" == numIndex[index] &&
                  responed.results[index]?.correct[0] === true
                    ? "#A3C9A8"
                    : responed &&
                      String(index) + "T" == numIndex[index] &&
                      responed.results[index]?.correct[0] === false
                    ? "#E79595"
                    : "rgb(229 231 235)",
              }}
            >
              {responed && responed.results[index]?.correct[0] === false ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-auto w-auto"
                  style={{
                    color: "#B85D5D",
                    display:
                      String(index) + "T" === numIndex[index]
                        ? "block"
                        : "none",
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-auto w-auto"
                  style={{
                    color: "#5F8E79",
                    display:
                      String(index) + "T" === numIndex[index]
                        ? "block"
                        : "none",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </button>

            <button
              key={String(index) + "F"}
              className="select-box-false flex aspect-[1/1] basis-[10%] cursor-pointer items-center justify-between rounded-md bg-gray-200 bg-[length:65%] bg-center bg-no-repeat transition duration-300 hover:bg-gray-300"
              onClick={() => handler(false, index, String(index) + "F")}
              disabled={disable}
              style={{
                pointerEvents: disable ? "none" : "auto",
                backgroundColor:
                  responed &&
                  String(index) + "F" === numIndex[index] &&
                  responed.results[index]?.correct[0] === true
                    ? "#A3C9A8"
                    : responed &&
                      String(index) + "F" === numIndex[index] &&
                      responed.results[index]?.correct[0] === false
                    ? "#E79595"
                    : "rgb(229 231 235)",
              }}
            >
              {responed && responed.results[index]?.correct[0] === false ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-auto w-auto"
                  style={{
                    color: "#B85D5D",
                    display:
                      String(index) + "F" === numIndex[index]
                        ? "block"
                        : "none",
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-auto w-auto"
                  style={{
                    color: "#5F8E79",
                    display:
                      String(index) + "F" === numIndex[index]
                        ? "block"
                        : "none",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="col my-2 text-center">
        {responed?.results?.map(
          (res: {
            correct: boolean[];
            explanation: string | null | undefined;
          }) =>
            res.correct[0] === true ? (
              <div className="modal-content my-2 w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background: "linear-gradient(to right,#A3C9A8 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-2 text-left font-bold"
                    style={{ color: "#437E64" }}
                  >
                    Correct.
                    <span className="font-normal " style={{ color: "black" }}>
                      {res.explanation}
                    </span>
                    <br />
                  </p>
                </div>
                <p className="text-right text-sm" style={{ color: "#424242" }}>
                  You and 87.6% of SciQuel readers answered this question
                  correctly. Great job!
                </p>
              </div>
            ) : res.correct[0] === false ? (
              <div className="modal-content my-2 w-full  border border-none ">
                <div
                  className="modal-body "
                  style={{
                    background: "linear-gradient(to right,#E79595 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-2 text-left font-bold"
                    style={{ color: "#D06363" }}
                  >
                    Incorrect.
                    <span className="font-normal " style={{ color: "black" }}>
                      {res.explanation}
                    </span>
                    <br />
                  </p>
                </div>
                <p className="text-right text-sm" style={{ color: "#424242" }}>
                  87.6% of SciQuel readers answered this question correctly.
                </p>
              </div>
            ) : null,
        )}
      </div>
    </div>
  );
}
