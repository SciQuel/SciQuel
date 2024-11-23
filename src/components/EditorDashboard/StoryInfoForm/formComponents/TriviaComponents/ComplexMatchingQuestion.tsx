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
    // categoryId: number,
    itemId: number,
    updatedItem: Partial<{ content: string }>,
  ) => void;
  deleteItemFromCategory: (
    questionId: number,
    categoryId: number,
    itemId: number,
  ) => void;
  testSwap: (questionId: number, index1: number, index2: number) => void;
}

const ComplexMatchingQuestion: React.FC<ComplexMatchingQuestionProps> = ({
  question,
  updateQuestion,
  addCategory,
  deleteCategory,
  updateCategory,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
  testSwap,
}) => {
  const [draggedItem, setDraggedItem] = useState<{
    itemId: number;
    originalCategoryId: number;
  } | null>(null);

  const [testDraggedIndex, setTestDraggedIndex] = useState<number | null>(null);

  const handleCategoryNameChange = (categoryId: number, name: string) => {
    updateCategory(question.id, categoryId, { name });
  };

  const handleItemContentChange = (
    categoryId: number,
    itemId: number,
    content: string,
  ) => {
    updateItemInCategory(question.id, itemId, { content });
  };
  // categoryId,
  const handleDragStart = (itemId: number, originalCategoryId: number) => {
    setDraggedItem({ itemId, originalCategoryId });
  };

  const handleDrop = (targetItemId: number) => {
    if (draggedItem) {
      // flatten word bank
      const allItems: Array<{
        id: number;
        content: string;
        categoryId: number;
      }> =
        question.categories?.flatMap((category) =>
          category.items.map((item) => ({
            ...item,
            categoryId: category.id,
          })),
        ) || [];

      const draggedIndex = allItems.findIndex(
        (item) =>
          item.id === draggedItem.itemId &&
          item.categoryId === draggedItem.originalCategoryId,
      );

      const targetIndex = allItems.findIndex(
        (item) => item.id === targetItemId,
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Reorder items in the flat word bank
        const reorderedItems = [...allItems];
        const [movedItem] = reorderedItems.splice(draggedIndex, 1);
        reorderedItems.splice(targetIndex, 0, movedItem);

        const updatedCategories = question.categories?.map((category) => ({
          ...category,
          items: reorderedItems
            .filter((item) => item.categoryId === category.id)
            .map((item) => ({
              id: item.id,
              content: item.content,
            })),
        }));

        if (updatedCategories) {
          updateQuestion(question.id, { categories: updatedCategories });
        }
      }
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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

  return (
    <div className="mt-2">
      <div className="category-section">
        <h3 className="text-lg font-semibold">Categories</h3>
        {(question.categories || []).map((category, index) => {
          const categoryColor = defaultColors[index % defaultColors.length];

          return (
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
                    borderColor: categoryColor,
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
          );
        })}

        <button
          type="button"
          onClick={() => addCategory(question.id)}
          className="mt-2 rounded border px-2 py-1 text-sm"
          style={{ borderColor: "#00C0A1", color: "#00C0A1" }}
        >
          + Add Category
        </button>
      </div>

      <div className="word-bank mt-6">
        <h3 className="text-lg font-semibold">Word Bank</h3>
        <div>
          <h4>test</h4>
          <div className="grid grid-cols-3 gap-5">
            {question.categoryItems ? (
              question.categoryItems.map((item, index) => (
                <div
                  draggable
                  onDragOver={handleDragOver}
                  onDragStart={() => {
                    console.log("drag start: ", index);
                    setTestDraggedIndex(index);
                  }}
                  onDrop={() => {
                    if (typeof testDraggedIndex == "number") {
                      console.log("drag end: ", testDraggedIndex, " ", index);
                      testSwap(question.id, testDraggedIndex, index);
                    }
                  }}
                  key={item.content + `${index}`}
                  className="bg-slate-400"
                >
                  Test {item.id} {item.categoryId} {item.content}
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div
          className="flex flex-wrap gap-4 py-4"
          style={{ width: "100%", minHeight: "150px", overflow: "hidden" }}
        >
          {/* Flattened word bank items (not grouped by categories) */}
          {(question.categories || []).flatMap((category, index) => {
            const categoryColor =
              defaultColors[
                (question.categories || []).indexOf(category) %
                  defaultColors.length
              ];
            return category.items.map((item, itemIndex) => (
              <div
                key={item.id}
                className="flex items-center rounded-lg border p-2"
                draggable
                onDragStart={() => handleDragStart(item.id, category.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(item.id)}
                style={{
                  borderColor: categoryColor,
                  backgroundColor: `${categoryColor}20`,
                }}
              >
                <span
                  className="mr-2 rounded-full px-2 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: categoryColor,
                    color: "white",
                  }}
                >
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={item.content || ""}
                  onChange={(e) =>
                    handleItemContentChange(
                      category.id,
                      item.id,
                      e.target.value,
                    )
                  }
                  className="mr-2 w-full rounded border p-2"
                  placeholder="Enter item"
                  style={{
                    borderColor: categoryColor,
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    deleteItemFromCategory(question.id, category.id, item.id)
                  }
                  className="text-black"
                >
                  &times;
                </button>
              </div>
            ));
          })}
        </div>

        <div className="mt-2 flex flex-wrap gap-4">
          {(question.categories || []).map((category, index) => {
            const categoryColor =
              defaultColors[
                (question.categories || []).indexOf(category) %
                  defaultColors.length
              ];
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  console.log("click!");
                  console.log(question.categoryItems);
                  addItemToCategory(question.id, category.id);
                }}
                className="rounded border px-2 py-1 text-sm"
                style={{
                  borderColor: categoryColor,
                  color: categoryColor,
                }}
              >
                + Add Word to {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplexMatchingQuestion;
