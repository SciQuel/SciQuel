"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  categories: string[];
  options: string[];
  show: boolean;
  answers: Function;
  quizQuestionId: string;
  responed: { correct: boolean[]; explanation: string }[];
  disable: boolean;
  current: number;
}

export default function MultipleMatch({
  categories,
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  current,
}: Props) {
  // const [c, setC] = useState(categories.map((item, index) => index));
  // const empty2DArray = [[]];
  const [comAnswer, setComAnswer] = useState(
    Array.from({ length: categories.length }, () => []) as (number | null)[][],
  );
  const [order, setOrder] = useState(
    Array.from({ length: categories.length }, () =>
      Array.from({ length: options.length }, () => null),
    ) as (number | null)[][],
  );
  const [catList] = useState(categories.map((item, index) => index));
  const [opList] = useState(options.map((item, index) => index));
  const [quizId, _] = useState(quizQuestionId);
  const [result, setResult] = useState([] as boolean[]);
  // const result = [] as boolean[];
  const currDragRef = useRef<HTMLTextAreaElement | null>(null);
  const currColRef = useRef<number | null>(null);
  const currOpRef = useRef<number | null>(null);

  const removeItem = (row: number, col: number) => {
    setOrder((state) => {
      const newState = [...state];
      newState[row][col] = null; // Replace with the value you want to use for removal
      return newState;
    });
  };

  const addItem = (row: number, col: number, value: number | null) => {
    setOrder((state) => {
      const newState = [...state];
      newState[row][col] = value;
      return newState;
    });
  };
  function removeNull(arr: (number | null)[][]) {
    return arr.map((subArray) => subArray.filter((item) => item !== null));
  }
  const flattenCorrectArray = (
    array: Array<{ correct: boolean[]; explanation: string }>,
  ) => {
    const correctArray: boolean[] = [];
    if (array !== undefined) {
      array.forEach(({ correct }, index) =>
        correct.forEach((isCorrect, key) => {
          correctArray[comAnswer[index][key]!] = isCorrect;
        }),
      );
    }
    // console.log("correctArray ", correctArray);
    // result.push(...correctArray);
    return correctArray;
  };

  // Update the answer info to parent
  useEffect(() => {
    // console.log("Complex quizId ", quizId);
    answers({ quizId, answer: comAnswer });
  }, [comAnswer]);

  useEffect(() => {
    if (show) {
      setResult(flattenCorrectArray(responed));
      // const arr = flattenCorrectArray(responed);
      // setResult(arr);
      // console.log("result ", result);
      // flattenCorrectArray(responed);
      // const correctArray: boolean[] = [];
      // responed.forEach(({ correct }, index) =>
      //   correct.forEach((isCorrect, key) => {
      //     correctArray[comAnswer[index][key]!] = isCorrect;
      //   }),
      // );
    }
  }, [responed]);

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <div className="multiple-match-selection mb-[20px] flex flex-col items-start">
        <p className="mb-3 text-left">
          <strong className="font-quicksand mb-1 text-xl font-bold">
            Match each word in the word bank to its category.
          </strong>
        </p>

        {/* <div className="multiple-match-drop-area flex w-full flex-row flex-wrap items-start justify-center gap-3 pb-3"></div> */}

        <div className="grid w-full  grid-cols-3 justify-stretch gap-4 ">
          {catList.map((cat, colIndex) => {
            const fullCat = categories[cat];
            return (
              <div className="quiz-col  my-3.5 flex h-full  basis-[30%] flex-col gap-4 sm-mm:w-[120px] xsm-qz:w-[110px] xsm-mm:w-[100px]">
                <div className="multiple-match-statement flex  w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-white p-3 text-center text-[18px] xsm-qz:inline-block xsm-mm:text-[16px]">
                  {fullCat}
                </div>
                <div
                  // id={cat}
                  // category-key={index}
                  className="contents"
                  onDragStart={(e) => {
                    currColRef.current = colIndex;
                    console.log("drag start cat ", currColRef.current);
                    currDragRef.current = e.target as HTMLTextAreaElement;
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    // console.log("drag over cat currColRef", currColRef.current);
                    // console.log("drag over  cat currOpRef", currOpRef.current);
                    // console.log("drag over col", colIndex);
                  }}
                  onDrop={(e) => {
                    console.log("drop", colIndex);
                    const target = e.target as HTMLTextAreaElement;
                    // console.log("target", target);
                    let tmp = currDragRef.current?.innerHTML || ""; // Store the current content of the dragged item
                    // console.log("currDragRef", currDragRef.current);

                    // Check if the target element is a valid drop target
                    if (
                      target.getAttribute("data-draggable") === "target" &&
                      currDragRef.current
                    ) {
                      // Insert the dragged item into its new position
                      target.parentNode?.insertBefore(
                        currDragRef.current,
                        target,
                      );

                      // } else if (
                      //   target.getAttribute("data-draggable") === "answer"
                      // ) {
                      //   // Check if the target element and the dragged item have valid parents
                      //   if (target.parentElement && currDragRef.current) {
                      //     // Swap the content of the target element and the dragged item
                      //     currDragRef.current.innerHTML =
                      //       target.parentElement.innerHTML;
                      //     target.parentElement.innerHTML = tmp;
                      //   }
                    }

                    tmp = ""; // Reset the temporary variable
                    currDragRef.current = null;
                    console.log("currColRef", currColRef.current);

                    console.log("drop", cat);
                    setOrder((state) => {
                      const newState = [...state];
                      if (!newState[colIndex]) newState[colIndex] = [];
                      const op = currOpRef.current!;
                      newState[colIndex][op] = op;
                      // newState[colIndex] = [
                      //   ...newState[colIndex],
                      //   currOpRef.current!,
                      // ];
                      console.log("drop", newState[colIndex]);
                      return newState;
                    });
                    setComAnswer([...removeNull(order)]);
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    currDragRef.current = null;
                    currOpRef.current = null;
                    currColRef.current = null;
                  }}
                >
                  <div
                    className="multiple-match-slot h-[50px] w-full rounded-[4px] border bg-gray-200 p-3 transition duration-300"
                    data-draggable="target"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Choice Area */}

      <div className="multiple-match-answer-choice-area  w-full place-items-center gap-2 border-t-[1.75px] pt-6 ">
        <div className="grid  w-full grid-cols-3 justify-stretch gap-4">
          {opList.map((item, index) => {
            const fullItem = options[item];
            return (
              <div
                key={"item" + fullItem + result.length}
                className="multiple-match-answer-choice-holder min-w-100 relative box-border flex  w-full cursor-move items-center justify-end break-words rounded-[4px] border border-black bg-white text-center text-[18px] transition duration-300 ease-in-out "
                draggable={!disable}
                data-draggable="item"
                option-key={index}
                onDragStart={(e) => {
                  console.log("drag start");
                  currDragRef.current = e.target as HTMLTextAreaElement;
                  currOpRef.current = index;
                  // currColRef.current = -1;
                  // console.log(" start currDragRef", currDragRef.current);
                }}
                // onDragOver={(e) => {
                //   e.preventDefault();
                //   // console.log("drag over currColRef", currColRef.current);
                //   // console.log("drag over currOpRef", currOpRef.current);
                // }}
                // onDrop={(e) => {
                //   console.log("drop");
                //   const target = e.target as HTMLTextAreaElement;
                //   // console.log("target", target);
                //   let tmp = currDragRef.current?.innerHTML || ""; // Store the current content of the dragged item
                //   // console.log("currDragRef", currDragRef.current);

                //   // Check if the target element is a valid drop target
                //   // if (target.getAttribute("data-draggable") === "target") {
                //   //   // Insert the dragged item into its new position
                //   //   target.parentNode?.insertBefore(currDragRef.current!, target);
                //   // } else
                //   if (target.getAttribute("data-draggable") === "answer") {
                //     // Check if the target element and the dragged item have valid parents
                //     if (target.parentElement && currDragRef.current) {
                //       // Swap the content of the target element and the dragged item
                //       currDragRef.current.innerHTML =
                //         target.parentElement.innerHTML;
                //       target.parentElement.innerHTML = tmp;
                //     }
                //   }
                //   if (currOpRef.current !== null) {
                //     // it is index of dragged
                //     const old = currOpRef.current;
                //     const newVal = index;
                //     console.log("old", old);
                //     console.log("newVal", newVal);
                //     console.log("currOpRef", currOpRef.current);
                //     console.log("currColRef", currColRef.current);

                //     currDragRef.current = null;

                //     const oldRow = order.findIndex((row) => row.includes(old));
                //     const newRow = order.findIndex((row) =>
                //       row.includes(newVal),
                //     );
                //     const oldCol =
                //       oldRow !== -1 ? order[oldRow].indexOf(old) : -1;
                //     const newCol =
                //       newRow !== -1 ? order[newRow].indexOf(newVal) : -1;

                //     if (oldRow !== -1 && newRow !== -1) {
                //       addItem(oldRow, newVal, newVal);
                //       addItem(newRow, old, old);
                //       if (oldCol !== -1 && newCol !== -1) {
                //         removeItem(oldRow, oldCol);
                //         removeItem(newRow, newCol);
                //         console.log(
                //           `Element ${old} replaced with ${-1} at [${oldRow}, ${oldCol}]
                //                Element ${newVal} replaced with ${-1} at [${newRow}, ${newCol}]`,
                //         );
                //       }
                //       console.log(
                //         `Element ${old} replaced with ${newVal} at [${oldRow}, ${newVal}]
                //              Element ${newVal} replaced with ${old} at [${newRow}, ${old}]`,
                //       );
                //     } else {
                //       console.log(`Element ${newVal} not found`);
                //       console.log(`Element ${old} not found`);
                //     }
                //   }

                //   tmp = ""; // Reset the temporary variable
                //   currDragRef.current = null;
                //   currOpRef.current = null;
                //   setComAnswer([...removeNull(order)]);
                //   console.log("comAnswer", comAnswer);
                // }}
                // onDragEnd={(e) => {
                //   e.preventDefault();
                //   currDragRef.current = null;
                //   currOpRef.current = null;
                //   currColRef.current = null;
                // }}
              >
                <div className="image-holder absolute inset-0 flex h-full w-[35%] max-w-[50px] grow items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out">
                  {result[index] === true ? (
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
                  ) : result[index] === false ? (
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
                  ) : (
                    <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                    </span>
                  )}
                </div>
                <div
                  className="match-text align-self-center justify-right m-auto flex w-[72%] max-w-full items-center justify-end justify-self-end hyphens-auto break-words p-3 md-qz:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px]"
                  data-draggable="answer"
                >
                  {fullItem}
                </div>
              </div>
            );
          })}

          <div
            className="multiple-match-slot h-[50px] w-full rounded-[4px] border-none bg-white p-3 transition duration-300"
            data-draggable="target"
          ></div>
        </div>
      </div>
      {responed?.map((res: { explanation: string | null | undefined }) => (
        <div className="col my-2 text-center">
          <div>
            <div className="modal-content border-light w-full border">
              <div
                className="modal-body"
                style={{
                  background: "linear-gradient(to right,#A3C9A8 1%,#F8F8FF 1%)",
                }}
              >
                <p className="p-4 text-left" style={{ color: "#437E64" }}>
                  {res.explanation}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
