import prisma from "@/lib/prisma";

interface subpartQuiz {}

export async function getSubpartQuizAnswear(quizQuestionId: string) {
  const quizQuestion = await prisma.quizQuestion.findUnique({
    where: { id: quizQuestionId },
    select: {
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
        quizQuestion.questionType +
        " in getSubpartQuiz function",
    );
  }
  if (!subpart) return null;
  return {
    explanations: subpart.explanations,
    correctAnswer: subpart.correctAnswer,
    questionType: quizQuestion.questionType,
    maxScore: quizQuestion.maxScore,
    quizQuestionId,
  };
}
