"use client";

import { use } from "react";
import { useQuizContext, type TrueFalseQuestion } from "../QuizContext";

interface Props {
  question: TrueFalseQuestion;
  index: number;

  answers: boolean[];

  setAnswers: (answerIndex: number, answer: boolean) => void;

  showFeedback: boolean;
}

export default function TrueFalseQuestion({
  question,
  index,
  answers,
  setAnswers,
  showFeedback,
}: Props) {
  return <div>true false question</div>;
}
