import prisma from "@/lib/prisma";
import {
  type ComplexMatchingSubpart,
  type DirectMatchingSubpart,
  type MultipleChoiceSubpart,
  type QuestionType,
  type QuizType,
  type SelectAllSubpart,
  type TrueFalseSubpart,
} from "@prisma/client";
import { getSubpartById } from "../tools/SubpartQuiz";
import {
  complexMatchingSubpartSchema,
  directMatchingSubpartSchema,
  multipleChoiceSubpartSchema,
  selectAllSubpartSchema,
  trueFalseSubpartSchema,
} from "./schema";

//change QuestionTypeToDataModel
interface QuestionTypeToModel {
  [QuestionType.MULTIPLE_CHOICE]: MultipleChoiceSubpart;
  [QuestionType.SELECT_ALL]: SelectAllSubpart;
  [QuestionType.COMPLEX_MATCHING]: ComplexMatchingSubpart;
  [QuestionType.DIRECT_MATCHING]: DirectMatchingSubpart;
  [QuestionType.TRUE_FALSE]: TrueFalseSubpart;
}

//parameter interface for shouldCreateQuizResult function
interface quizResultI {
  id: string;
  quizQuestionIdRemain: string[];
  quizType: QuizType;
  used: boolean;
}

//parameter interface for getQuizzes function
interface getQuizzesParamI {
  quizResult?: {
    id: string;
    quizQuestionIdRemain: string[];
    quizType: QuizType;
    used: boolean;
  } | null;
  storyId: string;
}

//parameter interface for handleQuizResult function
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

// create look up object
const CREATE_SUBPART_LOOKUP: {
  [k in QuestionType]: (subpartData: any) => {
    subpartPromise: Promise<QuestionTypeToModel[k]> | null;
    errorMessage: string | null;
    errors: string[];
  };
} = {
  MULTIPLE_CHOICE: (subpartData: any) =>
    createMultipleChoiceSubpart(subpartData),
  TRUE_FALSE: (subpartData: any) => createTrueFalseSubpart(subpartData),
  DIRECT_MATCHING: (subpartData: any) => createDirectMatchSubpart(subpartData),
  COMPLEX_MATCHING: (subpartData: any) =>
    createComplexMatchSubpart(subpartData),
  SELECT_ALL: (subpartData: any) => createSelectAllSubpart(subpartData),
};

//function create quiz question
export function createQuizSubpart<T extends QuestionType>(data: {
  questionType: T;
  subpartData: any;
}): {
  errorMessage: string | null;
  subpartPromise: Promise<QuestionTypeToModel[T]> | null;
  errors: string[];
} {
  return CREATE_SUBPART_LOOKUP[data.questionType](data.subpartData);
}
createQuizSubpart({ subpartData: null, questionType: "COMPLEX_MATCHING" });
export function createEditQuizResponse<T extends QuestionType>(
  questionType: T,
  subpart: QuestionTypeToModel[T],
) {
  const response = {
    correct_answer: subpart.correctAnswer,
    explanations: subpart.explanations,
    content_category: subpart.contentCategory,
  };
  if (questionType === "COMPLEX_MATCHING") {
    const complexSubpart = subpart as QuestionTypeToModel["COMPLEX_MATCHING"];
    return {
      ...response,
      question: complexSubpart.question,
      options: complexSubpart.options,
      categories: complexSubpart.categories,
    };
  }
  if (questionType === "DIRECT_MATCHING") {
    const complexSubpart = subpart as QuestionTypeToModel["DIRECT_MATCHING"];
    return {
      ...response,
      question: complexSubpart.question,
      options: complexSubpart.options,
      categories: complexSubpart.categories,
    };
  }
  if (questionType === "SELECT_ALL") {
    const complexSubpart = subpart as QuestionTypeToModel["SELECT_ALL"];
    return {
      ...response,
      question: complexSubpart.question,
      options: complexSubpart.options,
    };
  }
  if (questionType === "MULTIPLE_CHOICE") {
    const complexSubpart = subpart as QuestionTypeToModel["MULTIPLE_CHOICE"];
    return {
      ...response,
      question: complexSubpart.question,
      options: complexSubpart.options,
    };
  }
  if (questionType === "TRUE_FALSE") {
    const complexSubpart = subpart as QuestionTypeToModel["TRUE_FALSE"];
    return {
      ...response,
      questions: complexSubpart.questions,
    };
  }
  throw new Error(
    "Unknow " + questionType + " in createEditQuizResponse function",
  );
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

//create Multiple Choice quiz
function createMultipleChoiceSubpart(subpartData: any) {
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
  const subpartPromises = quizzes.map((quiz) =>
    getSubpartById(quiz, false, false),
  );
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
    let oldQuizResultDeletePromise = new Promise((resolve) => resolve(0));
    const newQuizResultPromise = prisma.quizResult.create({
      data: {
        userId: userId,
        quizType: quizType,
        storyId,
        quizQuestionIdRemain: isPostType ? quizzes.map(({ id }) => id) : [],
        maxScore: isPostType
          ? quizzes.reduce((total, curQuiz) => total + curQuiz.maxScore, 0)
          : 0,
        totalQuestion: isPostType ? quizzes.length : 0,
        used: !isPostType,
      },
    });
    if (
      oldQuizResult &&
      oldQuizResult.quizType === "POST_QUIZ" &&
      !oldQuizResult.used
    ) {
      oldQuizResultDeletePromise = prisma.quizResult.delete({
        where: {
          id: oldQuizResult.id,
        },
      });
    }
    const [newQuiz] = await Promise.all([
      newQuizResultPromise,
      oldQuizResultDeletePromise,
    ]);
    quizResult = newQuiz;
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
    oldQuizResult.quizQuestionIdRemain.length !== 0 &&
    oldQuizResult.used;
  return (
    //if old quiz not exist, create new one
    !oldQuizResult ||
    //if old quiz is PRE_QUIZ but want POST_QUIZ, create new one
    (oldQuizResult.quizType === "PRE_QUIZ" && quizType === "POST_QUIZ") ||
    //if old quiz is POST_QUIZ and not have quiz remains, create new one
    (oldQuizResult.quizType === "POST_QUIZ" && !haveQuizzesRemain)
  );
}
