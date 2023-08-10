import Image from "next/image";
import React from "react";
import next_arrow from "../Quiz/next_arrow.png";
import prev_arrow from "../Quiz/prev_arrow.png";

interface Props {
  showPreviousButton: boolean;
  showSubmitButton: boolean;
  showNextButton: boolean;
  // selectedOption: string | boolean;
  handlePrevious: () => void; // The function called when using the previous button.
  handleNext: () => void; // The function called when using the next button.
  handleSubmit: () => void; // The function called when using the next button.
}

export default function QuizButtons({
  showPreviousButton,
  showSubmitButton,
  showNextButton,
  // selectedOption,
  handlePrevious,
  handleNext,
  handleSubmit,
}: Props) {
  return (
    <div className="quiz-btn-container mb-1 mt-5 flex justify-between">
      {showPreviousButton && (
        <button
          onClick={handlePrevious}
          className="font-quicksand border-radius-4 mr-auto flex h-10
             cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-sciquelCardBg px-4 py-1 text-lg font-medium text-black shadow-md transition duration-300 hover:bg-gray-200"
        >
          <Image src={prev_arrow} className="h-auto w-2" alt="prev arrow" />
          Previous
        </button>
      )}

      {showSubmitButton && (
        <button
          // disabled={!selectedOption}
          onClick={handleSubmit}
          className="font-quicksand border-radius-4 ml-auto h-10 cursor-pointer rounded-sm border border-black bg-sciquelCardBg px-4 py-1 text-lg font-medium text-black shadow-md transition duration-300 hover:bg-gray-200"
        >
          Submit
        </button>
      )}

      {showNextButton && (
        <button
          onClick={handleNext}
          className="font-quicksand border-radius-4 ml-auto flex h-10
             cursor-pointer flex-row items-center justify-center gap-4 rounded-sm border border-black bg-sciquelCardBg px-4 py-1 text-lg font-medium text-black shadow-md transition duration-300 hover:bg-gray-200"
        >
          Next
          <Image src={next_arrow} className="h-auto w-2" alt="next arrow" />
        </button>
      )}
    </div>
  );
}
