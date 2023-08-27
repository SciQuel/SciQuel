import Quiz from "@/components/Quiz";
import { type OneMatchQuestion, type Question } from "@/lib/Question";
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

const questionList_OM2: OneMatchQuestion[] = [
  {
    questionText:
      "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    matchStatements: ["statement1", "statement2", "statement3"],
    choices: ["userAnswer1", "userAnswer2", "userAnswer3"],
    correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
    answerExplanation: [
      "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ],
  },
  {
    questionText: "Match each word to its category.",
    matchStatements: [
      "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      "statement2",
      "statement3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
    choices: [
      "userAnswer2-1",
      "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
    correctAnswer: [
      "userAnswer2-1",
      "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    ],
    answerExplanation: [
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    ],
  },
  {
    questionText: "Match each word to its category.",
    matchStatements: [
      "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
      "statement2",
      "statement3",
    ],
    choices: ["userAnswer3-2", "userAnswer3-3", "userAnswer3-1"],
    correctAnswer: ["userAnswer3-1", "userAnswer3-2", "userAnswer3-3"],
    answerExplanation: [
      "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    ],
  },
];

// const questionList_OM1: Question[] = [
//   {
//     questionText:
//       "Match each word to its category. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     choices: [
//       "statement1; userAnswer1",
//       "statement2; userAnswer2",
//       "statement3; userAnswer3",
//     ],
//     correctAnswer: ["userAnswer1", "userAnswer2", "userAnswer3"],
//     answerExplanation: [
//       "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     ],
//   },
//   // {
//   //   questionText: "Match each word to its category.",
//   //   choices: [
//   //     "statement1; userAnswer2-3",
//   //     "statement2; userAnswer2-2",
//   //     "statement3; userAnswer2-1",
//   //   ],
//   //   correctAnswer: ["userAnswer2-1", "userAnswer2-2", "userAnswer2-3"],
//   //   answerExplanation: [
//   //     "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   //     "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   //     "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   //   ],
//   // },
//   {
//     questionText: "Match each word to its category.",
//     choices: [
//       "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua; userAnswer2-1",
//       "statement2; userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
//       "statement3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua; userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
//     ],
//     correctAnswer: [
//       "userAnswer2-1",
//       "userAnswer2-2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
//       "userAnswer2-3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
//     ],
//     answerExplanation: [
//       "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
//       "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
//       "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
//     ],
//   },
//   {
//     questionText: "Match each word to its category.",
//     choices: [
//       "statement1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua; userAnswer3-2",
//       "statement2; userAnswer3-3",
//       "statement3; userAnswer3-1",
//     ],
//     correctAnswer: ["userAnswer3-1", "userAnswer3-2", "userAnswer3-3"],
//     answerExplanation: [
//       "Explanation for statement 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Explanation for statement 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//       "Explanation for statement 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     ],
//   },
// ];

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
        quizQuestionType={"One Match"}
        questionList={questionList_OM2}
      />
      <div className="mb-16 mt-16"></div>
      <Quiz
        isPreQuiz={false}
        topic={"BIOLOGY"}
        quizObjective={"How much do you know already know about microglia?"}
        quizQuestionType={"One Match"}
        questionList={questionList_OM2}
      />
      <div className="mb-16 mt-16"></div>
    </div>
  );
};

export default TestPage;
