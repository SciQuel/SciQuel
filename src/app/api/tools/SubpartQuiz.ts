import prisma from "@/lib/prisma";
import { type QuestionType } from "@prisma/client";

interface QuizSubpartParam {
  questionType: QuestionType;
  subpartId: string;
}

interface QuizSubpartI {
  correctAnswer: number | string[] | number[] | boolean[];
  contentCategory: string[];
  question?: string;
  categories?: string[];
  options?: string[];
  explanations?: string[];
  questions?: string[];
}
//create look up object to get quiz subpart
const GET_QUIZ_SUBPART: {
  GET_SUBPART: {
    [key in QuestionType]: (
      subpartId: string,
      includeAnswer: boolean,
      includeExplain: boolean,
    ) => Promise<QuizSubpartI | null>;
  };
} = {
  GET_SUBPART: {
    COMPLEX_MATCHING: (subpartId, includeAnswer, includeExplain) =>
      prisma.complexMatchingSubpart.findUnique({
        where: { id: subpartId },
        select: {
          correctAnswer: includeAnswer,
          explanations: includeExplain,
          contentCategory: true,
          question: true,
          categories: true,
          options: true,
        },
      }),
    DIRECT_MATCHING: (subpartId, includeAnswer, includeExplain) =>
      prisma.directMatchingSubpart.findUnique({
        where: { id: subpartId },
        select: {
          correctAnswer: includeAnswer,
          explanations: includeExplain,
          contentCategory: true,
          question: true,
          categories: true,
          options: true,
        },
      }),
    MULTIPLE_CHOICE: (subpartId, includeAnswer, includeExplain) =>
      prisma.multipleChoiceSubpart.findUnique({
        where: { id: subpartId },
        select: {
          correctAnswer: includeAnswer,
          explanations: includeExplain,
          question: true,
          contentCategory: true,
          options: true,
        },
      }),
    SELECT_ALL: (subpartId, includeAnswer, includeExplain) =>
      prisma.selectAllSubpart.findUnique({
        where: { id: subpartId },
        select: {
          correctAnswer: includeAnswer,
          explanations: includeExplain,
          contentCategory: true,
          question: true,
          options: true,
        },
      }),
    TRUE_FALSE: (subpartId, includeAnswer, includeExplain) =>
      prisma.trueFalseSubpart.findUnique({
        where: { id: subpartId },
        select: {
          explanations: includeExplain,
          questions: true,
          contentCategory: true,
          correctAnswer: includeAnswer,
        },
      }),
  },
};

export async function getSubpartByQuizQuestion(
  quizQuestionId: string,
  includeAnswer = false,
  includeExplain = false,
) {
  const quizQuestion = await prisma.quizQuestion.findUnique({
    where: { id: quizQuestionId },
    select: {
      storyId: true,
      subpartId: true,
      questionType: true,
      maxScore: true,
    },
  });
  if (!quizQuestion) return null;
  const subpart = await getSubpartById(
    { ...quizQuestion },
    includeAnswer,
    includeExplain,
  );
  if (!subpart) return null;
  return {
    storyId: quizQuestion.storyId,
    questionType: quizQuestion.questionType,
    maxScore: quizQuestion.maxScore,
    quizQuestionId,
    ...subpart,
  };
}

export async function getSubpartById(
  quiz: QuizSubpartParam,
  includeAnswer = false,
  includeExplain = false,
) {
  return await GET_QUIZ_SUBPART["GET_SUBPART"][quiz.questionType](
    quiz.subpartId,
    includeAnswer,
    includeExplain,
  );
}
export type getSubpartByIdType = Awaited<ReturnType<typeof getSubpartById>>;

export type getSubpartByQuizQuestionType = Awaited<
  ReturnType<typeof getSubpartByQuizQuestion>
>;
