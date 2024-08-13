import React, { useState } from "react";
import ComplexMatchingQuestion from "./ComplexMatchingQuestion";
import DirectMatchingQuestion from "./DirectMatchingQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import SelectAllQuestion from "./SelectAllQuestion";
import TrueOrFalseQuestion from "./TrueOrFalseQuestion";

export interface Choice {
  id: number;
  content: string;
  isCorrect: boolean;
}

export interface MatchingPair {
  id: number;
  left: string;
  right: string;
}

export interface TrueOrFalseQuestion {
  id: number;
  content: string;
  isTrue: boolean;
}

export interface MatchingCategory {
  id: number;
  name: string;
  items: { id: number; content: string }[];
}

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "DIRECT_MATCHING"
  | "COMPLEX_MATCHING"
  | "SELECT_ALL";

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  choices?: Choice[];
  pairs?: MatchingPair[];
  trueOrFalseQuestions?: TrueOrFalseQuestion[];
  categories?: MatchingCategory[];
  options?: { id: number; content: string }[];
  correct_answers?: number[];
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
          { id: nextId + 1, content: "", isCorrect: false },
          { id: nextId + 2, content: "", isCorrect: false },
          { id: nextId + 3, content: "", isCorrect: false },
        ],
      },
    ]);
    setNextId(nextId + 4);
  };

  const updateQuestion = (id: number, updatedQuestion: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updatedQuestion } : q)),
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
                { id: nextId, content: "", isTrue: true },
              ],
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
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
              trueOrFalseQuestions: (q.trueOrFalseQuestions || []).filter(
                (tf) => tf.id !== tfQuestionId,
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
              pairs: [...(q.pairs || []), { id: nextId, left: "", right: "" }],
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
  };

  const deletePair = (questionId: number, pairId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              pairs: (q.pairs || []).filter((p) => p.id !== pairId),
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
              pairs: (q.pairs || []).map((p) =>
                p.id === pairId ? { ...p, ...updatedPair } : p,
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
                { id: nextId, name: "", items: [] },
              ],
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
  };

  const deleteCategory = (questionId: number, categoryId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              categories: (q.categories || []).filter(
                (c) => c.id !== categoryId,
              ),
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
              categories: (q.categories || []).map((c) =>
                c.id === categoryId ? { ...c, ...updatedCategory } : c,
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
              categories: (q.categories || []).map((c) =>
                c.id === categoryId
                  ? {
                      ...c,
                      items: [...(c.items || []), { id: nextId, content: "" }],
                    }
                  : c,
              ),
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
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
              categories: (q.categories || []).map((c) =>
                c.id === categoryId
                  ? {
                      ...c,
                      items: (c.items || []).map((i) =>
                        i.id === itemId ? { ...i, ...updatedItem } : i,
                      ),
                    }
                  : c,
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
              categories: (q.categories || []).map((c) =>
                c.id === categoryId
                  ? {
                      ...c,
                      items: (c.items || []).filter((i) => i.id !== itemId),
                    }
                  : c,
              ),
            }
          : q,
      ),
    );
  };

  const deleteQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const addChoice = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: [
                ...(q.choices || []),
                { id: nextId, content: "", isCorrect: false },
              ],
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
  };

  const deleteChoice = (questionId: number, choiceId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: (q.choices || []).filter((c) => c.id !== choiceId),
            }
          : q,
      ),
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
              choices: (q.choices || []).map((c) =>
                c.id === choiceId ? { ...c, ...updatedChoice } : c,
              ),
            }
          : q,
      ),
    );
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), { id: nextId, content: "" }],
            }
          : q,
      ),
    );
    setNextId(nextId + 1);
  };

  const deleteOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: (q.options || []).filter((o) => o.id !== optionId),
              correct_answers: (q.correct_answers || []).filter(
                (id) => id !== optionId,
              ),
            }
          : q,
      ),
    );
  };

  const updateOption = (
    questionId: number,
    optionId: number,
    updatedOption: Partial<{ content: string }>,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: (q.options || []).map((o) =>
                o.id === optionId ? { ...o, ...updatedOption } : o,
              ),
            }
          : q,
      ),
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Trivia Questions</h1>
      {questions.map((question) => (
        <div key={question.id} className="mt-4">
          <select
            value={question.type}
            onChange={(e) =>
              updateQuestion(question.id, {
                type: e.target.value as QuestionType,
              })
            }
            className="mr-2 rounded border p-2"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True or False</option>
            <option value="DIRECT_MATCHING">Matching</option>
            <option value="COMPLEX_MATCHING">Multiple Matching</option>
            <option value="SELECT_ALL">Select All</option>
          </select>
          <button
            onClick={() => deleteQuestion(question.id)}
            className="px-2 py-2 text-black"
          >
            &times;
          </button>
          {question.type === "MULTIPLE_CHOICE" && (
            <MultipleChoiceQuestion
              question={question}
              updateQuestion={updateQuestion}
              addChoice={addChoice}
              deleteChoice={deleteChoice}
              updateChoice={updateChoice}
            />
          )}
          {question.type === "TRUE_FALSE" && (
            <TrueOrFalseQuestion
              question={question}
              updateQuestion={updateQuestion}
              addTrueOrFalseQuestion={addTrueOrFalseQuestion}
              deleteTrueOrFalseQuestion={deleteTrueOrFalseQuestion}
            />
          )}
          {question.type === "DIRECT_MATCHING" && (
            <DirectMatchingQuestion
              question={question}
              updateQuestion={updateQuestion}
              addPair={addPair}
              deletePair={deletePair}
              updatePair={updatePair}
            />
          )}
          {question.type === "COMPLEX_MATCHING" && (
            <ComplexMatchingQuestion
              question={question}
              updateQuestion={updateQuestion}
              addCategory={addCategory}
              deleteCategory={deleteCategory}
              updateCategory={updateCategory}
              addItemToCategory={addItemToCategory}
              updateItemInCategory={updateItemInCategory}
              deleteItemFromCategory={deleteItemFromCategory}
            />
          )}
          {question.type === "SELECT_ALL" && (
            <SelectAllQuestion
              question={question}
              updateQuestion={updateQuestion}
              addOption={addOption}
              deleteOption={deleteOption}
              updateOption={updateOption}
            />
          )}
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