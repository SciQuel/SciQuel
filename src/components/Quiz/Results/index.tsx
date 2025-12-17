import React from "react";

interface Props {
  resultInfo: {
    results: { correct: boolean[]; explanation: string }[];
    correct_option_counts: number[] | null;
    score: number;
  }[];
}

/**
 * The Results component takes in a list of resultInfo and displays the total score the user got out
 * of the total number of quizzes.
 *
 * @param {Props} props The props for the Results component.
 * @return {JSX.Element} The rendered Results component.
 */
export default function Results({ resultInfo }: Props): JSX.Element {
  // Initialize score to 0
  let score = 0;

  // Loop through each resultInfo and add the score if it's valid (i.e. not 0)
  resultInfo.forEach((element) => {
    if (element.score < 0) return;
    if (element.score < 10) return (score += 0);
  });

  // Return the rendered Results component
  return (
    <div className="text-black">
      <p className="mb-6 text-center ">
        <strong className="font-quicksand mb-1 text-3xl font-bold">
          Score: <br /> {score} <br /> / <br /> {resultInfo.length}
        </strong>
      </p>
    </div>
  );
}
