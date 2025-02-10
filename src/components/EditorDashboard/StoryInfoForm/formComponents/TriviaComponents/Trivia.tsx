import axios from "axios";
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
  color?: string;
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

export interface MatchingItem {
  id: number;
  categoryId: number;
  content: string;
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
  categoryItems?: MatchingItem[];
  options?: { id: number; content: string }[];
  correct_answers?: number[];
  //wordBank: WordBankItem[]; // Add this to the type definition
}

const Trivia: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextId, setNextId] = useState(1);
  console.log(questions);
  const addQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent form submission

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
              categoryItems: (q.categoryItems || []).filter(
                (citem) => citem.categoryId !== categoryId,
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
      questions.map((q) => {
        return q.id === questionId
          ? {
              ...q,
              categoryItems: [
                ...(q.categoryItems ?? []),
                {
                  id: nextId,
                  content: "",
                  categoryId: categoryId,
                },
              ],
            }
          : q;
      }),
    );
    setNextId(nextId + 1);
  };

  const UpdateItemInCategory = (
    questionId: number,
    //  categoryId: number,
    itemId: number,
    updatedItem: Partial<{ content: string }>,
  ) => {
    setQuestions(
      questions.map((q) => {
        const items = q.categoryItems
          ? q.categoryItems.map((categoryItem) => {
              if (categoryItem.id == itemId) {
                return { ...categoryItem, content: updatedItem.content ?? "" };
              }
              return categoryItem;
            })
          : ([] as MatchingItem[]);

        return q.id === questionId
          ? {
              ...q,
              categoryItems: [...(items ?? [])],
            }
          : q;
      }),
    );
  };

  const positionSwapCatItems = (
    questionId: number,
    index1: number,
    index2: number,
  ) => {
    setQuestions((state) =>
      state.map((question) => {
        if (question.id != questionId) {
          return question;
        }

        const temp = question.categoryItems ? [...question.categoryItems] : [];

        if (index1 < 0 || index2 < 0) {
          return question;
        }

        if (index1 < temp.length && index2 < temp.length) {
          const tempItem = { ...(temp[index1] ?? {}) };
          temp[index1] = temp[index2];
          temp[index2] = tempItem;

          return { ...question, categoryItems: temp };
        }

        return question;
      }),
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
    <div className="container mx-auto py-4">
      <h1 className="text-l">Trivia Questions</h1>
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
            type="button"
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
              updateItemInCategory={UpdateItemInCategory}
              deleteItemFromCategory={deleteItemFromCategory}
              positionSwap={positionSwapCatItems}
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
        type="button"
        onClick={addQuestion}
        className="mt-4 rounded bg-sciquelTeal px-3 py-2 text-sm text-white"
      >
        Add Question
      </button>
    </div>
  );
};

export default Trivia;

/**
 * test case here
 */
const urlQuiz = "/api/quizzes";
const storyIdTest = "6488c6f6f5f617c772f6f61a";
// story_id: ObjectId
// question_type:QuestionType enum
// max_score:number,
// subpart:QuizQuestionCreate,
// subheader:string

// SELECT_ALL:
// {
// 	content_category:string[ ],
// 	question: string,
//  options: string[ ]
//  correct_answers: number[ ]
//  explanations: string[ ]
// }

// COMPLEX_MATCHING:
// {
// 	content_categories:string[ ]
// 	question: string
//  categories: string[ ]
//  options: string[ ]
//  correct_answers: number[ ][ ]
//  explanations: string[ ]
// }

// DIRECT_MATCHING:
// 	{
// 		content_categories:string[ ]
// 		question: string
//    categories: string[ ]
//    options: string[ ]
//    correct_answers: number[ ]
//    explanations: string[ ]
// 	}

//   MULTIPLE_CHOICE:
// {
// 		question: string,
//    options: string[ ]
//    correct_answer: number
//    explanations: string[ ]
//    content_category:string[ ]
// }

// TRUE_FALSE:
// 	{
// 		content_category:string[ ]
// 		questions: string[ ]
//    correct_answers: bool[ ]
//    explanations:string[ ]
// }

/**Fix
 * content_category and question are different
 * content_category is a group
 * question is a child of the group
 * there are explanations in every type question, the amount is based on type
 * story_id is required
 * max_score is optional default is 10
 * all type question is put in subpart
 * missing subheader
 */

/**
 * Submit multiple choice question type
 * @param question
 */
async function submitMultipleChoice(question: Question) {
  /**
   * Missing content_category, explainations
   * The should be an explain for each choice
   */
  const { content, choices, type } = question;
  const res = await axios.post(urlQuiz, {
    question_type: type,
    //optional
    max_score: 10,
    subheader: "This is a subheader",
    subpart: {
      //content_category is array and should only have 1
      content_category: ["Content category"],
      question: content,
      options: choices?.map((choice) => choice.content),
      //index of choice that isCorrect:true
      correct_answer: choices?.findIndex((choice) => choice.isCorrect),
      explanations: choices?.map(
        (choice, index) => "Explains for choice " + index,
      ),
    },
  });
  return res;
}

/**
 * Submit select all question type
 * @param question
 */
async function submitSelectAll(question: Question) {
  /**
   * Missing content_category, explainations
   * The should be an explain for each option
   */
  const { content, options, type, correct_answers } = question;

  //correct_answers contains optionId
  const optionIndexChecked = options
    //convert options to obj array contain id and index
    ?.map(({ id }, index) => ({ id, index }))
    //keep option that correct_answers have the option id
    .filter(({ id, index }) => correct_answers?.includes(id))
    //convert to index array
    .map(({ index }) => index);

  const res = await axios.post(urlQuiz, {
    question_type: type,
    //optional
    max_score: 10,
    subheader: "This is a subheader",
    subpart: {
      question: content,
      //content_category is array and should only have 1
      content_category: ["Content category"],

      options: options?.map((option) => option.content),
      //index of option that is checked, order does not matter
      correct_answers: optionIndexChecked,
      //explanations for each option
      explanations: options?.map(
        (option, index) => "This is a explaination for option " + index,
      ),
    },
  });
  return res;
}
