import React, { useEffect, useRef, useState } from "react";
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
  "#E6999F",
  "#E6C49E",
  "#E6E699",
  "#99E6A8",
  "#99C8E6",
  "#E699C4",
  "#B8A0E6",
  "#E6BFAE",
  "#E699C7",
  "#99E6B1",
];

const DirectMatchingQuestion: React.FC<DirectMatchingQuestionProps> = ({
  question,
  updateQuestion,
  addPair,
  deletePair,
  updatePair,
}) => {
  const [rightSideOrder, setRightSideOrder] = useState<
    { id: number; right: string; color: string; number: number }[]
  >([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    const updatedOrder = (question.pairs || []).map((pair, index) => ({
      id: pair.id,
      right: pair.right,
      color: pair.color ?? "transparent",
      number: index + 1,
    }));

    if (rightSideOrder.length !== updatedOrder.length) {
      setRightSideOrder(updatedOrder);
    }
  }, [question.pairs]);

  // Auto-resize textareas when content changes
  useEffect(() => {
    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [question.pairs]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedRightSideOrder = [...rightSideOrder];
    const temp = updatedRightSideOrder[index];
    updatedRightSideOrder[index] = updatedRightSideOrder[draggedIndex];
    updatedRightSideOrder[draggedIndex] = temp;

    setRightSideOrder(updatedRightSideOrder);
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRightSideChange = (index: number, value: string) => {
    const updatedRightSideOrder = [...rightSideOrder];
    updatedRightSideOrder[index].right = value;
    setRightSideOrder(updatedRightSideOrder);
  };

  const handleLeftSideChange = (pairId: number, value: string) => {
    updatePair(question.id, pairId, { left: value });
  };

  const handleExplanationChange = (
    pairId: number,
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const explanation = e.target.value;
    updatePair(question.id, pairId, { explanation });

    // Auto-resize the textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    const newPair = {
      id: Date.now(),
      left: "",
      right: "",
      color: newColor,
      explanation: "",
    };

    addPair(question.id);
    const updatedPairs = [...(question.pairs || []), newPair];
    updateQuestion(question.id, { pairs: updatedPairs });

    setRightSideOrder((prevOrder) => [
      ...prevOrder,
      {
        id: newPair.id,
        right: "",
        color: newColor,
        number: prevOrder.length + 1,
      },
    ]);
  };

  return (
    <div className="direct-matching-question">
      <h2 className="mb-4 text-xl">{question.content}</h2>

      <div className="flex">
        {/* Left Side (Editable) */}
        <div className="left-side w-1/2 pr-2">
          {(question.pairs || []).map((pair, index) => (
            <div key={pair.id} className="pair-row mb-2 flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) =>
                    handleLeftSideChange(pair.id, e.target.value)
                  }
                  className="w-full rounded border-4 border-gray-300 p-2 pl-10"
                  placeholder="Left side"
                  style={{ borderColor: pair.color, borderWidth: "3px" }}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 transform text-sm font-bold">
                  {index + 1}
                </div>
              </div>
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
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(index)}
              style={{ cursor: "move" }}
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={rightPair.right}
                  onChange={(e) => handleRightSideChange(index, e.target.value)}
                  className="w-full rounded border-4 border-gray-300 p-2 pl-10"
                  placeholder="Right side"
                  style={{
                    borderColor: rightPair.color,
                    borderWidth: "3px",
                    cursor: "move",
                  }}
                />
                <div className="absolute left-2 top-1/2 -translate-y-1/2 transform text-sm font-bold">
                  {rightPair.number}
                </div>
              </div>
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

      {/* Explanation Boxes */}
      <div className="mt-4">
        {(question.pairs || []).map((pair, index) => (
          <div key={pair.id} className="mb-2">
            <div className="flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-bold">
                {index + 1}
              </div>
              <textarea
                ref={(el) => {
                  textareaRefs.current[index] = el;
                }}
                value={pair.explanation || ""}
                onChange={(e) => handleExplanationChange(pair.id, e)}
                className="w-full overflow-hidden rounded border p-2"
                placeholder="Enter explanation..."
                rows={1}
                style={{ resize: "none" }}
              />
            </div>
          </div>
        ))}
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
