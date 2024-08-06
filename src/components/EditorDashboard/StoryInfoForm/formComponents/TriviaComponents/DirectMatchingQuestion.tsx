import React from "react";
import { type MatchingPair, type Question } from "./Trivia";

interface DirectMatchingQuestionProps {
  question: Question;
  updateQuestion: (id: number, updatedQuestion: Partial<Question>) => void;
  addPair: (questionId: number) => void;
  deletePair: (questionId: number, pairId: number) => void;
  updatePair: (
    questionId: number,
    pairId: number,
    updatedPair: Partial<MatchingPair>,
  ) => void;
}

const DirectMatchingQuestion: React.FC<DirectMatchingQuestionProps> = ({
  question,
  addPair,
  deletePair,
  updatePair,
}) => {
  const handleLeftChange = (pairId: number, left: string) => {
    updatePair(question.id, pairId, { left });
  };

  const handleRightChange = (pairId: number, right: string) => {
    updatePair(question.id, pairId, { right });
  };

  return (
    <div className="mt-2">
      {question.pairs?.map((pair) => (
        <div key={pair.id} className="mt-2 flex items-center">
          <input
            type="text"
            value={pair.left}
            onChange={(e) => handleLeftChange(pair.id, e.target.value)}
            className="mr-2 w-full rounded border p-2"
            placeholder="Enter left content..."
          />
          <span className="mr-2">=</span>
          <input
            type="text"
            value={pair.right}
            onChange={(e) => handleRightChange(pair.id, e.target.value)}
            className="mr-2 w-full rounded border p-2"
            placeholder="Enter right content..."
          />
          <button
            onClick={() => deletePair(question.id, pair.id)}
            className="text-sciquelTeal"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        onClick={() => addPair(question.id)}
        className="mt-2 rounded bg-sciquelTeal px-2 py-1 text-sm text-white"
      >
        Add Pair
      </button>
    </div>
  );
};

export default DirectMatchingQuestion;
