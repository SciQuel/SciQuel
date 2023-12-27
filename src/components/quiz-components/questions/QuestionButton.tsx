"use client";

import Image from "next/image";
import { type PropsWithChildren } from "react";
import checkmark from "../../Quiz/checkmark.png";
import x_mark from "../../Quiz/xmark.png";

interface Props {
  onClick: () => void;

  selected: boolean;
  showFeedback: boolean;
  correctOption: boolean;
}

export default function QuestionButton({
  onClick,
  selected,
  showFeedback,
  correctOption,
  children,
}: PropsWithChildren<Props>) {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={showFeedback}
      aria-disabled={showFeedback}
      className={`multiple-choice-option my-1.5 flex w-full flex-row items-center justify-between gap-3 rounded-md border border-black px-5 py-7 text-base font-medium transition duration-300 ease-in-out hover:bg-gray-200 ${
        selected ? " selected bg-gray-300" : ""
      } ${
        showFeedback
          ? selected
            ? correctOption
              ? " select-correct cursor-default bg-sciquelCorrectBG hover:bg-sciquelCorrectBG "
              : " select-incorrect hover:sciquelIncorrectBG cursor-default  bg-sciquelIncorrectBG hover:bg-sciquelIncorrectBG"
            : " cursor-default bg-transparent hover:bg-transparent "
          : " cursor-pointer"
      } ${showFeedback && correctOption && selected ? "" : ""}
  ${showFeedback && !correctOption && selected ? "" : ""}`}
    >
      {children}
      {showFeedback && selected ? (
        correctOption ? (
          <Image
            src={checkmark}
            className="h-5 w-6 flex-grow-0"
            alt="checkmark"
          />
        ) : (
          <Image src={x_mark} className="h-6 w-6 flex-grow-0" alt="x mark" />
        )
      ) : (
        <></>
      )}
    </button>
  );
}
