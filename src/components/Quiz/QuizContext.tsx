"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface QuizContextType {
  preQuizAnswers: any; // Adjust the type as needed
  setPreQuizAnswers: React.Dispatch<React.SetStateAction<any>>; // Adjust the type as needed
  solutionList: any; // Adjust the type as needed
  setSolutionList: React.Dispatch<React.SetStateAction<any>>; // Adjust the type as needed
  quizComplete: boolean; // Adjust the type as needed
  setQuizComplete: React.Dispatch<React.SetStateAction<boolean>>; // Adjust the type as needed
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
}

interface QuizProviderProps {
  children: ReactNode;
}

export function QuizProvider({ children }: QuizProviderProps) {
  const [preQuizAnswers, setPreQuizAnswers] = useState<any>(null); // Adjust the type as needed
  const [solutionList, setSolutionList] = useState<any>(null); // Adjust the type as needed
  const [quizComplete, setQuizComplete] = useState(false);

  return (
    <QuizContext.Provider
      value={{
        preQuizAnswers,
        setPreQuizAnswers,
        solutionList,
        setSolutionList,
        quizComplete,
        setQuizComplete,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
