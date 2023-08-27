import Quiz from "@/components/Quiz";
import { type Question } from "@/lib/Question";
import React from "react";

import "tailwindcss/tailwind.css";
import "../app/globals.css";
import clsx from "clsx";
import { Alegreya_Sans_SC, Quicksand, Source_Serif_4 } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

const alegreyaSansSC = Alegreya_Sans_SC({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-alegreya-sans-sc",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-source-serif-4",
  display: "swap",
});

const questionList_TF1: Question[] = [
  {
    questionText:
      "Mark each statement as true or false. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    choices: [
      "Statement 1: this should be true",
      "Statement 2: this should be false",
      "Statement 3: this should be false",
    ],
    correctAnswer: ["true", "false", "false"],
    answerExplanation: [
      "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ],
  },
  {
    questionText: "Mark each statement as true or false.",
    choices: [
      "Statement 1: this should be false",
      "Statement 2: this should be true",
      "Statement 3: this should be true",
    ],
    correctAnswer: ["false", "true", "true"],
    answerExplanation: [
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    ],
  },
  {
    questionText: "Mark each statement as true or false.",
    choices: [
      "Statement 1: this should be true",
      "Statement 2: this should be false",
      "Statement 3: this should be true",
    ],
    correctAnswer: ["true", "false", "true"],
    answerExplanation: [
      "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ],
  },
];

const TestPage = () => {
  return (
    <div
      className={clsx(
        quicksand.className,
        alegreyaSansSC.variable,
        sourceSerif4.variable,
      )}
      style={{ backgroundColor: "white" }}
    >
      <h1 className="mb-16 mt-16 text-center">
        (This is a temporary page for testing the Quiz component)
      </h1>
      <Quiz
        isPreQuiz={true}
        topic={"BIOLOGY"}
        quizObjective={"How much do you know already know about microglia?"}
        quizQuestionType={"True/False"}
        questionList={questionList_TF1}
      />
      <div className="mb-16 mt-16"></div>
      <Quiz
        isPreQuiz={false}
        topic={"BIOLOGY"}
        quizObjective={"How much do you know already know about microglia?"}
        quizQuestionType={"True/False"}
        questionList={questionList_TF1}
      />
      <div className="mb-16 mt-16"></div>
    </div>
  );
};

export default TestPage;
