"use client";

import { useState } from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import TrueFalseQuestion from "./questions/TrueFalseQuestion";
import QuizContainer from "./QuizContainer";
import { AllQuestions, useQuizContext } from "./QuizContext";
import QuizEndscreen from "./QuizEndscreen";
import QuizProgressBar from "./QuizProgressBar";

export default function PostQuiz() {
  const {
    preQuizAnswers,
    setPreQuizAnswers,
    quizComplete,
    setQuizComplete,
    quizInfo,
  } = useQuizContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [postAnswers, setPostAnswers] = useState<
    (number | boolean | undefined)[]
  >([]);

  const [finalAnswers, setFinalAnswers] = useState<
    (number | boolean | undefined)[]
  >([]);

  const questionList = quizInfo.questions.map((question, index) => {
    switch (question.questionType) {
      case "multiple choice":
        return (
          <MultipleChoiceQuestion
            setAnswer={(answerIndex: number) => {
              setPostAnswers((state) => {
                let newState = [...state];
                newState[index] = answerIndex;

                return newState;
              });
            }}
            question={question}
            index={index}
            selectedAnswer={postAnswers[index]}
            showFeedback={finalAnswers[index] !== undefined}
            key={`postQuiz-mult-choice-${index}`}
          />
        );

      case "true/false":
        return (
          <TrueFalseQuestion
            question={question}
            key={`postQuiz-tf-${index}`}
            index={index}
            answers={postAnswers[index] as unknown as boolean[]}
            setAnswers={(Aindex: number, answer: boolean) => {
              setPostAnswers((state) => {
                let newState = [...state];

                newState[Aindex] = answer;

                return newState as (number | boolean | undefined)[];
              });
            }}
            showFeedback={finalAnswers[index] !== undefined}
          />
        );

      default:
        return;
    }
  });

  return (
    <QuizContainer
      isPreQuiz={false}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      userAnswerList={postAnswers}
      setUserAnswerList={setPostAnswers}
      finalAnswers={finalAnswers}
      setFinalAnswers={setFinalAnswers}
      progressBar={
        <QuizProgressBar
          isPreQuiz={false}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          userAnswerList={finalAnswers}
        />
      }
    >
      {currentQuestionIndex < questionList.length ? (
        questionList[currentQuestionIndex]
      ) : (
        <QuizEndscreen
          postQuizAnswers={finalAnswers}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          resetQuiz={() => {
            setCurrentQuestionIndex(0);
            setFinalAnswers([]);
            setPostAnswers([]);
          }}
        />
      )}
    </QuizContainer>
  );
}
