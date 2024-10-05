import prisma from "@/lib/prisma";
import { QuestionType } from "@prisma/client";

interface QuizQuestionI {
  questionType: QuestionType;
  subpartId: string;
}

export async function getSubpartQuizAnswear(quizQuestionId: string) {
  const quizQuestion = await prisma.quizQuestion.findUnique({
    where: { id: quizQuestionId },
    select: {
      storyId: true,
      subpartId: true,
      questionType: true,
      maxScore: true,
    },
  });
  let subpart = null;
  if (!quizQuestion) return null;
  if (quizQuestion.questionType === "COMPLEX_MATCHING") {
    subpart = await prisma.complexMatchingSubpart.findUnique({
      where: { id: quizQuestion.subpartId },
      select: {
        correctAnswer: true,
        explanations: true,
      },
    });
  } else if (quizQuestion.questionType === "DIRECT_MATCHING") {
    subpart = await prisma.directMatchingSubpart.findUnique({
      where: { id: quizQuestion.subpartId },
      select: {
        correctAnswer: true,
        explanations: true,
      },
    });
  } else if (quizQuestion.questionType === "MULTIPLE_CHOICE") {
    subpart = await prisma.multipleChoiceSubpart.findUnique({
      where: { id: quizQuestion.subpartId },
      select: { correctAnswer: true, explanations: true, options: true },
    });
  } else if (quizQuestion.questionType === "SELECT_ALL") {
    subpart = await prisma.selectAllSubpart.findUnique({
      where: { id: quizQuestion.subpartId },
      select: { correctAnswer: true, explanations: true, options: true },
    });
  } else if (quizQuestion.questionType === "TRUE_FALSE") {
    subpart = await prisma.trueFalseSubpart.findUnique({
      where: { id: quizQuestion.subpartId },
      select: { correctAnswer: true, explanations: true, questions: true },
    });
  } else {
    throw new Error(
      "Unknow type " +
        String(quizQuestion.questionType) +
        " in getSubpartQuiz function",
    );
  }
  if (!subpart) return null;
  return {
    storyId: quizQuestion.storyId,
    explanations: subpart.explanations,
    correctAnswer: subpart.correctAnswer,
    questionType: quizQuestion.questionType,
    maxScore: quizQuestion.maxScore,
    quizQuestionId,
  };
}

export async function getSubpart(quiz: QuizQuestionI, includeAnswer = false) {
  let subpart: any = null;
  if (quiz.questionType === "COMPLEX_MATCHING") {
    subpart = await prisma.complexMatchingSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        correctAnswer: includeAnswer,
        contentCategory: true,
        question: true,
        categories: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "DIRECT_MATCHING") {
    subpart = await prisma.directMatchingSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        correctAnswer: includeAnswer,
        contentCategory: true,
        question: true,
        categories: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "MULTIPLE_CHOICE") {
    subpart = await prisma.multipleChoiceSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        correctAnswer: includeAnswer,
        question: true,
        contentCategory: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "SELECT_ALL") {
    subpart = await prisma.selectAllSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        correctAnswer: includeAnswer,
        contentCategory: true,
        question: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "TRUE_FALSE") {
    subpart = await prisma.trueFalseSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        questions: true,
        contentCategory: true,
        correctAnswer: includeAnswer,
      },
    });
  } else {
    throw new Error(
      "Unknow type " +
        String(quiz.questionType) +
        " in finding Subpart function",
    );
  }
  return {
    questions: subpart?.questions,
    correctAnswer: subpart?.correctAnswer,
    question: subpart?.question,
    contentCategory: subpart?.contentCategory,
    options: subpart?.options,
    categories: subpart?.categories,
  };
}
export type getSubpartReturnType = Awaited<ReturnType<typeof getSubpart>>;

export type getSubpartQuizAnswearType = Awaited<
  ReturnType<typeof getSubpartQuizAnswear>
>;
