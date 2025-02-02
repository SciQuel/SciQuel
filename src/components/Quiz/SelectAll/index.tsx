import { useEffect, useState } from "react";
import { type resInfo } from "../index";

interface Props {
  options: string[];
  show: boolean;
  answers: Function;
  quizQuestionId: string;
  responed: resInfo;
  disable: boolean;
  current: string;
}
export default function SelectAll({
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  current,
}: Props) {
  const [saAnswer, setSAAnswer] = useState([] as number[]);
  const [selected, setSelected] = useState([false] as boolean[]);

  useEffect(() => {
    const indexes = getAllIndexes(selected, true);
    // setSAAnswer(indexes);
    answers({ quizId: quizQuestionId, answer: indexes });
  }, [selected]);

  const getAllIndexes = (arr: boolean[], val: boolean) =>
    arr.reduce(
      (indexes, el, i) => (el === val ? [...indexes, i] : indexes),
      [] as number[],
    );

  const handlerSelected = (index: number) => {
    setSelected([(selected[index] = true)]);
    setSelected([...selected]);
  };
  const handlerUnSelected = (index: number) => {
    setSelected([(selected[index] = false)]);
    setSelected([...selected]);
  };
  return (
    <div>
      <div className=" text-black" style={{ display: show ? "block" : "none" }}>
        <p className="mb-6 text-left">
          <strong className="font-quicksand mb-1 text-2xl font-bold">
            {current}
          </strong>
        </p>
        <div className="flex flex-col ">
          {/* Map all choices and change base on the correctness of the choice*/}
          {options.map((choice, index) => (
            // choice.map((op, index) => (
            <button
              key={index}
              className="`multiple-choice-option my-1.5 flex w-full cursor-pointer flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-5 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200"
              onClick={
                selected[index] === true
                  ? (e) => handlerUnSelected(index)
                  : (e) => handlerSelected(index)
              }
              disabled={disable}
              style={{
                pointerEvents: disable ? "none" : "auto",
                backgroundColor:
                  responed &&
                  selected[index] === true &&
                  responed.results[index]?.correct[0] === true
                    ? "#A3C9A8"
                    : responed &&
                      selected[index] === true &&
                      responed.results[index]?.correct[0] === false
                    ? "#E79595"
                    : selected[index] === true
                    ? "#D5E5FD"
                    : "white",
              }}
            >
              {choice}
              {responed &&
              selected[index] === true &&
              responed.results[index]?.correct[0] === true ? (
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
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              ) : responed &&
                selected[index] === true &&
                responed.results[index]?.correct[0] === false ? (
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : null}
            </button>
          ))}
        </div>

        {/* Base on the correctness of the choice, to display correct and incorrect massage*/}

        {/* <div className="col my-2 text-center"> {disable ? exp : ""}</div> */}

        <div className="col my-2 text-center">
          {responed && responed.score === 10 ? (
            <div>
              <div className="modal-content border-light w-full border">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right,#A3C9A8 1%,#F8F8FF 1%)",
                  }}
                >
                  <p className="p-4 text-left" style={{ color: "#437E64" }}>
                    Correct.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                You and 87.6% of SciQuel readers answered this question
                correctly. Great job!
              </p>
            </div>
          ) : responed && responed.score === 0 ? (
            <div>
              <div className="modal-content border-light w-full border">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #E79595 1%,#F8F8FF 1%)",
                  }}
                >
                  <p className="p-4 text-left" style={{ color: "#D06363" }}>
                    Incorrect.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                87.6% of SciQuel readers answered this question correctly.
              </p>
            </div>
          ) : responed && responed.score > 0 && responed.score < 10 ? (
            <div>
              <div className="modal-content border-light w-full border">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #F2D49A 1%,#F8F8FF 1%)",
                  }}
                >
                  <p className="p-4 text-left" style={{ color: "#F2D49A" }}>
                    Partially Correct.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                87.6% of SciQuel readers answered this question correctly.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
