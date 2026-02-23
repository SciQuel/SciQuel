import env from "@/lib/env";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
  quizQuestionId?: string;
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
}

interface QuizApiResponse {
  quiz_question_id: string;
  sub_header: string;
  question_type: QuestionType;
  max_score: number;
  message?: string;
}

const Trivia: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextId, setNextId] = useState(1);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState<Set<number>>(new Set());
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    void getCurrentQuizzes(setQuestions, setNextId);
  }, []);

  const addQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

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

  const handleSave = async (
    question: Question,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    try {
      const result = await submitQuizMap(question, e);

      // Update the question with the returned quiz_question_id if it's a new question
      if (
        result &&
        "data" in result &&
        result.data?.quiz_question_id &&
        !question.quizQuestionId
      ) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === question.id
              ? { ...q, quizQuestionId: result.data.quiz_question_id }
              : q,
          ),
        );
      }

      setSavedQuestions((prev) => new Set(prev).add(question.id));

      setTimeout(() => {
        setSavedQuestions((prev) => {
          const updated = new Set(prev);
          updated.delete(question.id);
          return updated;
        });
      }, 1500);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question. Please check the console for details.");
    }
  };

  return (
    <div className="container mx-auto py-4">
      <h1
        className="text-l flex cursor-pointer items-center gap-1"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        Trivia Questions
        <span className="inline-flex h-8 w-8 items-center justify-center">
          {isCollapsed ? (
            <svg
              className="h-full w-full"
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
                    type="button"
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                    onClick={(e) => {
                      e.preventDefault();
                      const qid = question.quizQuestionId;
                      console.log("Deleting question:", qid);

                      void (async () => {
                        try {
                          if (qid) {
                            await deleteQuestionFromBackend(qid);
                          } else {
                            console.warn(
                              "No quizQuestionId; performing local delete only",
                            );
                          }
                          deleteQuestion(question.id);
                          setConfirmDeleteId(null);
                        } catch (err) {
                          console.error("Delete error:", err);
                        }
                      })();
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
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
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="rounded bg-sciquelTeal px-3 py-2 text-sm text-white"
                  onClick={(e) => void handleSave(question, e)}
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

// API FUNCTIONS

const urlQuiz = "/api/quizzes/edit";
const storyIdTest = "6488c6f6f5f617c772f6f61a";

/* post or patch */
async function submitQuizMap(
  question: Question,
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
): Promise<{ data: QuizApiResponse } | undefined> {
  e.preventDefault();

  try {
    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return await submitMultipleChoice(question);
      case "SELECT_ALL":
        return await submitSelectAll(question);
      case "DIRECT_MATCHING":
        return await submitDirectMatching(question);
      case "COMPLEX_MATCHING":
        return await submitComplexMatching(question);
      case "TRUE_FALSE":
        return await submitTrueFalse(question);
    }
  } catch (error) {
    console.error("Submit error:", error);
    throw error;
  }
}

async function submitMultipleChoice(question: Question) {
  const { content, choices, type, quizQuestionId } = question;

  const correctIndex = choices?.findIndex((choice) => choice.isCorrect) ?? -1;

  if (correctIndex === -1) {
    alert("Please select a correct answer before saving!");
    throw new Error("No correct answer selected");
  }

  if (!choices || choices.length === 0) {
    alert("Please add at least one choice!");
    throw new Error("No choices provided");
  }

  const options = choices.map((choice) => String(choice.content || ""));
  // const explanations = choices.map(() =>
  //   String(question.explanation || "No explanation provided"),
  // );

  const explanations = question.explanation;

  const payload = {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subheader: "This is a subheader",
    subpart: {
      content_category: ["Content category"],
      question: String(content || ""),
      options: options,
      correct_answer: correctIndex,
      explanations: explanations,
    },
    ...(quizQuestionId && { quiz_question_id: quizQuestionId }),
  };

  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const res = quizQuestionId
      ? await axios.patch(urlQuiz, payload, {
          params: { quiz_question_id: quizQuestionId },
          headers: { "Content-Type": "application/json" },
        })
      : await axios.post(urlQuiz, payload, {
          headers: { "Content-Type": "application/json" },
        });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Request Error:");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Payload:", JSON.stringify(payload, null, 2));
    }
    throw error;
  }
}

async function submitSelectAll(question: Question) {
  const { content, options, type, correct_answers, quizQuestionId } = question;

  const optionIndexChecked = options
    ?.map(({ id }, index) => ({ id, index }))
    .filter(({ id }) => correct_answers?.includes(id))
    .map(({ index }) => index);

  const payload = {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subheader: "This is a subheader",
    subpart: {
      question: content,
      content_category: ["Content category"],
      options: options?.map((option) => option.content),
      correct_answers: optionIndexChecked,
      explanations: options?.map(
        (_, index) => `This is an explanation for option ${index}`, //send whatever explanation multiple times
      ),
    },
    ...(quizQuestionId && { quiz_question_id: quizQuestionId }),
  };

  try {
    const res = quizQuestionId
      ? await axios.patch(urlQuiz, payload, {
          params: { quiz_question_id: quizQuestionId },
          headers: { "Content-Type": "application/json" },
        })
      : await axios.post(urlQuiz, payload, {
          headers: { "Content-Type": "application/json" },
        });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("SELECT_ALL Error:", error.response?.data);
    }
    throw error;
  }
}

async function submitDirectMatching(question: Question) {
  const { content, pairs, type, quizQuestionId } = question;

  const correctAnswer = (question.pairs || []).map((_, index) => index);
  console.log("PAIRS:", pairs);
  const payload = {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subpart: {
      question: content,
      content_category: pairs?.map(
        (_, index) => `This is a content_category for pair ${index}`,
      ),
      categories: pairs?.map((pair) => pair.left),
      options: pairs?.map((pair) => pair.right),
      correct_answers: correctAnswer,
      explanations: pairs?.map(
        (val, index) =>
          val.explanation || `This is an explanation for pair ${index}`,
      ),
    },
    subheader: "This is a subheader",
    ...(quizQuestionId && { quiz_question_id: quizQuestionId }),
  };

  try {
    const res = quizQuestionId
      ? await axios.patch(urlQuiz, payload, {
          params: { quiz_question_id: quizQuestionId },
          headers: { "Content-Type": "application/json" },
        })
      : await axios.post(urlQuiz, payload, {
          headers: { "Content-Type": "application/json" },
        });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("DIRECT_MATCHING Error:", error.response?.data);
    }
    throw error;
  }
}

async function submitComplexMatching(question: Question) {
  const { categories, categoryItems, content, quizQuestionId } = question;

  const categoriesIdMap =
    categories?.reduce<{ [key: number]: number[] }>((prev, { id }) => {
      prev[id] = [];
      return prev;
    }, {}) ?? {};

  categoryItems?.forEach(({ categoryId }, index) => {
    categoriesIdMap[categoryId].push(index);
  });

  const correct_answers =
    categories?.map(({ id }) => categoriesIdMap[id]) ?? [];

  const payload = {
    story_id: storyIdTest,
    question_type: "COMPLEX_MATCHING",
    max_score: 10,
    subpart: {
      content_category: categories?.map(
        (_, index) => `This is a content_category for category ${index}`,
      ),
      question: content,
      categories: categories?.map(({ name }) => name),
      options: categoryItems?.map(({ content }) => content),
      correct_answers: correct_answers,
      explanations: [
        ...(categories?.map(
          (val, index) =>
            val.explanation || `This is an explanation for category ${index}`,
        ) || []),
        "This is an explanation for the options placeholder",
      ],
    },
    subheader: "This is a subheader",
    ...(quizQuestionId && { quiz_question_id: quizQuestionId }),
  };

  try {
    const res = quizQuestionId
      ? await axios.patch(urlQuiz, payload, {
          params: { quiz_question_id: quizQuestionId },
          headers: { "Content-Type": "application/json" },
        })
      : await axios.post(urlQuiz, payload, {
          headers: { "Content-Type": "application/json" },
        });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("COMPLEX_MATCHING Error:", error.response?.data);
    }
    throw error;
  }
}

async function submitTrueFalse(question: Question) {
  const { trueOrFalseQuestions, type, quizQuestionId } = question;

  const payload = {
    story_id: storyIdTest,
    question_type: type,
    max_score: 10,
    subpart: {
      content_category: trueOrFalseQuestions?.map(
        (_, index) => `This is a content_category for question ${index}`,
      ),
      questions: trueOrFalseQuestions?.map((value) => value.content),
      explanations: trueOrFalseQuestions?.map(
        (tf) => tf.explanation || "No explanation provided",
      ),
      correct_answers: trueOrFalseQuestions?.map((value) => value.isTrue),
    },
    subheader: "This is a subheader",
    ...(quizQuestionId && { quiz_question_id: quizQuestionId }),
  };

  try {
    const res = quizQuestionId
      ? await axios.patch(urlQuiz, payload, {
          params: { quiz_question_id: quizQuestionId },
          headers: { "Content-Type": "application/json" },
        })
      : await axios.post(urlQuiz, payload, {
          headers: { "Content-Type": "application/json" },
        });

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("TRUE_FALSE Error:", error.response?.data);
    }
    throw error;
  }
}

async function getCurrentQuizzes(
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>,
  setNextId: React.Dispatch<React.SetStateAction<number>>,
) {
  try {
    const res = await axios.get(
      `${env.NEXT_PUBLIC_SITE_URL}/api/quizzes/edit?story_id=${storyIdTest}`,
    );

    if (res.status !== 200) {
      console.error("Failed to fetch quizzes");
      return;
    }

    const body = res.data?.quizzes;
    if (!Array.isArray(body)) {
      console.error("Unexpected response format:", res.data);
      return;
    }

    let maxId = 1;
    console.log("RES", res.data);
    const mappedQuestions: Question[] = body.map((quiz: any, index: number) => {
      const type = quiz.question_type as QuestionType;
      const quizQuestionId = quiz.quiz_question_id || quiz._id;
      const baseId = (index + 1) * 1000;
      maxId = Math.max(maxId, baseId + 100);

      switch (type) {
        case "MULTIPLE_CHOICE": {
          const choices =
            quiz.options?.map((opt: string, idx: number) => ({
              id: baseId + idx + 1,
              content: opt,
              isCorrect: idx === quiz.correctAnswer,
            })) || [];

          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.question || "",
            explanation: Array.isArray(quiz.explanations)
              ? quiz.explanations[0]
              : typeof quiz.explanations === "string"
              ? quiz.explanations
              : "",
            choices,
          };
        }

        case "SELECT_ALL": {
          const options =
            quiz.options?.map((opt: string, idx: number) => ({
              id: baseId + idx + 1,
              content: opt,
            })) || [];

          const correct_answers = Array.isArray(quiz.correctAnswer)
            ? quiz.correctAnswer.map((idx: number) => baseId + idx + 1)
            : [];

          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.question || "",
            explanation: Array.isArray(quiz.explanations)
              ? quiz.explanations[0]
              : "",
            options,
            correct_answers,
          };
        }

        case "DIRECT_MATCHING": {
          const pairs =
            quiz.categories?.map((cat: string, idx: number) => ({
              id: baseId + idx + 1,
              left: cat,
              right: quiz.options?.[idx] || "",
              explanation: Array.isArray(quiz.explanations)
                ? quiz.explanations[idx]
                : "",
            })) || [];

          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.question || "",
            pairs,
          };
        }

        case "COMPLEX_MATCHING": {
          const categories =
            quiz.categories?.map((cat: string, idx: number) => ({
              id: baseId + idx + 1,
              name: cat,
              explanation: Array.isArray(quiz.explanations)
                ? quiz.explanations[idx] || ""
                : "",
              items: [],
            })) || [];

          const categoryItems: MatchingItem[] = [];
          let itemIdCounter = baseId + 1000;

          if (Array.isArray(quiz.correctAnswer)) {
            quiz.correctAnswer.forEach(
              (optionIndices: string, categoryIdx: number) => {
                const indicies = optionIndices.split(" ");
                const categoryId = baseId + categoryIdx + 1;
                indicies.forEach((optionIdx: string) => {
                  if (
                    quiz.options &&
                    optionIdx >= "0" &&
                    optionIdx < quiz.options.length
                  ) {
                    categoryItems.push({
                      id: itemIdCounter++,
                      categoryId: categoryId,
                      content: quiz.options[optionIdx],
                    });
                  }
                });
              },
            );
          }

          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.question || "",
            categories,
            categoryItems,
          };
        }

        case "TRUE_FALSE": {
          const trueOrFalseQuestions =
            quiz.questions?.map((q: string, idx: number) => ({
              id: baseId + idx + 1,
              content: q,
              isTrue: Array.isArray(quiz.correctAnswer)
                ? Boolean(quiz.correctAnswer[idx])
                : false,
              explanation: Array.isArray(quiz.explanations)
                ? quiz.explanations[idx]
                : "",
            })) || [];

          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.sub_header || "",
            trueOrFalseQuestions,
          };
        }

        default:
          return {
            id: baseId,
            type,
            quizQuestionId,
            content: quiz.question || "",
          };
      }
    });

    setQuestions(mappedQuestions);
    setNextId(maxId + 1);
    console.log("Loaded quizzes:", mappedQuestions);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
  }
}

async function deleteQuestionFromBackend(quizQuestionId: string) {
  console.log("DELETE quiz_question_id:", quizQuestionId);

  try {
    const response = await axios.delete(urlQuiz, {
      params: {
        story_id: storyIdTest,
        quiz_question_id: quizQuestionId,
      },
    });

    console.log("Delete successful:", response.data);
    return response;
  } catch (error) {
    throw error;
  }
}

/* 
To - Do: 
- Fix save/delete question functionality.  
- Changing question type prevents saving question. 
- Slow loading performance. 
*/
