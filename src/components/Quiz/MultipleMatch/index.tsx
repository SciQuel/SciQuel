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
// export type answerInfo = {
//   quizId: number;
//   answer: [number] | number;
// };

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
  const [comAnswer, setComAnswer] = useState([] as number[][]);
  const [quizId, _] = useState(quizQuestionId);
  const result = [] as boolean[];

  responed?.map((res: { correct: any[] }, index: number) =>
    res.correct.map((lp, key) => (result[comAnswer[index][key]] = lp)),
  );

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

      // Check if the target element is a valid drop target
      if (target.getAttribute("data-draggable") === "target") {
        // Insert the dragged item into its new position
        target.parentNode?.insertBefore(item!, target);
      } else if (target.getAttribute("data-draggable") === "answer") {
        // Check if the target element and the dragged item have valid parents
        if (target.parentElement && item) {
          // Swap the content of the target element and the dragged item
          item.innerHTML = target.parentElement.innerHTML;
          target.parentElement.innerHTML = tmp;
        }
      }

      tmp = ""; // Reset the temporary variable
    };

    /**
     * Handles the dragend event. Resets the item variable to null, and updates the state with the
     * current order of the options.
     */
    const handleDragEnd = () => {
      item = null;

      const array: number[][] = categories.map((category) => {
        // Get all the elements with the option-key attribute
        const container = document.querySelector(`#${category}`);
        const elements = container?.querySelectorAll("div[option-key]") || [];
        // Map the elements to their corresponding option-key attribute value
        return Array.from(elements).map((elem) =>
          Number(elem.getAttribute("option-key")),
        );
      });

      // Update the state with the current order of the options
      setComAnswer(array);
    };

    // if (show) {
    //   document.addEventListener("dragstart", handleDragStart);
    //   document.addEventListener("dragover", handleDragOver);
    //   document.addEventListener("drop", handleDrop);
    //   document.addEventListener("dragend", handleDragEnd);
    // } else {
    //   document.removeEventListener("dragstart", handleDragStart);
    //   document.removeEventListener("dragover", handleDragOver);
    //   document.removeEventListener("drop", handleDrop);
    //   document.removeEventListener("dragend", handleDragEnd);
    // }

    // return () => {
    //   document.removeEventListener("dragstart", handleDragStart);
    //   document.removeEventListener("dragover", handleDragOver);
    //   document.removeEventListener("drop", handleDrop);
    //   document.removeEventListener("dragend", handleDragEnd);
    // };
  }, [show]);

  // Update the answer info to parent
  useEffect(() => {
    // console.log("Complex quizId ", quizId);
    answers({ quizId, answer: comAnswer });
  }, [comAnswer]);
  // useEffect(() => {
  //   if (show) {
  //     responed?.map((res: { correct: any[] }, index: number) =>
  //       res.correct.map((lp, key) => (result[comAnswer[index][key]] = lp)),
  //     );
  //     console.log("result ", result);
  //   }
  // }, [result]);

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
          {categories.map((cat, index) => (
            <div className="quiz-col  my-3.5 flex h-full  basis-[30%] flex-col gap-4 sm-mm:w-[120px] xsm-qz:w-[110px] xsm-mm:w-[100px]">
              <div className="multiple-match-statement flex  w-full flex-wrap items-center justify-center hyphens-auto break-words rounded-[4px] border border-black bg-white p-3 text-center text-[18px] xsm-qz:inline-block xsm-mm:text-[16px]">
                {cat}
              </div>
              <div id={cat} category-key={index} className="contents">
                <div
                  className="multiple-match-slot h-[50px] w-full rounded-[4px] border bg-gray-200 p-3 transition duration-300"
                  data-draggable="target"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Choice Area */}

      <div className="multiple-match-answer-choice-area  w-full place-items-center gap-2 border-t-[1.75px] pt-6 ">
        <div className="grid  w-full grid-cols-3 justify-stretch gap-4">
          {options.map((Choice, index) => (
            <div
              className="multiple-match-answer-choice-holder min-w-100 relative box-border flex  w-full cursor-move items-center justify-end break-words rounded-[4px] border border-black bg-white text-center text-[18px] transition duration-300 ease-in-out "
              draggable={!disable}
              data-draggable="item"
              option-key={index}
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
                {Choice}
              </div>
            </div>
          ))}

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
