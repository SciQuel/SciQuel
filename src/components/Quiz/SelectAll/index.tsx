import { useEffect, useState } from "react";
import Explanation from "../Explanation";
import { type resInfo } from "../index";

interface Props {
  options: string[];
  show: boolean;
  answers: (value: { quizId: string; answer: number[] }) => void;
  quizQuestionId: string;
  responed: resInfo;
  disable: boolean;
  current: string;
  reset: boolean[];
}
export default function SelectAll({
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  current,
  reset,
}: Props) {
  const [selected, setSelected] = useState([false] as boolean[]);

  useEffect(() => {
    if (show) {
      const indexes = getAllIndexes(selected, true);
      // setSAAnswer(indexes);
      answers({ quizId: quizQuestionId, answer: indexes });
    }
  }, [selected]);

  useEffect(() => {
    if (reset.length === 0) {
      setSelected([false]);
    }
  }, [reset]);

  /**
   * This function takes an array of booleans and a boolean value as arguments, and returns an array
   * of the indexes of the elements in the array that match the boolean value.
   *
   * @param {boolean[]} arr - The array of booleans.
   * @param {boolean} val - The boolean value to match.
   * @returns {number[]} - An array of the indexes of the elements in the array that match the
   *          boolean value.
   */
  const getAllIndexes = (arr: boolean[], val: boolean) =>
    arr.reduce(
      /**
       * This function takes the current array of indexes, the current element, and the current
       * index as arguments, and returns a new array of indexes.
       *
       * @param {number[]} indexes - The current array of indexes.
       * @param {boolean} el - The current element.
       * @param {number} i - The current index.
       * @returns {number[]} - A new array of indexes.
       */
      (indexes, el, i) => (el === val ? [...indexes, i] : indexes),
      [] as number[],
    );

  /**
   * Handles the event when a user selects an option.
   *
   * @param {number} index - The index of the option to select.
   */
  const handlerSelected = (index: number) => {
    // Set the selected state of the option to true.
    setSelected([(selected[index] = true)]);

    // Set the new selected state.
    setSelected([...selected]);
  };
  /**
   * Handles the event when a user unselects an option.
   *
   * @param {number} index - The index of the option to unselect.
   */
  const handlerUnSelected = (index: number) => {
    // Set the selected state of the option to false.
    setSelected([(selected[index] = false)]);

    // Set the new selected state.
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
                  ? () => handlerUnSelected(index)
                  : () => handlerSelected(index)
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
                selected[index] === true &&
                responed.results[index]?.correct[0] === false ? (
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

        {/* Base on the correctness of the choice, to display correct and incorrect massage*/}

        {/* <div className="col my-2 text-center"> {disable ? exp : ""}</div> */}
        {/* Explanation Area */}
        {responed && (
          <Explanation explanation={responed} quizType="SELECT_ALL" />
        )}
        {/* <div className="col my-2 text-center">
          {responed && responed.score === 10 ? (
            <div>
              <div className="modal-content  w-full border border-none">
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
              <div className="modal-content  w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #E79595 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold"
                    style={{ color: "#D06363" }}
                  >
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
              <div className="modal-content  w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background:
                      "linear-gradient(to right, #F2C705 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold"
                    style={{ color: "#F2C705" }}
                  >
                    Partially Correct.
                  </p>
                </div>
              </div>
              <p className="text-right text-sm" style={{ color: "#424242" }}>
                87.6% of SciQuel readers answered this question correctly.
              </p>
            </div>
          ) : null}
        </div> */}
      </div>
    </div>
  );
}
