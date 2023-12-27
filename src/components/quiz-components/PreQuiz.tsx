"use client";

import { useState } from "react";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";
import QuizContainer from "./QuizContainer";
import { useQuizContext } from "./QuizContext";
import QuizProgressBar from "./QuizProgressBar";

export default function PreQuiz() {
  const {
    preQuizAnswers,
    setPreQuizAnswers,
    quizComplete,
    setQuizComplete,
    quizInfo,
  } = useQuizContext();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questionList = quizInfo.questions.map((question, index) => {
    switch (question.questionType) {
      case "multiple choice":
        return (
          <MultipleChoiceQuestion
            setAnswer={(answerIndex: number) => {
              setPreQuizAnswers((state) => {
                let newState = [...state];
                newState[index] = answerIndex;

                return newState;
              });
            }}
            question={question}
            index={index}
            selectedAnswer={preQuizAnswers[index]}
            key={`preQuiz-mult-choice-${index}`}
            showFeedback={false}
          />
        );

      case "true/false":
        return;

      default:
        return;
    }
  });

  return (
    <QuizContainer
      isPreQuiz={true}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      userAnswerList={preQuizAnswers}
      setUserAnswerList={setPreQuizAnswers}
      progressBar={
        <QuizProgressBar
          isPreQuiz={true}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          userAnswerList={preQuizAnswers}
        />
      }
    >
      {currentQuestionIndex < questionList.length ? (
        questionList[currentQuestionIndex]
      ) : (
        <>endscreen</>
      )}
    </QuizContainer>
  );
}
