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
  const result = [] as boolean[];
  responed?.map((res: { correct: any[] }, index: number) =>
    res.correct.map((lp, key) => (result[dirAnswer[index]] = lp)),
  );
  // console.log("result ", result);
  // console.log("Direct QuizId ", quizId);
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
     * Handles the drop event. Inserts the dragged item into its new position, and updates the
     * content of the target element.
     *
     * @param {DragEvent} e - The drop event.
     */
    const handleDrop = (e: DragEvent) => {
      // Prevent default drop action
      e.preventDefault();

      // Get the target element
      const target = e.target as HTMLTextAreaElement;
      let tmp = item?.innerHTML || ""; // Store the current content of the dragged item

      /**
       * Check if the target element has the attribute "data-draggable" set to "answer". If it does,
       * swap the contents of the target element and the dragged item.
       */

      if (target.getAttribute("data-draggable") === "answer") {
        console.log("hello");
        if (target.parentElement != null && item != null) {
          // Swap the contents of the target element and the dragged item
          item.innerHTML = target.parentElement?.innerHTML;
          // console.log("innerHTML", item.innerHTML);
          target.parentElement.innerHTML = tmp;
          console.log("tmp", tmp);
        }

        // Prevent the default drop action
        e.preventDefault();
      }

      tmp = ""; // Reset the temporary variable
    };

    /**
     * Handles the dragend event. Resets the item variable to null, and updates the state with the
     * current order of the options.
     */
    const handleDragEnd = () => {
      item = null;

      const array = [] as number[];
      categories.map((category, index) => {
        const container = document.querySelector("#row" + index.toString());
        // console.log("container ", container);
        container
          ?.querySelectorAll("div[option-key]")
          .forEach((elem) =>
            array.push(Number(elem.getAttribute("option-key"))),
          );
        setDirAnswer(array);
        // console.log("array ", array);
      });
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("drop", handleDrop);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [categories]);

  //Update the answer info to parent
  useEffect(() => {
    console.log("Direct QuizId ", quizId);
    const answerInfo = {
      quizId: quizId,
      answer: dirAnswer,
    };
    answers(answerInfo);
  }, [dirAnswer]);

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
      {categories.map((cat, index) => (
        <div
          id={"row" + index.toString()}
          className="quiz-row my-3.5 flex w-full flex-row"
        >
          <div
            className={`one-match-answer-option min-w-100 flex w-[40%] flex-wrap items-center justify-center rounded-[4px] border border-black bg-white p-3`}
          >
            <p className="match-statement-text w-full break-words text-center text-[18px]">
              {cat}
            </p>
          </div>
          <div className="line z-10 h-[2px] w-[60%] self-center bg-black transition duration-300 ease-in-out" />
          <div className="answer-choice-border z-1 box-border flex w-1/2 rounded-[4px] border-2 border-dashed border-transparent transition-all">
            <div
              className="one-match-answer-choice-holder min-w-100 box-border flex h-full w-full cursor-move items-center break-words rounded-[4px] border border-black bg-white pr-3 text-center text-[18px]  transition-all duration-300 ease-in-out"
              draggable="true"
              data-draggable="item"
            >
              <div className="image-holder flex h-full w-[35%] max-w-[50px] items-center justify-center rounded-bl-[4px] rounded-tl-[4px] bg-[#e6e6fa] px-2 transition duration-300 ease-in-out">
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
                className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3"
                data-draggable="answer"
                option-key={index}
              >
                {options[index]}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/** two */}
    </div>
  );
}
