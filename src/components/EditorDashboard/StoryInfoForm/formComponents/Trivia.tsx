"use client";

import React, { useState } from "react";

interface Choice {
  id: number;
  content: string;
  isCorrect: boolean;
}

interface MatchingPair {
  id: number;
  left: string;
  right: string;
}

interface TrueOrFalseQuestion {
  id: number;
  content: string;
  isTrue: boolean;
}

interface MatchingCategory {
  id: number;
  name: string;
  items: { id: number; content: string }[];
}

interface Question {
  id: number;
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "DIRECT_MATCHING"
    | "COMPLEX_MATCHING";
  content: string;
  choices?: Choice[];
  pairs?: MatchingPair[];
  trueOrFalseQuestions?: TrueOrFalseQuestion[];
  categories?: MatchingCategory[];
}

const Trivia: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextId, setNextId] = useState(1);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: nextId,
        type: "MULTIPLE_CHOICE",
        content: "",
        choices: [
          { id: 0, content: "", isCorrect: false },
          { id: 1, content: "", isCorrect: false },
          { id: 2, content: "", isCorrect: false },
        ],
      },
    ]);
    setNextId(nextId + 1);
  };

  const updateQuestion = (id: number, updatedQuestion: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q)),
    );
  };

  const updateChoice = (
    questionId: number,
    choiceId: number,
    updatedChoice: Partial<Choice>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices?.map((choice) =>
                choice.id === choiceId
                  ? { ...choice, ...updatedChoice }
                  : choice,
              ),
            }
          : q,
      ),
    );
  };

  const addChoice = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: [
                ...(q.choices || []),
                { id: Date.now(), content: "", isCorrect: false },
              ],
            }
          : q,
      ),
    );
  };

  const deleteChoice = (questionId: number, choiceId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices?.filter((choice) => choice.id !== choiceId),
            }
          : q,
      ),
    );
  };

  const updatePair = (
    questionId: number,
    pairId: number,
    updatedPair: Partial<MatchingPair>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              pairs: q.pairs?.map((pair) =>
                pair.id === pairId ? { ...pair, ...updatedPair } : pair,
              ),
            }
          : q,
      ),
    );
  };

  const addPair = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              pairs: [
                ...(q.pairs || []),
                { id: Date.now(), left: "", right: "" },
              ],
            }
          : q,
      ),
    );
  };

  const deletePair = (questionId: number, pairId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              pairs: q.pairs?.filter((pair) => pair.id !== pairId),
            }
          : q,
      ),
    );
  };

  const updateTrueOrFalseQuestion = (
    questionId: number,
    tfQuestionId: number,
    updatedTFQuestion: Partial<TrueOrFalseQuestion>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              trueOrFalseQuestions: q.trueOrFalseQuestions?.map((tfQuestion) =>
                tfQuestion.id === tfQuestionId
                  ? { ...tfQuestion, ...updatedTFQuestion }
                  : tfQuestion,
              ),
            }
          : q,
      ),
    );
  };

  const addTrueOrFalseQuestion = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              trueOrFalseQuestions: [
                ...(q.trueOrFalseQuestions || []),
                { id: Date.now(), content: "", isTrue: false },
              ],
            }
          : q,
      ),
    );
  };

  const deleteTrueOrFalseQuestion = (
    questionId: number,
    tfQuestionId: number,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              trueOrFalseQuestions: q.trueOrFalseQuestions?.filter(
                (tfQuestion) => tfQuestion.id !== tfQuestionId,
              ),
            }
          : q,
      ),
    );
  };

  const addCategory = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: [
                ...(q.categories || []),
                { id: Date.now(), name: "", items: [] },
              ],
            }
          : q,
      ),
    );
  };

  const updateCategory = (
    questionId: number,
    categoryId: number,
    updatedCategory: Partial<MatchingCategory>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: q.categories?.map((category) =>
                category.id === categoryId
                  ? { ...category, ...updatedCategory }
                  : category,
              ),
            }
          : q,
      ),
    );
  };

  const deleteCategory = (questionId: number, categoryId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: q.categories?.filter(
                (category) => category.id !== categoryId,
              ),
            }
          : q,
      ),
    );
  };

  const addItemToCategory = (questionId: number, categoryId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: q.categories?.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      items: [
                        ...category.items,
                        { id: Date.now(), content: "" },
                      ],
                    }
                  : category,
              ),
            }
          : q,
      ),
    );
  };

  const updateItemInCategory = (
    questionId: number,
    categoryId: number,
    itemId: number,
    updatedItem: Partial<{ content: string }>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: q.categories?.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      items: category.items.map((item) =>
                        item.id === itemId ? { ...item, ...updatedItem } : item,
                      ),
                    }
                  : category,
              ),
            }
          : q,
      ),
    );
  };

  const deleteItemFromCategory = (
    questionId: number,
    categoryId: number,
    itemId: number,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: q.categories?.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      items: category.items.filter(
                        (item) => item.id !== itemId,
                      ),
                    }
                  : category,
              ),
            }
          : q,
      ),
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const renderChoices = (question: Question) => {
    return (
      <div className="mt-2">
        <input
          type="text"
          value={question.content}
          onChange={(e) =>
            updateQuestion(question.id, { content: e.target.value })
          }
          className="mb-2 w-full rounded border p-2"
          placeholder="Enter question content..."
        />
        {question.choices?.map((choice) => (
          <div key={choice.id} className="mt-2 flex items-center">
            <input
              type="text"
              value={choice.content}
              onChange={(e) =>
                updateChoice(question.id, choice.id, {
                  content: e.target.value,
                })
              }
              className="mr-2 w-full rounded border p-2"
              placeholder="Enter choice content..."
            />
            <input
              type="checkbox"
              checked={choice.isCorrect}
              onChange={(e) =>
                updateChoice(question.id, choice.id, {
                  isCorrect: e.target.checked,
                })
              }
              className="mr-2"
            />
            <button
              onClick={() => deleteChoice(question.id, choice.id)}
              className="text-sciquelTeal"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={() => addChoice(question.id)}
          className="mt-2 rounded bg-sciquelTeal px-2 py-1 text-sm text-white"
        >
          Add Choice
        </button>
      </div>
    );
  };

  const renderMatchingPairs = (question: Question) => {
    return (
      <div className="mt-2">
        {question.pairs?.map((pair) => (
          <div key={pair.id} className="mt-2 flex items-center">
            <input
              type="text"
              value={pair.left}
              onChange={(e) =>
                updatePair(question.id, pair.id, {
                  left: e.target.value,
                })
              }
              className="mr-2 w-full rounded border p-2"
              placeholder="Enter left content..."
            />
            <span className="mr-2">=</span>
            <input
              type="text"
              value={pair.right}
              onChange={(e) =>
                updatePair(question.id, pair.id, {
                  right: e.target.value,
                })
              }
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

  const renderTrueOrFalseQuestions = (question: Question) => {
    return (
      <div className="mt-2">
        {question.trueOrFalseQuestions?.map((tfQuestion) => (
          <div key={tfQuestion.id} className="mt-2 flex items-center">
            <input
              type="text"
              value={tfQuestion.content}
              onChange={(e) =>
                updateTrueOrFalseQuestion(question.id, tfQuestion.id, {
                  content: e.target.value,
                })
              }
              className="mr-2 w-full rounded border p-2"
              placeholder="Enter a true or false statement..."
            />
            <select
              value={tfQuestion.isTrue.toString()}
              onChange={(e) =>
                updateTrueOrFalseQuestion(question.id, tfQuestion.id, {
                  isTrue: e.target.value === "true",
                })
              }
              className="mr-2 rounded border p-2"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
            <button
              onClick={() =>
                deleteTrueOrFalseQuestion(question.id, tfQuestion.id)
              }
              className="text-sciquelTeal"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          onClick={() => addTrueOrFalseQuestion(question.id)}
          className="mt-2 rounded bg-sciquelTeal px-2 py-1 text-sm text-white"
        >
          Add Statement
        </button>
      </div>
    );
  };

  const renderCategories = (question: Question) => {
    return (
      <div className="mt-2">
        {question.categories?.map((category) => (
          <div key={category.id} className="mt-4">
            <div className="flex items-center">
              <input
                type="text"
                value={category.name}
                onChange={(e) =>
                  updateCategory(question.id, category.id, {
                    name: e.target.value,
                  })
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
                    updateItemInCategory(question.id, category.id, item.id, {
                      content: e.target.value,
                    })
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Trivia Questions</h1>
      {questions.map((question) => (
        <div key={question.id} className="mt-4 border-b pb-4">
          <select
            value={question.type}
            onChange={(e) =>
              updateQuestion(question.id, { type: e.target.value as any })
            }
            className="mb-2 rounded border p-2"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True or False</option>
            <option value="DIRECT_MATCHING">Matching</option>
            <option value="COMPLEX_MATCHING">Multiple Matching</option>
          </select>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="px-2 py-2 text-black"
          >
            &times;
          </button>
          {question.type === "MULTIPLE_CHOICE" && renderChoices(question)}
          {question.type === "TRUE_FALSE" &&
            renderTrueOrFalseQuestions(question)}
          {question.type === "DIRECT_MATCHING" && renderMatchingPairs(question)}
          {question.type === "COMPLEX_MATCHING" && renderCategories(question)}
        </div>
      ))}
      <button
        onClick={addQuestion}
        className="mt-4 rounded bg-sciquelTeal px-3 py-2 text-sm text-white"
      >
        Add Question
      </button>
    </div>
  );
};

export default Trivia;
