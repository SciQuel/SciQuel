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
    score += element.score;
  });

  return (
    <div className="text-black">
      <p className="mb-6 text-center ">
        <strong className="font-quicksand mb-1 text-2xl font-bold">
          Your score: {score}/{resultInfo.length * 10}
        </strong>
      </p>
    </div>
  );
}
