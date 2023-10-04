"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface QuizContextType {
  preQuizAnswers: any;
  setPreQuizAnswers: React.Dispatch<React.SetStateAction<any>>;
  solutionList: any;
  setSolutionList: React.Dispatch<React.SetStateAction<any>>;
  quizComplete: boolean; 
  setQuizComplete: React.Dispatch<React.SetStateAction<boolean>>; 
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
  const [preQuizAnswers, setPreQuizAnswers] = useState<any>(null); 
  const [solutionList, setSolutionList] = useState<any>(null);
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
