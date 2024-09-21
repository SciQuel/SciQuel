import { useEffect, useState } from "react";

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
export default function OneMatch({
  categories,
  options,
  show,
  answers,
  quizQuestionId,
  responed,
  disable,
  current,
}: Props) {
  // console.log("ans ", userAns);

  const [dirAnswer, setDirAnswer] = useState([] as number[]);
  const [quizId, _] = useState(quizQuestionId);

  const [dirresult, setDirresult] = useState([] as boolean[]);
  // responed?.map((res: { correct: any[] }, index: number) =>
  //   res.correct.map((lp) => (dirresult[dirAnswer[index]] = lp)),
  // );
  // console.log("dirresult ", dirresult);
  // console.log("Direct QuizId ", quizId);

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
      res.correct.forEach((lp, lpIndex) => (result[dirAnswer[index]] = lp)),
    );
    console.log("result ", result);
    return result;
  };

  useEffect(() => {
    let item: HTMLTextAreaElement | null = null;

    /**
     * Handles the drag start event. Sets the item being dragged to the `item` state variable. This
     * is used to keep track of the item being dragged, and is used in the `handleDrop` handler.
     *
     * @param {DragEvent} e - The drag start event.
     */
    const handleDragStart = (e: DragEvent) => {
      // Set the item being dragged to the `item` state variable
      item = e.target as HTMLTextAreaElement;
      // Required for Firefox
      e.dataTransfer?.setData("text", "");
    };

    /**
     * Handles the drag over event. Prevents the default drop action.
     *
     * @param {DragEvent} e - The drag over event.
     */
    const handleDragOver = (e: DragEvent) => {
      // Check if an item is being dragged
      if (item) {
        // Prevent the default drop action
        e.preventDefault();
      }
    };

    /**
     * Handles the drop event. Swaps the dragged item with the target element.
     *
     * @param {DragEvent} e - The drop event.
     */
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      const targetElement = e.target as HTMLTextAreaElement;
      // console.log("targetElement ", targetElement);
      const draggedItem = item;
      // console.log("draggedItem ", draggedItem);

      if (
        draggedItem &&
        targetElement.getAttribute("data-draggable") === "answer"
      ) {
        const targetParent = targetElement.parentElement;
        const tempHtml = targetParent?.innerHTML;
        // console.log("targetParent ", targetParent);
        // console.log("tempHtml ", tempHtml);

        console.log("before targetParent!.innerHTML ", targetParent!);
        console.log(" before  draggedItem.innerHTML ", draggedItem);

        targetParent!.innerHTML = draggedItem.innerHTML;

        draggedItem.innerHTML = tempHtml!;
        console.log("targetParent!.innerHTML ", targetParent!.innerHTML);
        console.log("  draggedItem.innerHTML ", draggedItem.innerHTML);
      }
    };

    /**
     * Handles the dragend event. Resets the item variable to null, and updates the state with the
     * current order of the options.
     */
    const handleDragEnd = () => {
      item = null;

      const options = categories.flatMap((_, index) => {
        const container = document.querySelector<HTMLDivElement>(
          `#row${index}`,
        );
        return Array.from(
          container?.querySelectorAll<HTMLDivElement>("[option-key]") || [],
        ).map((element) => Number(element.getAttribute("option-key")));
      });
      console.log("options ", options);
      setDirAnswer(options);
    };
    if (show) {
      document.addEventListener("dragstart", handleDragStart);
      document.addEventListener("dragover", handleDragOver);
      document.addEventListener("drop", handleDrop);
      document.addEventListener("dragend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [show]);

  //Update the answer info to parent
  useEffect(() => {
    console.log("Direct QuizId ", quizId);
    answers({ quizId, answer: dirAnswer });
  }, [dirAnswer]);

  useEffect(() => {
    if (show) {
      // const dirresult = [] as boolean[];
      // responed?.map((res: { correct: any[] }, index: number) =>
      //   res.correct.map((lp, _) => (dirresult[dirAnswer[index]] = lp)),
      // );
      // setTest(dirresult);
      // console.log("dirresult ", test);
      // console.log("dirresult at 0  ", test[0]);
      setDirresult(flattenArray(responed));
      console.log("dirresult ", flattenArray(responed));
    }
  }, [responed]);
  console.log("dir ", dirresult);
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
      {options.map((op, index) => (
        <div
          id={"row" + index.toString()}
          key={"row" + op}
          className="quiz-row my-3.5 flex w-full flex-row"
        >
          {/* <div
            className={`one-match-answer-option min-w-100 flex w-[40%] flex-wrap items-center justify-center rounded-[4px] border border-black bg-white p-3`}
          >
            <p className="match-statement-text w-full break-words text-center text-[18px]">
              {categories[index]}
            </p>
          </div>
          <div className="line z-10 h-[2px] w-[60%] self-center bg-black transition duration-300 ease-in-out" /> */}
          <div className="answer-choice-border z-1 box-border flex w-1/2 rounded-[4px] border-2 border-dashed border-transparent transition-all">
            <div
              className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white pr-3 text-center text-[18px]  transition-all duration-300 ease-in-out"
              draggable="true"
              data-draggable="item"
              option-key={index}
            >
              <div className="image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out">
                {dirresult[index] === true ? (
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
                ) : dirresult[index] === false ? (
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
                className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3"
                data-draggable="answer"

                // key={
                //   typeof dirresult[index] == "boolean"
                //     ? dirresult[index]
                //     : index
                // }
                // key={`${op}-${index}-${
                //   typeof dirresult[index] == "boolean"
                //     ? dirresult[index].toString()
                //     : "undef"
                // }`}
              >
                {op + index + dirresult[index]}
              </div>
            </div>
          </div>
        </div>
      ))}
      {dirresult}
      {/** two */}
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
