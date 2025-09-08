"use client";

import { useEffect, useRef, useState } from "react";
import { type resInfo } from "../index";

interface Props {
  categories: string[];
  options: string[];
  show: boolean;
  answers: (value: { quizId: string; answer: (number | null)[][] }) => void;
  quizQuestionId: string;
  responed: resInfo;
  disable: boolean;
  reset: boolean[];
}

export default function MultipleMatch({
  categories,
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  reset,
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
  const [opList, setOpList] = useState(options.map((item, index) => index));
  const [quizId, _] = useState(quizQuestionId);
  const [result, setResult] = useState([] as boolean[]);
  const [trueResult, setTrueResult] = useState([] as number[]);
  // const result = [] as boolean[];
  const currDragRef = useRef<HTMLTextAreaElement | null>(null);
  const currColRef = useRef<number | null>(null);
  const currOpRef = useRef<number | null>(null);
  // remove null values from a 2D array
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
          const answerIndex = comAnswer[index][key];
          if (answerIndex !== null && answerIndex !== undefined) {
            correctArray[answerIndex] = isCorrect;
          }
        }),
      );
    }
    console.log("correctArray ", correctArray);
    // result.push(...correctArray);
    return correctArray;
  };

  // Count the number of true values in a 2D array
  const numberOfTrue = (
    array: Array<{ correct: boolean[]; explanation: string }>,
  ) => {
    const trueArray = [] as number[];
    if (array !== undefined) {
      array.forEach(
        ({ correct }, index) =>
          (trueArray[index] = correct.filter((value) => value === true).length),
      );
    }
    // console.log("trueArray ", trueArray);
    // result.push(...correctArray);
    return trueArray;
  };

  // Update the answer info to parent
  useEffect(() => {
    // console.log("Complex quizId ", quizId);
    answers({ quizId, answer: comAnswer });
  }, [comAnswer]);

  // Reset the answer when reset is called
  useEffect(() => {
    if (reset.length === 0) {
      setComAnswer(
        Array.from({ length: categories.length }, () => []) as (
          | number
          | null
        )[][],
      );
      setOrder(
        Array.from({ length: categories.length }, () =>
          Array.from({ length: options.length }, () => null),
        ) as (number | null)[][],
      );
      setOpList(options.map((item, index) => index));
    }
  }, [reset]);

  // Update the answer info to parent when show is true
  useEffect(() => {
    if (show) {
      setResult(flattenCorrectArray(responed?.results));
      setTrueResult(numberOfTrue(responed?.results));
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

        {/* categorise 
         Map through the categories and create a column for each category */}
        <div className="grid w-full  grid-cols-3 justify-stretch gap-4 ">
          {catList.map((cat, colIndex) => {
            const fullCat = categories[cat];

            return (
              <div className="quiz-col  sm-mm:w-[120px] xsm-qz:w-[110px] xsm-mm:w-[100px]  my-3.5 flex h-full basis-[30%] flex-col gap-4">
                <div
                  className="multiple-match-statement xsm-qz:inline-block  xsm-mm:text-[16px] flex w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-white p-3 text-center text-[18px]"
                  style={{
                    backgroundColor:
                      responed === undefined
                        ? "white"
                        : trueResult[colIndex] ===
                          (responed?.correct_option_counts?.[colIndex] ?? 0)
                        ? "#A3C9A8"
                        : trueResult[colIndex] === 0
                        ? "#E79595"
                        : "#f2d49b",
                  }}
                >
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
                    // console.log("drop", colIndex);
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    // console.log("target", target);
                    // let tmp = currDragRef.current?.innerHTML || ""; // Store the current content of the dragged item
                    // console.log("currDragRef", currDragRef.current);

                    // Check if the target element is a valid drop target
                    // and if it is a target for the drop
                    if (target.getAttribute("data-draggable") === "target") {
                      // Insert the dragged item into its new position
                      const newcol = colIndex;
                      // console.log("newcol form ", newcol);
                      // console.log("currColRef", currColRef.current);
                      if (
                        currColRef.current != null &&
                        currColRef.current != newcol
                      ) {
                        setOrder((state) => {
                          const newState = [...state];
                          const op = currOpRef.current;
                          if (op !== null && op !== undefined) {
                            newState[newcol][op] = op;
                            if (
                              currColRef.current !== null &&
                              currColRef.current !== undefined
                            ) {
                              newState[currColRef.current][op] = null;
                            }
                            // console.log("here1 ");
                            setComAnswer([...removeNull(newState)]);
                          }
                          return newState;
                        });
                      } else {
                        setOrder((state) => {
                          const newState = [...state];

                          // if (!newState[colIndex]) newState[colIndex] = [];
                          const op = currOpRef.current;
                          if (op !== null && op !== undefined) {
                            newState[colIndex][op] = op;
                            // console.log("here2 ");
                            // console.log("drop", newState[colIndex]);
                            setComAnswer([...removeNull(newState)]);
                          }
                          return newState;
                        });
                        // console.log("here5 ");

                        // console.log("here6 ");
                      }
                      // console.log("here7 ");

                      setOpList((state) => {
                        const newState = [...state];
                        const index = currOpRef.current;
                        if (index !== null && index !== undefined) {
                          newState[index] = -1;
                        }
                        // console.log("newState", newState);
                        // console.log("hello4");
                        return newState;
                      });
                    }
                    console.log("hello3");
                    console.log("currColRef", currColRef.current);
                    setComAnswer([...removeNull(order)]);
                    // console.log("drop", cat);
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    // currDragRef.current = null;
                    // currOpRef.current = null;
                    // currColRef.current = null;
                  }}
                >
                  {/* Answers in each column */}
                  {comAnswer[colIndex]?.map((op, _) => {
                    if (op === null) return null;

                    const fullOp = options[op];
                    return (
                      <div
                        key={"item" + fullOp + String(result.length)}
                        className="multiple-match-answer-choice-holder min-w-100 relative box-border flex w-full  cursor-move items-center justify-end break-words rounded-[4px] border border-black  bg-white text-center text-[18px] transition duration-300 ease-in-out "
                        data-draggable="item"
                        style={{
                          backgroundColor:
                            responed === undefined
                              ? "white"
                              : result[op] === true
                              ? "#A3C9A8"
                              : result[op] === false
                              ? "#E79595"
                              : "",
                        }}
                        draggable={!disable}
                        onDragStart={(e) => {
                          console.log("drag start");
                          currDragRef.current = e.target as HTMLTextAreaElement;
                          currOpRef.current = op;
                          console.log("opref ", currOpRef.current);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={() => {
                          const old = currOpRef.current;
                          const newVal = op;
                          if (old === null || old === undefined) {
                            console.log(
                              "currOpRef.current is null or undefined",
                            );
                            return;
                          }
                          console.log("old", old);
                          console.log("newVal", newVal);
                          console.log("currColRef", currColRef.current);
                          const oldRow = order.findIndex((row) =>
                            row.includes(old),
                          );
                          const newRow = order.findIndex((row) =>
                            row.includes(newVal),
                          );
                          // console.log("oldRow", oldRow);
                          // console.log("newRow", newRow);
                          const oldCol =
                            oldRow !== -1 ? order[oldRow].indexOf(old) : -1;
                          const newCol =
                            newRow !== -1 ? order[newRow].indexOf(newVal) : -1;
                          // console.log("oldCol", oldCol);
                          // console.log("newCol", newCol);
                          // console.log("order", order);

                          if (oldRow !== -1 && newRow !== -1) {
                            setOrder((state) => {
                              const newState = [...state];
                              newState[oldRow][newVal] = newVal;
                              newState[newRow][old] = old;
                              newState[oldRow][oldCol] = null;
                              newState[newRow][newCol] = null;

                              return newState;
                            });
                            setComAnswer([...removeNull(order)]);
                          } else {
                            console.log(`Element ${newVal} not found`);
                            console.log(`Element ${old} not found`);
                          }
                        }}
                        onDragEnd={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {/* correctness icon */}
                        <div
                          className="image-holder absolute inset-0 flex h-full w-[35%] max-w-[50px] grow items-center justify-center rounded-bl-[4px] rounded-tl-[4px] border-r-[1px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out"
                          style={{
                            backgroundColor:
                              responed === undefined
                                ? "#e6e6fa"
                                : result[op] === true
                                ? "#B5D4B9"
                                : result[op] === false
                                ? "#ecaaaa"
                                : "#f5ddae",

                            borderRightColor:
                              result[op] === true
                                ? "#437E64"
                                : result[op] === false
                                ? "#B85D5D"
                                : "",
                          }}
                        >
                          {result[op] === true ? (
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
                          ) : result[op] === false ? (
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
                          className="match-text align-self-center justify-right md-qz:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px] m-auto flex w-[100%] max-w-full items-center justify-center justify-self-end hyphens-auto break-words p-3"
                          data-draggable="answer"
                        >
                          {fullOp}
                        </div>
                      </div>
                    );
                  })}
                  <div
                    className="multiple-match-slot h-[50px] w-full  rounded-[4px]   bg-gray-200 p-3 transition duration-300 "
                    style={{ border: "2px dashed black" }}
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
            if (item != -1) {
              const fullItem = options[item];
              return (
                <div
                  key={"item" + fullItem + String(result.length)}
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
                  onDragOver={(e) => {
                    e.preventDefault();
                    console.log("drag over currColRef", currColRef.current);
                    console.log("drag over currOpRef", currOpRef.current);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                  }}
                  onDragEnd={(e) => {
                    e.preventDefault();
                    console.log("hello5");
                  }}
                >
                  <div
                    className="image-holder absolute inset-0 flex h-full w-[35%] max-w-[50px] grow items-center justify-center rounded-bl-[4px] rounded-tl-[4px] border-r-[1px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out"
                    style={{
                      backgroundColor:
                        responed === undefined ? "#e6e6fa" : "#ecaaaa",

                      borderRightColor: responed === undefined ? "" : "#B85D5D",
                    }}
                  >
                    {responed != null ? (
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
                    className="match-text align-self-center justify-right md-qz:inline-block sm-mm:w-[65%] xsm-mm:w-[73%] xsm-mm:text-[16px] m-auto flex w-[100%] max-w-full items-center justify-center justify-self-end hyphens-auto break-words p-3"
                    data-draggable="answer"
                    style={{
                      backgroundColor:
                        responed === undefined ? "white" : "#E79595",
                    }}
                  >
                    {fullItem}
                  </div>
                </div>
              );
            }
          })}

          <div
            className="multiple-match-slot h-[50px] w-full rounded-[4px] border-none bg-white p-3 transition duration-300"
            data-draggable="target"
          ></div>
        </div>
      </div>
      {responed?.results?.map((res, index: number) => (
        <div className="col my-2 text-center">
          <div>
            <div className="modal-content  w-full border border-none">
              <div
                className="modal-body"
                style={{
                  background:
                    trueResult[index] ===
                    (responed.correct_option_counts?.[index] ?? 0)
                      ? "linear-gradient(to right,#A3C9A8 1%,white 1%)"
                      : trueResult[index] === 0
                      ? "linear-gradient(to right,#E79595 1%,white 1%)"
                      : "linear-gradient(to right,#f2d49b 1%,white 1%)",
                }}
              >
                <p className="p-4 text-left" style={{ color: "black" }}>
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
