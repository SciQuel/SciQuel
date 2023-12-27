"use client";

import { StoryTopic } from "@prisma/client";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type QuestionFormat = "multiple choice" | "true/false";

export interface GenericQuestion {
  questionType: QuestionFormat;

  questionText: string;

  questionOptions: string[];

  explanation: string;

  // questions are categorized by "theme"?
  // these will likely not be preset and change with the articles
  categories: string[];

  // we display the percentage of users who got a question correct
  // hope this name isn't confusing
  correctAnswersRatio: number;
}

export interface MultipleChoiceQuestion extends GenericQuestion {
  questionType: "multiple choice";

  answerIndex: number;
}

export interface TrueFalseQuestion extends GenericQuestion {
  questionType: "true/false";

  answers: boolean[];
}

export type AllQuestions = (MultipleChoiceQuestion | TrueFalseQuestion)[];

interface QuizData {
  questions: AllQuestions;

  objective: string;

  topic: StoryTopic;

  shareLinkId: string;
}

interface QuizContextVals {
  preQuizAnswers: (number | boolean | undefined)[];
  setPreQuizAnswers: Dispatch<SetStateAction<(number | boolean | undefined)[]>>;

  quizComplete: boolean;
  setQuizComplete: Dispatch<SetStateAction<boolean>>;

  quizInfo: QuizData;
}

const QuizContext = createContext<QuizContextVals | undefined>(undefined);

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}

interface QuizProviderProps {
  quizInfo: QuizData;
}

export function QuizProvider({
  children,
  quizInfo,
}: PropsWithChildren<QuizProviderProps>) {
  const [preQuizAnswers, setPreQuizAnswers] = useState<
    (number | boolean | undefined)[]
  >([]);

  const [quizComplete, setQuizComplete] = useState(false);

  return (
    <QuizContext.Provider
      value={{
        preQuizAnswers,
        setPreQuizAnswers,

        quizComplete,
        setQuizComplete,

        quizInfo,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
