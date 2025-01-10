import React, { useEffect, useState } from "react";
import { type MatchingPair } from "./Trivia";

interface DirectMatchingQuestionProps {
  question: {
    id: number;
    content: string;
    color?: string;
    pairs?: MatchingPair[];
  };
  updateQuestion: (id: number, updatedQuestion: Partial<any>) => void;
  addPair: (questionId: number) => void;
  deletePair: (questionId: number, pairId: number) => void;
  updatePair: (
    questionId: number,
    pairId: number,
    updatedPair: Partial<MatchingPair>,
  ) => void;
}

const pastelColors = [
  "#FFB3BA",
  "#FFDFBA",
  "#FFFFBA",
  "#BAFFC9",
  "#BAE1FF",
  "#FFB3E1",
  "#D4BAFF",
  "#FFDACB",
  "#FFB3E5",
  "#BAFFD1",
];

const DirectMatchingQuestion: React.FC<DirectMatchingQuestionProps> = ({
  question,
  updateQuestion,
  addPair,
  deletePair,
  updatePair,
}) => {
  const [rightSideOrder, setRightSideOrder] = useState<
    { id: number; right: string; color: string }[]
  >([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync the rightSideOrder with pairs, but only if pairs change and not when adding new ones
  useEffect(() => {
    const updatedOrder = (question.pairs || []).map((pair) => ({
      id: pair.id,
      right: pair.right,
      color: pair.color ?? "transparent",
    }));

    // Ensure the right side order is maintained if already exists
    if (rightSideOrder.length !== updatedOrder.length) {
      setRightSideOrder(updatedOrder);
    }
  }, [question.pairs]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedRightSideOrder = [...rightSideOrder];
    // Swap the two items directly
    const temp = updatedRightSideOrder[index];
    updatedRightSideOrder[index] = updatedRightSideOrder[draggedIndex];
    updatedRightSideOrder[draggedIndex] = temp;

    // Update the order after swap
    setRightSideOrder(updatedRightSideOrder);
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow the drop event to fire
  };

  const handleRightSideChange = (index: number, value: string) => {
    const updatedRightSideOrder = [...rightSideOrder];
    updatedRightSideOrder[index].right = value;
    setRightSideOrder(updatedRightSideOrder);
  };

  const handleLeftSideChange = (pairId: number, value: string) => {
    updatePair(question.id, pairId, { left: value });
  };

  const getNextAvailableColor = () => {
    const usedColors = (question.pairs || []).map((pair) => pair.color);
    return (
      pastelColors.find((color) => !usedColors.includes(color)) ||
      pastelColors[0]
    );
  };

  const handleAddPair = () => {
    const newColor = getNextAvailableColor();
    const newPair = { id: Date.now(), left: "", right: "", color: newColor };

    // Add new pair in the state
    addPair(question.id);

    // Append new pair to the question's pairs and rightSideOrder
    const updatedPairs = [...(question.pairs || []), newPair];
    updateQuestion(question.id, { pairs: updatedPairs });

    // Append to the right side order without resetting it
    setRightSideOrder((prevOrder) => [
      ...prevOrder,
      { id: newPair.id, right: "", color: newColor },
    ]);
  };

  return (
    <div className="direct-matching-question">
      <h2 className="mb-4 text-xl">{question.content}</h2>

      <div className="flex">
        {/* Left Side (Editable) */}
        <div className="left-side w-1/2 pr-2">
          {(question.pairs || []).map((pair) => (
            <div key={pair.id} className="pair-row mb-2 flex items-center">
              <input
                type="text"
                value={pair.left}
                onChange={(e) => handleLeftSideChange(pair.id, e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Left side"
                style={{ backgroundColor: pair.color }} // Apply color to left side
              />
            </div>
          ))}
        </div>

        {/* Right Side (Draggable and Editable) */}
        <div className="right-side w-1/2 pl-2">
          {rightSideOrder.map((rightPair, index) => (
            <div
              key={index}
              className="pair-row mb-2 flex items-center"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver} // Ensure onDragOver allows dropping
              onDrop={() => handleDrop(index)} // Trigger drop handler
              style={{ cursor: "move" }}
            >
              <input
                type="text"
                value={rightPair.right}
                onChange={(e) => handleRightSideChange(index, e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
                placeholder="Right side"
                style={{ backgroundColor: rightPair.color, cursor: "move" }} // Apply color to right side
              />
              {/* Delete Button */}
              <button
                type="button"
                onClick={() =>
                  deletePair(question.id, question.pairs![index].id)
                }
                className="ml-2 text-black"
                style={{ cursor: "pointer" }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-start space-x-2">
        <button
          type="button"
          onClick={handleAddPair}
          className="rounded bg-sciquelTeal px-1.5 py-1 text-sm text-white"
        >
          Add Pair
        </button>
      </div>
    </div>
  );
};

export default DirectMatchingQuestion;
