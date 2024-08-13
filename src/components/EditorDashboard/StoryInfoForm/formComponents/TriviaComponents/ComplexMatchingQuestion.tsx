import React from "react";
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
    categoryId: number,
    itemId: number,
    updatedItem: Partial<{ content: string }>,
  ) => void;
  deleteItemFromCategory: (
    questionId: number,
    categoryId: number,
    itemId: number,
  ) => void;
}

const ComplexMatchingQuestion: React.FC<ComplexMatchingQuestionProps> = ({
  question,
  addCategory,
  deleteCategory,
  updateCategory,
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
}) => {
  const handleCategoryNameChange = (categoryId: number, name: string) => {
    updateCategory(question.id, categoryId, { name });
  };

  const handleItemContentChange = (
    categoryId: number,
    itemId: number,
    content: string,
  ) => {
    updateItemInCategory(question.id, categoryId, itemId, { content });
  };

  return (
    <div className="mt-2">
      {question.categories?.map((category) => (
        <div key={category.id} className="mt-4">
          <div className="flex items-center">
            <input
              type="text"
              value={category.name}
              onChange={(e) =>
                handleCategoryNameChange(category.id, e.target.value)
              }
              className="w-rounded mr-2 border p-2"
              placeholder="Enter category name..."
            />
            <button
              onClick={() => deleteCategory(question.id, category.id)}
              className="text-sm text-black"
            >
              &times;
            </button>
          </div>
          {category.items.map((item) => (
            <div key={item.id} className="mt-2 flex items-center">
              <input
                type="text"
                value={item.content}
                onChange={(e) =>
                  handleItemContentChange(category.id, item.id, e.target.value)
                }
                className="mr-2 w-full rounded border p-2"
                placeholder="Enter item content..."
              />
              <button
                onClick={() =>
                  deleteItemFromCategory(question.id, category.id, item.id)
                }
                className="text-black"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            onClick={() => addItemToCategory(question.id, category.id)}
            className="mt-2 rounded border bg-sciquelTeal px-2 py-1 text-sm text-white"
          >
            Add Item
          </button>
        </div>
      ))}
      <button
        onClick={() => addCategory(question.id)}
        className="mt-2 rounded border bg-sciquelTeal px-2 py-1 text-sm text-white"
      >
        Add Category
      </button>
    </div>
  );
};

export default ComplexMatchingQuestion;