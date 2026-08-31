import { useEffect, useRef, useState } from "react";
import Explanation from "../Explanation";
import { type resInfo } from "../index";

interface Props {
  categories: string[];
  options: string[];
  show: boolean;
  answers: (value: { quizId: string; answer: number[] }) => void;
  quizQuestionId: string;
  responed: resInfo;
  disable: boolean;

  reset: boolean[];
}
export default function OneMatch({
  categories,
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,

  reset,
}: Props) {
  // console.log("ans ", userAns);
  const [order, _setOrder] = useState(options.map((item, index) => index));
  const [dirAnswer, setDirAnswer] = useState(order);
  const [quizId, _] = useState(quizQuestionId);

  const [dirresult, setDirresult] = useState([] as boolean[]);

  const currDragRef = useRef<number | null>(null);

  /**
   * Flattens an array of objects containing a "correct" property which is an array of booleans, and
   * an "explanation" property which is a string, into a single array of booleans.
   *
   * @param {Array<{ correct: boolean[], explanation: string }>} array - The array of objects to
   *        flatten.
   * @returns {boolean[]} - The flattened array of booleans.
   */
  const flattenArray = (
    array: Array<{ correct: boolean[]; explanation: string }>,
  ): boolean[] => {
    const result: boolean[] = [];
    array?.forEach((res, index) =>
      res.correct.forEach((lp) => (result[index] = lp)),
    );
    return result;
  };

  useEffect(() => {
    if (reset.length === 0) {
      setDirresult([]);
      setDirAnswer(order);
    }
  }, [reset]);
  //Update the answer info to parent
  useEffect(() => {
    if (show) {
      console.log("quizId ", quizId);
      console.log("Direct answer ", dirAnswer);
      answers({ quizId: quizQuestionId, answer: dirAnswer });
    }
  }, [dirAnswer]);

  useEffect(() => {
    if (show) {
      setDirresult(flattenArray(responed?.results));
      // console.log("dirresult ", flattenArray(responed));
    }
  }, [responed]);

  return (
    <div
      className="one-match-selection mb-[20px] flex flex-col items-start"
      style={{ display: show ? "block" : "none" }}
    >
      <p className="mb-3 text-left">
        <strong className="font-quicksand mb-1 text-xl font-bold">
          Match each word in the word bank to its category.
        </strong>
      </p>
      {dirAnswer.map((item, index) => {
        const fullItem = options[item];
        return (
          <div
            id={"row" + index.toString()}
            key={"row" + fullItem + String(dirresult.length)}
            className="quiz-row my-3.5 flex w-full flex-row"
            onDragStart={() => {
              console.log("drag start");
              currDragRef.current = index;
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={() => {
              console.log(`drop event in: ${options[item]}`);
              if (currDragRef.current !== null) {
                // it is index of dragged
                const old = currDragRef.current;
                const newVal = index;
                currDragRef.current = null;
                setDirAnswer((state) => {
                  const newState = [...state];
                  newState[old] = state[newVal];
                  newState[newVal] = state[old];
                  console.log("diranswer state: ", state);
                  console.log("diranswer new: ", newState);
                  return newState;
                });
              }
            }}
          >
            <div
              className={`one-match-answer-option min-w-100 flex w-[40%] flex-wrap items-center justify-center rounded-[4px] border border-black bg-white p-3`}
            >
              <p className="match-statement-text w-full break-words text-center text-[18px]">
                {categories[index]}
              </p>
            </div>
            <div className="line z-10 h-[2px] w-[60%] self-center bg-black transition duration-300 ease-in-out" />
            <div className="answer-choice-border z-1 box-border flex w-1/2 rounded-[4px] border-2 border-dashed border-transparent transition-all">
              <div
                className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white pr-3 text-center text-[18px]  transition-all duration-300 ease-in-out"
                draggable={!disable}
                data-draggable="item"
                option-key={item}
                style={{
                  backgroundColor:
                    dirresult[index] === true
                      ? "#A2C9A8"
                      : dirresult[index] === false
                      ? "rgba(231, 149, 149, 1)"
                      : "white",
                }}
              >
                <div
                  className="image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] border-r-[1px]  bg-[#e6e6fa] px-2 transition duration-300 ease-in-out"
                  style={{
                    backgroundColor:
                      dirresult[index] === true
                        ? "#B5D4B9"
                        : dirresult[index] === false
                        ? "#ecaaaa"
                        : "#e6e6fa",
                    borderRightColor:
                      dirresult[index] === true
                        ? "#437E64"
                        : dirresult[index] === false
                        ? "#B85D5D"
                        : "",
                  }}
                >
                  {dirresult[index] === true ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
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
                  ) : dirresult[index] === false ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="h-6 w-6"
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
                  ) : (
                    <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                      <span className="hamburger-line h-0.5 w-full bg-black"></span>
                    </span>
                  )}
                </div>
                <div
                  className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3"
                  data-draggable="answer"
                >
                  {fullItem}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/** two */}
      {Explanation && (
        <Explanation explanation={responed} quizType="DIRECT_MATCHING" />
      )}
      {/* {responed?.results?.map((res) => (
        <div className="col my-2 text-center">
          <div>
            {res.correct[0] === true ? (
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
                    Correct.{" "}
                    <span className="font-normal " style={{ color: "black" }}>
                      {res.explanation}
                    </span>
                  </p>
                </div>
              </div>
            ) : res.correct[0] === false ? (
              <div className="modal-content w-full border border-none">
                <div
                  className="modal-body"
                  style={{
                    background: "linear-gradient(to right,#E79595 1%,white 1%)",
                  }}
                >
                  <p
                    className="p-4 text-left font-bold "
                    style={{ color: "#D06363" }}
                  >
                    Incorrect.{" "}
                    <span className="font-normal " style={{ color: "black" }}>
                      {res.explanation}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="p-4 text-left" style={{ color: "#437E64" }}>
                {res.explanation}
              </p>
            )}
          </div>
        </div>
      ))} */}
    </div>
  );
}
