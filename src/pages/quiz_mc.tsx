import Quiz from "@/components/Quiz";
import { type Question } from "@/lib/Question";
import React from "react";

import "tailwindcss/tailwind.css";
// import RootLayout from "../app/layout";
import "../app/globals.css";
import Header from "@/components/Header";
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

// export class Question {
//   questionNumber: string;
//   questionText: string;
//   choices: string[];
//   correctAnswer: string[];
//   answerExplanation: string[];

//   constructor(
//     questionNumber: string,
//     questionText: string,
//     choices: string[],
//     correctAnswer: string[],
//     answerExplanation: string[],
//   ) {
//     this.questionNumber = questionNumber;
//     this.questionText = questionText;
//     this.choices = choices;
//     this.correctAnswer = correctAnswer;
//     this.answerExplanation = answerExplanation;
//   }
// }

const questionList_MC1: Question[] = [
  {
    questionNumber: "1",
    questionText: "What are microglia? (this is question #1)",
    choices: [
      "The star-shaped cell that supports communication between neurons",
      "The smallest type of glial cell that makes up about 10% of all brain cells",
      "A type of neuroglia who speeds up the transmission of information",
    ],
    correctAnswer: [
      "The smallest type of glial cell that makes up about 10% of all brain cells",
    ],
    answerExplanation: [
      "Microglia are the smallest type of glial cell that make up about 10% of all brain cells.",
    ],
  },
  {
    questionNumber: "2",
    questionText: "This is an example question (this is question #2)",
    choices: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac sagittis tellus. Nam imperdiet, metus vel fringilla rhoncus, risus sapien mollis metus, ac lobortis velit velit vel magna. Quisque eget pretium nibh. Nulla facilisi. Aenean semper nunc id arcu molestie viverra.",
      "This is also an incorrect answer",
      "This is the correct answer",
    ],
    correctAnswer: ["This is the correct answer"],
    answerExplanation: ["[answer explanation here]"],
  },
  {
    questionNumber: "3",
    questionText: "This is an example question (this is question #3)",
    choices: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac sagittis tellus. Nam imperdiet, metus vel fringilla rhoncus, risus sapien mollis metus, ac lobortis velit velit vel magna. Quisque eget pretium nibh. Nulla facilisi. Aenean semper nunc id arcu molestie viverra.",
      "This is also an incorrect answer",
      "This is the correct answer",
    ],
    correctAnswer: ["This is the correct answer"],
    answerExplanation: ["[answer explanation here]"],
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
      style={{ backgroundColor: "#f8f8ff" }}
    >
      <Header />
      {/* <RootLayout children={<></>} /> */}
      <h1 className="mb-16 mt-16 text-center">
        (This is a temporary page for testing the Quiz component)
      </h1>
      <Quiz
        isPreQuiz={true}
        topic={"BIOLOGY"}
        quizObjective={"How much do you know already know about microglia?"}
        quizQuestionType={"Multiple Choice"}
        questionList={questionList_MC1}
      />
      <div className="mb-16 mt-16"></div>
      <Quiz
        isPreQuiz={false}
        topic={"BIOLOGY"}
        quizObjective={"How much do you know already know about microglia?"}
        quizQuestionType={"Multiple Choice"}
        questionList={questionList_MC1}
      />
      <div className="mb-16 mt-16"></div>
    </div>
  );
};

// TestPage.getLayout = function getLayout(page: React.ReactNode) {
//   return <RootLayout>{page}</RootLayout>;
// };

export default TestPage;