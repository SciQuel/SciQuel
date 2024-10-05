import prisma from "@/lib/prisma";
import { QuizType, type QuestionType } from "@prisma/client";
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
interface quizResultI {
  id: string;
  quizQuestionIdRemain: string[];
  quizType: QuizType;
  used: boolean;
}
interface getQuizzesParamI {
  quizResult?: {
    id: string;
    quizQuestionIdRemain: string[];
    quizType: QuizType;
    used: boolean;
  } | null;
  storyId: string;
}
interface handleQuizResultParamI {
  oldQuizResult: quizResultI | null;
  storyId: string;
  userId: string;
  quizType: QuizType;
  quizzes: {
    id: string;
    maxScore: number;
  }[];
}
type lookupSubpart = {
  [key in QuestionType]: Function;
};
// create look up object
const PRISMA_LOOKUP_SUBPART: {
  [key in "DELETE" | "GET" | "CREATE"]: lookupSubpart;
} = {
  DELETE: {
    MULTIPLE_CHOICE: (id: string) =>
      prisma.complexMatchingSubpart.delete({ where: { id } }),
    TRUE_FALSE: (id: string) =>
      prisma.trueFalseSubpart.delete({ where: { id } }),
    DIRECT_MATCHING: (id: string) =>
      prisma.directMatchingSubpart.delete({ where: { id } }),
    COMPLEX_MATCHING: (id: string) =>
      prisma.complexMatchingSubpart.delete({ where: { id } }),
    SELECT_ALL: (id: string) =>
      prisma.selectAllSubpart.delete({ where: { id } }),
  },
  GET: {
    MULTIPLE_CHOICE: (id: string) =>
      prisma.multipleChoiceSubpart.findUnique({
        where: { id },
        select: {
          question: true,
          contentCategory: true,
          options: true,
        },
      }),
    TRUE_FALSE: (id: string) =>
      prisma.trueFalseSubpart.findUnique({
        where: { id },
        select: { questions: true, contentCategory: true },
      }),
    DIRECT_MATCHING: (id: string) =>
      prisma.directMatchingSubpart.findUnique({
        where: { id },
        select: {
          contentCategory: true,
          question: true,
          categories: true,
          options: true,
        },
      }),
    COMPLEX_MATCHING: (id: string) =>
      prisma.complexMatchingSubpart.findUnique({
        where: { id },
        select: {
          contentCategory: true,
          question: true,
          categories: true,
          options: true,
        },
      }),
    SELECT_ALL: (id: string) =>
      prisma.selectAllSubpart.findUnique({
        where: { id },
        select: {
          contentCategory: true,
          question: true,
          options: true,
        },
      }),
  },
  CREATE: {
    MULTIPLE_CHOICE: (subpartData: any) =>
      createMultipleChocieSubpart(subpartData),
    TRUE_FALSE: (subpartData: any) => createTrueFalseSubpart(subpartData),
    DIRECT_MATCHING: (subpartData: any) =>
      createDirectMatchSubpart(subpartData),
    COMPLEX_MATCHING: (subpartData: any) =>
      createComplexMatchSubpart(subpartData),
    SELECT_ALL: (subpartData: any) => createSelectAllSubpart(subpartData),
  },
};

//function create quiz question
export function createQuizSubpart(data: {
  questionType: QuestionType;
  subpartData: any;
}): {
  errorMessage: string | null;
  subpartPromise: Promise<any> | null;
  errors: string[];
} {
  const { questionType, subpartData } = data;
  let result = PRISMA_LOOKUP_SUBPART["CREATE"][questionType](subpartData);
  return result;
}
//function create quiz question
export function getDeleteSuppart({
  questionType,
  subpartId,
}: {
  questionType: QuestionType;
  subpartId: string;
}) {
  return PRISMA_LOOKUP_SUBPART["DELETE"][questionType](subpartId);
}
//function get Subpart
export async function getSubpart(quiz: QuizQuestionI) {
  let subpart = await PRISMA_LOOKUP_SUBPART["GET"][quiz.questionType](
    quiz.subpartId,
  );
  //any key that have value is undefined, when JSON stringify that key will be removed from obj
  return {
    questions: subpart?.questions,
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
      content_category,
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
        contentCategory: content_category,
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
      content_category,
    } = parsedData.data;

    subpartPromise = prisma.directMatchingSubpart.create({
      data: {
        contentCategory: content_category,
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
    const { questions, correct_answers, explanations, content_category } =
      parsedData.data;
    subpartPromise = prisma.trueFalseSubpart.create({
      data: {
        contentCategory: content_category,
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

//get quizzes and subpart of quizzes
export async function getQuizzes(params: getQuizzesParamI) {
  const { quizResult, storyId } = params;

  //if there is quiz result to record and user did answer some post-quiz question
  //get the remain quiz question
  const haveQuizzesRemain =
    quizResult &&
    quizResult.quizType === "POST_QUIZ" &&
    quizResult.quizQuestionIdRemain.length !== 0 &&
    quizResult.used;

  const quizzes = await prisma.quizQuestion.findMany({
    where: haveQuizzesRemain
      ? {
          id: {
            in: quizResult.quizQuestionIdRemain,
          },
        }
      : {
          storyId: storyId,
          deleted: false,
        },
    select: {
      id: true,
      subheader: true,
      questionType: true,
      subpartId: true,
      maxScore: true,
    },
  });

  //get subpart
  const subpartPromises = quizzes.map((quiz) => getSubpart(quiz));
  const subparts = await Promise.all(subpartPromises);
  return {
    quizzes,
    subparts,
  };
}

//determine if need to create new quiz result or keep old quiz
export async function handleQuizResult(params: handleQuizResultParamI) {
  const { oldQuizResult, quizType, storyId, quizzes, userId } = params;
  const isPostType = quizType === "POST_QUIZ";
  const isNewQuizResult = shouldCreateQuizResult(quizType, oldQuizResult);
  let quizResult = oldQuizResult;
  if (!isNewQuizResult) return oldQuizResult;
  else {
    quizResult = await prisma.quizResult.create({
      data: {
        userId: userId,
        quizType: quizType,
        storyId,
        quizQuestionIdRemain: isPostType ? quizzes.map(({ id }) => id) : [],
        maxScore: isPostType
          ? quizzes.reduce((total, curQuiz) => total + curQuiz.maxScore, 0)
          : 0,
        totalQuestion: isPostType ? quizzes.length : 0,
      },
    });
  }
  return quizResult;
}

//only need new quiz result in 3 cases
//If there is no old quiz result
//if old quiz result is pre quiz but need post quiz
//if old quiz result is post quiz and user have answear all the question
function shouldCreateQuizResult(
  quizType: QuizType,
  oldQuizResult?: quizResultI | null,
) {
  const haveQuizzesRemain =
    oldQuizResult &&
    oldQuizResult.quizType === "POST_QUIZ" &&
    oldQuizResult.quizQuestionIdRemain.length !== 0 &&
    oldQuizResult.used;
  return (
    !oldQuizResult ||
    (oldQuizResult.quizType === "PRE_QUIZ" && quizType === "POST_QUIZ") ||
    !haveQuizzesRemain
  );
}
