import React, { useState } from "react";
import { type MatchingCategory, type Question } from "./Trivia";

interface ComplexMatchingQuestionProps {
  question: Question;
  updateQuestion: (id: number, updatedQuestion: Partial<Question>) => void;
  addCategory: (questionId: number) => void;
  deleteCategory: (questionId: number, categoryId: number) => void;
  updateCategory: (
    questionId: number,
    categoryId: number,
    updatedCategory: Partial<MatchingCategory>,
  ) => void;
  addItemToCategory: (questionId: number, categoryId: number) => void;
  updateItemInCategory: (
    questionId: number,
    itemId: number,
    updatedItem: Partial<{ content: string }>,
  ) => void;
  deleteItemFromCategory: (
    questionId: number,
    categoryId: number,
    itemId: number,
  ) => void;
  positionSwap: (questionId: number, index1: number, index2: number) => void;
}

const ComplexMatchingQuestion: React.FC<ComplexMatchingQuestionProps> = ({
  question,
  addCategory,
  deleteCategory,
  updateCategory,
  addItemToCategory,
  updateItemInCategory,
  positionSwap,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleCategoryNameChange = (categoryId: number, name: string) => {
    updateCategory(question.id, categoryId, { name });
  };

  const handleItemContentChange = (itemId: number, content: string) => {
    updateItemInCategory(question.id, itemId, { content });
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const defaultColors = [
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

  const getCategoryColor = (categoryId: number | null) => {
    if (!categoryId) return "#CCCCCC"; // Default color for uncategorized items
    const categoryIndex = question.categories?.findIndex(
      (category) => category.id === categoryId,
    );
    return categoryIndex !== undefined && categoryIndex >= 0
      ? defaultColors[categoryIndex % defaultColors.length]
      : "#CCCCCC";
  };

  return (
    <div className="mt-2">
      {/* Categories Section */}
      <div className="category-section">
        <h3 className="text-lg font-semibold">Categories</h3>
        {question.categories?.map((category, index) => (
          <div key={category.id} className="mt-4 rounded-lg px-2">
            <div className="flex items-center">
              <span className="mr-2 font-semibold">{index + 1}.</span>
              <input
                type="text"
                value={category.name || ""}
                onChange={(e) =>
                  handleCategoryNameChange(category.id, e.target.value)
                }
                className="mr-2 w-full rounded border p-2"
                placeholder="Enter category"
                style={{
                  borderColor: defaultColors[index % defaultColors.length],
                  outline: " none",
                  borderWidth: "3px",
                }}
              />
              <button
                type="button"
                onClick={() => deleteCategory(question.id, category.id)}
                className="ml-2 text-black"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addCategory(question.id)}
          className="mt-2 rounded border px-2 py-1 text-sm"
          style={{
            borderColor: "#00C0A1",
            color: "#00C0A1",
            marginTop: "15px",
          }}
        >
          + Add Category
        </button>
      </div>

      {/* Word Bank Section */}
      <div className="word-bank mt-6">
        <h3 className="text-lg font-semibold" style={{ marginBottom: "15px" }}>
          Word Bank
        </h3>

        <div className="grid grid-cols-3 gap-5">
          {question.categoryItems?.map((item, index) => {
            const categoryColor = getCategoryColor(item.categoryId);

            return (
              <div
                key={item.id}
                draggable
                onDragOver={handleDragOver}
                onDragStart={() => setDraggedIndex(index)}
                onDrop={() => {
                  if (draggedIndex !== null)
                    positionSwap(question.id, draggedIndex, index);
                }}
                className="rounded border p-2"
                style={{
                  borderColor: categoryColor,
                  borderWidth: "3px",
                }}
              >
                <input
                  type="text"
                  value={item.content || ""}
                  onChange={(e) =>
                    handleItemContentChange(item.id, e.target.value)
                  }
                  className="w-full border-none bg-transparent text-center"
                  placeholder="Enter word"
                  style={{
                    outline: "none", // removes the focus outline
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-4">
          {question.categories?.map((category, index) => (
            <button
              key={category.id}
              type="button"
              onClick={() => addItemToCategory(question.id, category.id)}
              className="rounded border px-2 py-1 text-sm"
              style={{
                borderColor: defaultColors[index % defaultColors.length],
                color: defaultColors[index % defaultColors.length],
                marginTop: "5px",
              }}
            >
              + Add Word to {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplexMatchingQuestion;
