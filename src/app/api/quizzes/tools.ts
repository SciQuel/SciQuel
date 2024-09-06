import prisma from "@/lib/prisma";
import { type QuestionType } from "@prisma/client";
import {
  complexMatchingSubpartSchema,
  directMatchingSubpartSchema,
  multipleChoiceSubpartSchema,
  selectAllSubpartSchema,
  trueFalseSubpartSchema,
} from "./schema";

interface QuizQuestionI {
  questionType: QuestionType;
  maxScore: number;
  subpartId: string;
}

export function createQuizSubpart(data: {
  question_type: QuestionType;
  subpartData: any;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { question_type, subpartData } = data;
  let result: {
    errorMessage: string | null;
    subpartPromise: Promise<any> | null;
    errors: string[];
  } = { errorMessage: null, subpartPromise: null, errors: [] };
  if (question_type === "COMPLEX_MATCHING") {
    result = createComplexMatchSubpart(subpartData);
  } else if (question_type === "DIRECT_MATCHING") {
    result = createDirectMatchSubpart(subpartData);
  } else if (question_type === "MULTIPLE_CHOICE") {
    result = createMultipleChocieSubpart(subpartData);
  } else if (question_type === "SELECT_ALL") {
    result = createSelectAllSubpart(subpartData);
  } else if (question_type === "TRUE_FALSE") {
    result = createTrueFalseSubpart(subpartData);
  } else {
    throw new Error(
      "Unknown type: " + String(question_type) + " in modifiedQuiz function",
    );
  }
  return result;
}

export function getDeleteSuppart({
  questionType,
  subpartId,
}: {
  questionType: QuestionType;
  subpartId: string;
}) {
  if (questionType === "COMPLEX_MATCHING") {
    return prisma.complexMatchingSubpart.delete({ where: { id: subpartId } });
  } else if (questionType === "DIRECT_MATCHING") {
    return prisma.directMatchingSubpart.delete({ where: { id: subpartId } });
  } else if (questionType === "MULTIPLE_CHOICE") {
    return prisma.multipleChoiceSubpart.delete({ where: { id: subpartId } });
  } else if (questionType === "SELECT_ALL") {
    return prisma.selectAllSubpart.delete({ where: { id: subpartId } });
  } else if (questionType === "TRUE_FALSE") {
    return prisma.trueFalseSubpart.delete({ where: { id: subpartId } });
  } else {
    throw new Error(
      "Unknow type " +
        String(questionType) +
        " in getting delete Subpart promise",
    );
  }
}

export async function getSubpart(quiz: QuizQuestionI) {
  let subpart: any = null;
  if (quiz.questionType === "COMPLEX_MATCHING") {
    subpart = await prisma.complexMatchingSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        contentCategories: true,
        question: true,
        categories: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "DIRECT_MATCHING") {
    subpart = await prisma.directMatchingSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        contentCategories: true,
        question: true,
        categories: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "MULTIPLE_CHOICE") {
    subpart = await prisma.multipleChoiceSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        question: true,
        contentCategory: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "SELECT_ALL") {
    subpart = await prisma.selectAllSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: {
        contentCategory: true,
        question: true,
        options: true,
      },
    });
  } else if (quiz.questionType === "TRUE_FALSE") {
    subpart = await prisma.trueFalseSubpart.findUnique({
      where: { id: quiz.subpartId },
      select: { questions: true, contentCategories: true },
    });
  } else {
    throw new Error(
      "Unknow type " +
        String(quiz.questionType) +
        " in finding Subpart function",
    );
  }
  //any key that have value is undefined, when JSON stringify that key will be removed from obj
  return {
    questions: subpart?.questions,
    content_categories: subpart?.contentCategories,
    content_category: subpart?.contentCategory,
    options: subpart?.options,
    categories: subpart?.categories,
  };
}

function createComplexMatchSubpart(subpartData: any) {
  let errorMessage = null;
  let subpartPromise = null;
  let errors: string[] = [];
  const parsedData = complexMatchingSubpartSchema.safeParse(subpartData);
  if (!parsedData.success) {
    errorMessage = parsedData.error.errors[0].message;
    errors = parsedData.error.errors.map((value) => value.message);
  } else {
    const {
      categories,
      correct_answers,
      question,
      options,
      explanations,
      content_categories,
    } = parsedData.data;
    const correctAnswer = correct_answers.map((numbers) => {
      let str = "";
      numbers.forEach((number) => {
        str += String(number) + " ";
      });
      str = str.substring(0, str.length - 1);
      return str;
    });

    subpartPromise = prisma.complexMatchingSubpart.create({
      data: {
        contentCategories: content_categories,
        categories,
        options,
        correctAnswer,
        question,
        explanations,
      },
    });
  }
  return {
    subpartPromise,
    errorMessage,
    errors,
  };
}
function createDirectMatchSubpart(subpartData: any) {
  let errorMessage = null;
  let subpartPromise = null;
  let errors: string[] = [];
  const parsedData = directMatchingSubpartSchema.safeParse(subpartData);
  if (!parsedData.success) {
    errorMessage = parsedData.error.errors[0].message;
    errors = parsedData.error.errors.map((value) => value.message);
  } else {
    const {
      categories,
      correct_answers,
      question,
      options,
      explanations,
      content_categories,
    } = parsedData.data;

    subpartPromise = prisma.directMatchingSubpart.create({
      data: {
        contentCategories: content_categories,
        categories,
        options,
        correctAnswer: correct_answers,
        question,
        explanations,
      },
    });
  }
  return {
    subpartPromise,
    errorMessage,
    errors,
  };
}
function createTrueFalseSubpart(subpartData: any) {
  let errorMessage = null;
  let subpartPromise = null;
  let errors: string[] = [];
  const parsedData = trueFalseSubpartSchema.safeParse(subpartData);
  if (!parsedData.success) {
    errorMessage = parsedData.error.errors[0].message;
    errors = parsedData.error.errors.map((value) => value.message);
  } else {
    const { questions, correct_answers, explanations, content_categories } =
      parsedData.data;
    subpartPromise = prisma.trueFalseSubpart.create({
      data: {
        contentCategories: content_categories,
        correctAnswer: correct_answers,
        questions: questions,
        explanations,
      },
    });
  }
  return {
    subpartPromise,
    errorMessage,
    errors,
  };
}
function createSelectAllSubpart(subpartData: any) {
  let errorMessage = null;
  let subpartPromise = null;
  let errors: string[] = [];
  const parsedData = selectAllSubpartSchema.safeParse(subpartData);
  if (!parsedData.success) {
    errorMessage = parsedData.error.errors[0].message;
    errors = parsedData.error.errors.map((value) => value.message);
  } else {
    const {
      correct_answers,
      question,
      options,
      explanations,
      content_category,
    } = parsedData.data;
    const correctAnswer: boolean[] = [];
    for (let i = 0; i < options.length; i++) {
      correctAnswer.push(false);
    }
    correct_answers.forEach((val) => {
      correctAnswer[val] = true;
    });

    subpartPromise = prisma.selectAllSubpart.create({
      data: {
        contentCategory: content_category,
        options,
        correctAnswer,
        question,
        explanations,
      },
    });
  }
  return {
    subpartPromise,
    errorMessage,
    errors,
  };
}
function createMultipleChocieSubpart(subpartData: any) {
  let errorMessage = null;
  let subpartPromise = null;
  let errors: string[] = [];
  const parsedData = multipleChoiceSubpartSchema.safeParse(subpartData);
  if (!parsedData.success) {
    errorMessage = parsedData.error.errors[0].message;
    errors = parsedData.error.errors.map((value) => value.message);
  } else {
    const {
      question,
      options,
      correct_answer,
      explanations,
      content_category,
    } = parsedData.data;

    subpartPromise = prisma.multipleChoiceSubpart.create({
      data: {
        contentCategory: content_category,
        options,
        correctAnswer: correct_answer,
        question,
        explanations,
      },
    });
  }
  return {
    subpartPromise,
    errorMessage,
    errors,
  };
}
