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
  explanation?: string;
}

export interface TrueOrFalseQuestion {
  id: number;
  content: string;
  isTrue: boolean;
  explanation?: string;
}

export interface MatchingCategory {
  id: number;
  name: string;
  explanation: string;
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
  explanation?: string;
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
                { id: nextId, name: "", items: [], explanation: "" },
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
              categoryItems: (q.categoryItems || []).filter(
                (item) => item.id !== itemId,
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

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());

  const handleSave = (
    question: Question,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    submitQuizMap(question, e);

    setSavedQuestions((prev) => new Set(prev).add(question.id));

    setTimeout(() => {
      setSavedQuestions((prev) => {
        const updated = new Set(prev);
        updated.delete(question.id);
        return updated;
      });
    }, 1500);
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-4">
      <h1
        className="text-l flex cursor-pointer items-center gap-1" // Changed ml-2 to gap-1 for consistent spacing
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        Trivia Questions
        <span className="inline-flex h-8 w-8 items-center justify-center">
          {" "}
          {/* Increased size to h-8 w-8 */}
          {isCollapsed ? (
            <svg
              className="h-full w-full" // Slightly smaller than container for padding
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          ) : (
            <svg
              className="h-full w-full"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </span>
      </h1>
      {!isCollapsed && (
        <div>
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
                onClick={() => setConfirmDeleteId(question.id)}
                className="px-2 py-2 text-black hover:text-red-500"
              >
                &times;
              </button>

              {confirmDeleteId === question.id && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                  <span>Delete this question?</span>
                  <button
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                    onClick={() => {
                      deleteQuestion(question.id);
                      setConfirmDeleteId(null);
                    }}
                  >
                    Yes
                  </button>
                  <button
                    className="rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    No
                  </button>
                </div>
              )}

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
              {/* Right Side: Explanation Box */}
              {/* <div className="mt-4">
              <textarea
                value={question.explanation || ""}
                onChange={(e) =>
                  updateQuestion(question.id, { explanation: e.target.value })
                }
                className="w-full p-2 border rounded"
                placeholder="Enter explanation here"
              />
            </div> */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="rounded bg-sciquelTeal px-3 py-2 text-sm text-white"
                  onClick={(e) => handleSave(question, e)}
                >
                  Save quiz question
                </button>

                {savedQuestions.has(question.id) && (
                  <span className="text-lg text-green-500">✔</span>
                )}
              </div>
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
      )}
    </div>
  );
};

export default Trivia;

/** test case here */
async function submitQuizMap(
  question: Question,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) {
  e.preventDefault();
  let res = {};
  switch (question.type) {
    case "MULTIPLE_CHOICE":
      res = await submitMultipleChoice(question);
      break;
    case "SELECT_ALL":
      res = await submitSelectAll(question);
      break;
    case "DIRECT_MATCHING":
      res = await submitDirectMatching(question);
      break;
    case "COMPLEX_MATCHING":
      res = await submitComplexMatching(question);
      break;
    case "TRUE_FALSE":
      res = await submitTrueFalse(question);
  }
  console.log(res);
}
const urlQuiz = "/api/quizzes/edit";
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

/**
 * *Fix content_category and question are different content_category is a group question is a child
 * of the group there are explanations in every type question, the amount is based on type story_id
 * is required max_score is optional default is 10 all type question is put in subpart missing
 * subheader
 */

/**
 * Submit multiple choice question type
 *
 * @param question
 */
async function submitMultipleChoice(question: Question) {
  /**
   * Missing content_category, explainations The should be an explain for each choice add subheader
   * add content
   */
  const { content, choices, type } = question;
  const res = await axios.post(urlQuiz, {
    story_id: storyIdTest,
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
      //explanations for each choice
      explanations: choices?.map(
        () => question.explanation || "No explanation provided",
      ),
    },
  });
  return res;
}

/**
 * Submit select all question type
 *
 * @param question
 */
async function submitSelectAll(question: Question) {
  /**
   * Missing content_category, explainations The should be an explain for each option add subheader
   * add content
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
    story_id: storyIdTest,
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

/**
 * Submit direct matching question type
 *
 * @param question
 */
async function submitDirectMatching(question: Question) {
  const { content, pairs, type } = question;

  // The correct answers should be the original indices before shuffling
  // Since rightSideOrder in the component maintains the original order in its 'number' property,
  // we can use that to determine the correct mapping
  const correctAnswers = (question.pairs || []).map((pair, index) => index);

  const res = await axios.post(urlQuiz, {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subpart: {
      question: content,
      content_category: pairs?.map(
        (val, index) => "This is an content_category for pair " + index,
      ),
      categories: pairs?.map((pair) => pair.left),
      options: pairs?.map((pair) => pair.right),
      // This assumes the right side options will be displayed in shuffled order,
      // and the correct answer is their original position (0, 1, 2, etc.)
      correct_answers: correctAnswers,
      explanations: pairs?.map(
        (val, index) =>
          val.explanation || "This is an explantation for pair " + index,
      ),
    },
    subheader: "This is a subheader",
  });
  return res;
}

/**
 * Submit complex matching question type
 *
 * @param question
 */
async function submitComplexMatching(question: Question) {
  /**
   * Missing content_category, explainations The should be an explain for each option add content
   * add subheader
   */
  const { categories, categoryItems, content } = question;
  //create a map of category id to item index
  const categoriesIdMap =
    categories?.reduce<{ [key: number]: number[] }>((prev, { id }) => {
      prev[id] = [];
      return prev;
    }, {}) ?? {};
  //insert index of item to the catedoryIdMap
  categoryItems?.forEach(({ categoryId }, index) => {
    categoriesIdMap[categoryId].push(index);
  });
  //convert it to ans
  const correct_answers =
    categories?.map(({ id }) => categoriesIdMap[id]) ?? [];
  //correct_answers contains optionId
  const res = await axios.post(urlQuiz, {
    story_id: storyIdTest,
    question_type: "COMPLEX_MATCHING",
    max_score: 10,
    subpart: {
      //content_category for each match (left side)
      content_category: categories?.map(
        (val, index) => "This is an content_category for category " + index,
      ),
      question: content,
      categories: categories?.map(({ name }) => name),
      options: categoryItems?.map(({ content }) => content),
      //index from the categoryItems that should belong to the category position
      //Example: [[1,2],[0]] means category 1 has item 1 and 2, category 2 has item 0
      correct_answers: correct_answers,
      //explanation for each match (left side) plus the placeholder options
      explanations: [
        ...(categories?.map(
          (val, index) => "This is an explanations for category " + index,
        ) || []),
        "This is an explanation for the options place holder",
      ],
    },
    subheader: "This is a subheader",
  });
  return res;
}

/**
 * Submit true false question type
 *
 * @param question
 */
async function submitTrueFalse(question: Question) {
  /** Missing content_category */
  const { trueOrFalseQuestions, type } = question;
  const res = await axios.post(urlQuiz, {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subpart: {
      // content_category for each question
      content_category: trueOrFalseQuestions?.map(
        (value, index) => "This is a content_category for question " + index,
      ),
      questions: trueOrFalseQuestions?.map((value) => value.content),
      explanations: trueOrFalseQuestions?.map(
        (tf) => tf.explanation || "No explanation provided",
      ),
      correct_answers: trueOrFalseQuestions?.map((value) => value.isTrue),
    },
    subheader: "This is a subheader",
  });
  return res;
}
