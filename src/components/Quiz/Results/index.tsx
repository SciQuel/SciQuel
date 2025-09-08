import React from "react";

interface Props {
  resultInfo: {
    results: { correct: boolean[]; explanation: string }[];
    correct_option_counts: number[] | null;
    score: number;
  }[];
}

export default function Results({ resultInfo }: Props) {
  let score = 0;
  resultInfo.forEach((element) => {
    if (element.score < 0) return;
    if (element.score < 10) return (score += 0);
  });

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
