
import { useEffect, useState } from "react";

interface Props {
  categories: string[];
  options: string[];
  show: boolean;
}
export default function OneMatch({ categories, options, show }: Props) {
  // console.log("ans ", userAns);
  let item: HTMLTextAreaElement;
  useEffect(() => {
    //dragstart event to initiate mouse dragging
    document.addEventListener(
      "dragstart",
      function (e) {
        //set the item reference to this element
        item = e.target as HTMLTextAreaElement;

        //we don't need the transfer data, but we have to define something
        //otherwise the drop action won't work at all in firefox
        //most browsers support the proper mime-type syntax, eg. "text/plain"
        //but we have to use this incorrect syntax for the benefit of IE10+
        e.dataTransfer?.setData("text", "");
      },
      false,
    );

    //dragover event to allow the drag by preventing its default
    //ie. the default action of an element is not to allow dragging
    document.addEventListener(
      "dragover",
      function (e) {
        if (item) {
          e.preventDefault();
        }
      },
      false,
    );

    //drop event to allow the element to be dropped into valid targets
    document.addEventListener(
      "drop",
      function (e) {
        //if this element is a drop target, move the item here
        //then prevent default to allow the action (same as dragover)
        const target = e.target as HTMLTextAreaElement;

        // console.log("hello", target.parentElement?.innerHTML);
        // console.log("item", item.innerHTML);
        let tmp = item.innerHTML;
        // console.log("key ", target.getAttribute("key"));
        if (target.getAttribute("data-draggable") == "answer") {
          if (target.parentElement != null && item != null) {
            item.innerHTML = target.parentElement?.innerHTML;
            target.parentElement.innerHTML = tmp;
          }

          e.preventDefault();
        }
        tmp = "";
      },
      false,
    );

    //dragend event to clean-up after drop or abort
    //which fires whether or not the drop target was valid
    document.addEventListener(
      "dragend",
      function () {
        item = null as unknown as HTMLTextAreaElement;
      },
      false,
    );
  });

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
        <div className="quiz-row my-3.5 flex w-full flex-row">
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
                <span className="hamburger-menu flex h-4 w-6 flex-col justify-between rounded-[4px] border-none">
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                  <span className="hamburger-line h-0.5 w-full bg-black"></span>
                </span>
              </div>
              <div
                key={index}
                className="match-text align-self-center w-full justify-self-center overflow-hidden hyphens-auto p-3"
                data-draggable="answer"
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
