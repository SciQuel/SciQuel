import prisma from "@/lib/prisma";
import { QuizType, type Prisma, type QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getSubpartQuizAnswearType } from "../tools/SubpartQuiz";
import {
  complexMatchingAnswerSchema,
  directMatchingAnswerSchema,
  multipleChoiceAnswerSchema,
  selectAllAnswerSchema,
  trueFalseAnswerSchema,
} from "./schema";

const ROUND_UP_DECIMAL = 1;

//lookup-object help determine which function should use for grading based on QuestionType
const GRADING_FUNCTION: { [key in QuestionType]: Function } = {
  //correctAnswer is guarantee to be string array in data base
  COMPLEX_MATCHING: (correctAnswer: any, userAnswer: any) =>
    complexMatchingGrade(correctAnswer as string[], userAnswer),
  //correctAnswer is guarantee to be number array
  DIRECT_MATCHING: (correctAnswer: any, userAnswer: any) =>
    directMatchingGrade(correctAnswer as number[], userAnswer),
  //correctAnswer is guarantee to be number
  MULTIPLE_CHOICE: (correctAnswer: any, userAnswer: any) =>
    multipleChoiceGrade(correctAnswer as number, userAnswer),
  //correctAnswer is guarantee to be boolean array
  SELECT_ALL: (correctAnswer: any, userAnswer: any) =>
    selectAllGrade(correctAnswer as boolean[], userAnswer),
  //correctAnswer is guarantee to be boolean array
  TRUE_FALSE: (correctAnswer: any, userAnswer: any) =>
    trueFalseGrade(correctAnswer as boolean[], userAnswer),
};

export const QUIZ_TYPE_HANDLER: { [key in QuizType]: Function } = {
  POST_QUIZ: handlePostQuiz,
  PRE_QUIZ: handlePreQuiz,
};

interface handleQuizI {
  quizQuestion: Exclude<getSubpartQuizAnswearType, null | undefined>;
  userId: string;
  results: boolean[][];
  score: number;
  userResponseSubpart: string[];
  categoriesResult: boolean[] | undefined;
  quizResult: {
    id: string;
    quizQuestionIdRemain: string[];
    storyId: string;
    totalCorrectAnswer: number;
    used: true;
  };
}

interface gradingParam {
  questionType: QuestionType;
  userAnswer: number | boolean[] | number[];
  correctAnswer: number | boolean[] | string[] | number[];
  maxScore: number;
}
interface resultGradeI {
  errorMessage: string | null;
  errors: string[];
  results: boolean[][];
  correctCount: number;
  total: number;
  userResponseSubpart: string[];
  categoriesResult?: boolean[];
}
interface handleQuizReturnI {
  errorRes: NextResponse | null;
  success: boolean;
}
/**
 * return score, user response that is converted to string array
 */
export function grading(params: gradingParam) {
  const { questionType, userAnswer, correctAnswer, maxScore } = params;
  // set default value
  let resultGrade: resultGradeI = {
    results: [],
    total: 1,
    errorMessage: null,
    errors: [],
    correctCount: 0,
    userResponseSubpart: [],
  };
  //correctAnswer is taken from data base which is guarantee the correct type we are looking for
  resultGrade = GRADING_FUNCTION[questionType](correctAnswer, userAnswer);

  const {
    errorMessage,
    errors,
    correctCount,
    total,
    userResponseSubpart,
    categoriesResult,
    results,
  } = resultGrade;
  const score = Math.floor(maxScore * (correctCount / total));
  return {
    errorMessage,
    results,
    errors,
    score,
    userResponseSubpart,
    categoriesResult,
  };
}

/**
 * calculate the percentage of people get the question right
 */
export async function getPercentageQuizQuestionRight(
  quizType: QuizType = "POST_QUIZ",
  quizQuestionId: string,
) {
  //count how many people answer correct question
  const countPeopleAnswerCorrectPromise = prisma.questionAnswerFirstTime.count({
    where: { quizQuestionId: quizQuestionId, correct: true, quizType },
  });
  const countPeopleAnswerPromise = prisma.questionAnswerFirstTime.count({
    where: { quizQuestionId: quizQuestionId, quizType },
  });
  const [countPeopleAnswerCorrect, countPeopleAnswer] = await Promise.all([
    countPeopleAnswerCorrectPromise,
    countPeopleAnswerPromise,
  ]);
  const percentage = (countPeopleAnswerCorrect / countPeopleAnswer) * 100;
  const percentageRoundUp =
    Math.round(percentage * Math.pow(10, ROUND_UP_DECIMAL)) /
    Math.pow(10, ROUND_UP_DECIMAL);
  return percentageRoundUp;
}

/**
 * calculate the percentage of people get the exact number of correct question given
 */
export async function getPercentageQuizStoryGrade(
  quizType: QuizType = "POST_QUIZ",
  storyId: string,
  numberCorrectAnswer: number,
) {
  //count how many people answer correct question
  const countPeopleGetExactScorePromise = prisma.storyQuizScoreFirstTime.count({
    where: {
      storyId: storyId,
      totalCorrectAnswer: numberCorrectAnswer,
      quizType,
    },
  });
  const countPeopleGetScoreStoryPromise = prisma.storyQuizScoreFirstTime.count({
    where: { storyId: storyId, quizType },
  });
  const [countPeopleGetExactScore, countPeopleGetScoreStory] =
    await Promise.all([
      countPeopleGetExactScorePromise,
      countPeopleGetScoreStoryPromise,
    ]);
  const percentage =
    (countPeopleGetExactScore / countPeopleGetScoreStory) * 100;
  const percentageRoundUp =
    Math.round(percentage * Math.pow(10, ROUND_UP_DECIMAL)) /
    Math.pow(10, ROUND_UP_DECIMAL);
  return percentageRoundUp;
}

/**
 * Convert to map
 * key: "categotyIndex OptionIndex"
 * value: boolean
 */
function convertMapCheck(correctAnswer: string[]) {
  const map: { [key: string]: boolean } = {};
  const countAnswerRemain: number[] = new Array(correctAnswer.length).fill(0);
  let countCorrectAnswer = 0;
  correctAnswer.forEach((str, index) => {
    //if this category is not empty
    if (str !== "") {
      const numberStr = str.split(" ");
      countCorrectAnswer += numberStr.length;
      numberStr.forEach((num) => {
        map[`${index} ${num}`] = true;
        countAnswerRemain[index]++;
      });
    }
  });
  return { map, countCorrectAnswer, countAnswerRemain };
}

function complexMatchingGrade(
  correctAnswer: string[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  const results: boolean[][] = [];
  let correctCount = 0;
  let isSkipped = false;
  let total = 1;
  //use to check if all option in each categories is all answeared correctly
  const recordCategoriesResult: boolean[] = [];
  const userResponseSubpart: string[] = [];
  //check user answer type
  const userAnswerParse = complexMatchingAnswerSchema
    .refine((ans) => ans.length === correctAnswer.length, {
      message:
        "The length of answer array must be equal to categories array length. If user not answer, use empty array inside answer array",
    })
    .safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    //convert correctAnswer to map to check answer
    const { map, countCorrectAnswer, countAnswerRemain } =
      convertMapCheck(correctAnswer);
    total = countCorrectAnswer;
    const numbersArray = userAnswerParse.data;
    for (let i = 0; i < numbersArray.length; i++) {
      let curResponse = "";
      let isCorrectAll = true;
      const curResult: boolean[] = [];
      numbersArray[i].forEach((number) => {
        const isCorrect = map[`${i} ${number}`] === true;
        correctCount += isCorrect ? 1 : 0;
        if (isCorrect) countAnswerRemain[i]--;
        else isCorrectAll = false;
        curResult.push(isCorrect);
        curResponse += curResponse.length === 0 ? `${number}` : ` ${number}`;
      });
      recordCategoriesResult.push(countAnswerRemain[i] === 0 && isCorrectAll);
      results.push(curResult);
      userResponseSubpart.push(curResponse);
    }
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total,
    userResponseSubpart,
    categoriesResult: recordCategoriesResult,
  };
}

function directMatchingGrade(
  correctAnswer: number[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  const results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  const recordCategoriesResult: boolean[] = [];
  const userResponseSubpart: string[] = [];
  total = correctAnswer.length;
  //use to check if all option in each categories is all answeared correctly

  //check user answer type
  const userAnswerParse = directMatchingAnswerSchema
    .refine((numbers) => numbers.length === correctAnswer.length, {
      message: "answer length must be equal to number of categories",
    })
    .safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const numbers = userAnswerParse.data;
    for (let i = 0; i < numbers.length; i++) {
      results.push([]);
      const isCorrect = numbers[i] === correctAnswer[i];
      correctCount += isCorrect ? 1 : 0;
      results[i].push(isCorrect);
      recordCategoriesResult.push(isCorrect);
      userResponseSubpart.push(numbers[i].toString());
    }
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total,
    userResponseSubpart,
    categoriesResult: recordCategoriesResult,
  };
}

function multipleChoiceGrade(
  correctAnswer: number,
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  const results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  const userResponseSubpart: string[] = [];
  total = 1;
  //check user answer type
  const userAnswerParse = multipleChoiceAnswerSchema.safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const number = userAnswerParse.data;
    const isCorrect = number === correctAnswer;
    correctCount += isCorrect ? 1 : 0;
    results.push([]);
    results[0].push(isCorrect);
    userResponseSubpart.push(number.toString());
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total,
    userResponseSubpart,
  };
}

function selectAllGrade(
  correctAnswer: boolean[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  const results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  const userResponseSubpart: string[] = [];
  total = correctAnswer.length;

  //check user answer type
  const userAnswerParse = selectAllAnswerSchema
    .refine((ans) => ans.every((number) => number < total), {
      message:
        "index in answer is out of bound. Index must be less than " +
        String(total),
    })
    .safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const numberAnsArr = userAnswerParse.data;
    const userAnswer: boolean[] = [];
    for (let i = 0; i < correctAnswer.length; i++) {
      userAnswer.push(false);
    }
    for (let i = 0; i < numberAnsArr.length; i++) {
      userAnswer[numberAnsArr[i]] = true;
    }
    if (!errorMessage) {
      for (let i = 0; i < correctAnswer.length; i++) {
        const isCorrect = userAnswer[i] === correctAnswer[i];
        correctCount += isCorrect ? 1 : 0;
        results.push([]);
        results[i].push(isCorrect);
        userResponseSubpart.push(userAnswer[i] ? "true" : "false");
      }
    }
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total,
    userResponseSubpart,
  };
}

function trueFalseGrade(
  correctAnswer: boolean[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponseSubpart: string[] = [];
  let recordCategoriesResult: boolean[] = [];
  let isSkipped = false;
  total = correctAnswer.length;
  //check user answer type
  const userAnswerParse = trueFalseAnswerSchema
    .refine(
      (boolAnsArr) =>
        boolAnsArr.length === 0 || boolAnsArr.length === correctAnswer.length,
      (boolAnsArr) => ({
        message: `User answer array must have ${correctAnswer.length} elements. Only found ${boolAnsArr.length} element`,
      }),
    )
    .safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const userAnswer = userAnswerParse.data;
    isSkipped = userAnswerParse.data.length === 0;
    if (isSkipped) {
      results = createArray(correctAnswer.length, [false]);
      recordCategoriesResult = createArray(correctAnswer.length, false);
      userResponseSubpart = createArray(correctAnswer.length, "false");
    } else {
      for (let i = 0; i < correctAnswer.length; i++) {
        const isCorrect = userAnswer[i] === correctAnswer[i];
        correctCount += isCorrect ? 1 : 0;
        results.push([isCorrect]);
        recordCategoriesResult.push(isCorrect);
        userResponseSubpart.push(userAnswer[i] ? "true" : "false");
      }
    }
  }
  return {
    errorMessage,
    errors,
    results,
    // isSkipped,
    correctCount,
    total,
    userResponseSubpart,
    categoriesResult: recordCategoriesResult,
  };
}

export async function handlePreQuiz(
  params: handleQuizI,
): Promise<handleQuizReturnI> {
  const {
    userId,
    quizQuestion,
    score,
    results,
    userResponseSubpart,
    categoriesResult,
    quizResult,
  } = params;
  //store value to put in database
  const isCorrect = results.every((result) => result.every((val) => val));
  const userFirstAnsCountPromsie = prisma.questionAnswerFirstTime.count({
    where: {
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      quizType: "PRE_QUIZ",
    },
    take: 1,
  });

  const userGradesPromise = prisma.grade.findMany({
    where: {
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      quizResultId: quizResult.id,
    },
    select: {
      id: true,
    },
  });
  const [userFirsAnsCount, userGrades] = await Promise.all([
    userFirstAnsCountPromsie,
    userGradesPromise,
  ]);
  const isFirstAns = userFirsAnsCount === 0;

  //create user response
  const gradeCreatePromsie = prisma.grade.create({
    data: {
      userId,
      quizResultId: quizResult.id,
      userAns: userResponseSubpart,
      quizQuestionId: quizQuestion.quizQuestionId,
      questionType: quizQuestion.questionType,
      totalScore: score,
      maxScore: quizQuestion.maxScore,
      //convert bool[][] to string[]. For example: ['true true','false','false true']
      result: results.map((result) =>
        result.map((val) => val.toString()).join(" "),
      ),
      //if categoriesResult not exist, check if all value in results is all true
      categoriesResult: categoriesResult || [
        results.every((result) => result.every((val) => val)),
      ],
    },
  });
  let gradeDeletePromsie = new Promise((resolve) => resolve(0));
  // only keep first ans answear and recent answear
  if (userGrades.length >= 2) {
    gradeDeletePromsie = prisma.grade.delete({
      where: {
        id: userGrades[1].id,
      },
    });
  }

  const [gradeCreate] = await Promise.all([
    gradeCreatePromsie,
    gradeDeletePromsie,
  ]);

  if (isFirstAns) {
    const userFirstAnsPromise = prisma.questionAnswerFirstTime.create({
      data: {
        quizType: "PRE_QUIZ",
        gradeId: gradeCreate.id,
        userId: userId,
        quizQuestionId: quizQuestion.quizQuestionId,
        correct: isCorrect,
      },
    });
    const updateQuizResultPromise = prisma.quizResult.update({
      where: {
        id: quizResult.id,
      },
      data: {
        score: { increment: score },
        totalCorrectAnswer: { increment: isCorrect ? 1 : 0 },
      },
    });
    await Promise.all([userFirstAnsPromise, updateQuizResultPromise]);
  }
  return {
    errorRes: null,
    success: true,
  };
}

/**
 * Lock pre-quiz which not allow user to use pre-quiz type
 * calculate to get total score and max score
 * calculate how many question user answer right first time
 */
export async function lockPreQuiz(userId: string, storyId: string) {
  //get pre-quiz result and lock if exist
  const preQuizResult = await prisma.quizResult.findFirst({
    where: {
      storyId,
      userId,
      quizType: "PRE_QUIZ",
    },
    select: {
      id: true,
    },
  });
  if (!preQuizResult) return;
  //get all quiz question
  const quizzesPromise = prisma.quizQuestion.findMany({
    where: {
      storyId: storyId,
      deleted: false,
    },
    select: {
      id: true,
    },
  });
  //get all grade quiz
  const gradesPromise = prisma.grade.aggregateRaw({
    pipeline: [
      {
        $match: { quizResultId: { $oid: preQuizResult.id } },
        $group: {
          _id: "$quizQuestionId",
          grades: {
            $push: { totalScore: "$totalScore", maxScore: "$maxScore" },
          },
        },
      },
    ],
  });
  const [grades, quizzes] = await Promise.all([gradesPromise, quizzesPromise]);
  console.log(grades);
  console.log(quizzes);

  //check which quiz question not submited
  //create new grade model from missing quiz and mark skipped
  //create user first ans from missing quiz
  //create quiz story first score
}

export async function handlePostQuiz(
  params: handleQuizI,
): Promise<handleQuizReturnI> {
  const {
    userId,
    quizQuestion,
    score,
    results,
    userResponseSubpart,
    categoriesResult,
    quizResult,
  } = params;

  const indexFound = quizResult.quizQuestionIdRemain.indexOf(
    quizQuestion.quizQuestionId,
  );
  //check quiz question id in quiz record
  if (indexFound === -1) {
    return {
      errorRes: new NextResponse(
        JSON.stringify({ error: "This Quiz Question is already graded" }),
        {
          status: 403,
        },
      ),
      success: false,
    };
  }
  //if post-quiz-result used is false, set to true
  //lock pre-quiz which not allow to use pre-quiz type anymore
  // if (!quizResult.used) {
  //   lockPreQuiz(userId, quizResult.storyId);
  // }

  //if user is logged in create and store user respone
  //declare value to put in database
  const isCorrect = results.every((result) => result.every((val) => val));
  const isLastQuestion = quizResult.quizQuestionIdRemain.length === 1;
  //create user response
  const grade = await prisma.grade.create({
    data: {
      userId,
      userAns: userResponseSubpart,
      quizQuestionId: quizQuestion.quizQuestionId,
      questionType: quizQuestion.questionType,
      totalScore: score,
      maxScore: quizQuestion.maxScore,
      quizResultId: quizResult.id,
      //convert bool[][] to string[]. For example: ['true true','false','false true']
      result: results.map((result) =>
        result.map((val) => val.toString()).join(" "),
      ),
      //if categoriesResult not exist, check if all value in results is all true
      categoriesResult: categoriesResult || [
        results.every((result) => result.every((val) => val)),
      ],
    },
  });

  //remove graded quizQuestionId from quizQuestionIdRemain
  const updatequizResultPromise = prisma.quizResult.update({
    where: { id: quizResult.id },
    data: {
      score: { increment: score },
      quizQuestionIdRemain: quizResult.quizQuestionIdRemain.filter(
        (str, index) => index !== indexFound,
      ),
      totalCorrectAnswer: { increment: isCorrect ? 1 : 0 },
      lastUpdate: new Date(),
    },
  });

  const userFirstAnsPromise = insertIfNotExists<
    "QuestionAnswerFirstTime",
    Prisma.QuestionAnswerFirstTimeWhereInput,
    Prisma.QuestionAnswerFirstTimeUncheckedCreateInput
  >({
    model: "QuestionAnswerFirstTime",
    where: userId
      ? {
          userId: userId,
          quizQuestionId: quizQuestion.quizQuestionId,
        }
      : null,
    data: {
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      correct: isCorrect,
      quizType: "POST_QUIZ",
      gradeId: grade.id,
    },
  });
  //create dummy promise
  let userFirstScorePromise = new Promise((resolve, reject) => {
    resolve(0);
  });

  if (isLastQuestion) {
    const gradeIds = await prisma.grade.findMany({
      where: {
        quizResultId: quizResult.id,
      },
      select: {
        id: true,
      },
    });
    userFirstScorePromise = insertIfNotExists<
      "StoryQuizScoreFirstTime",
      Prisma.StoryQuizScoreFirstTimeWhereInput,
      Prisma.StoryQuizScoreFirstTimeCreateInput
    >({
      model: "StoryQuizScoreFirstTime",
      where: userId
        ? {
            userId: userId,
            storyId: quizResult.storyId,
            quizType: "POST_QUIZ",
          }
        : null,
      data: {
        quizType: "POST_QUIZ",
        gradeIds: gradeIds ? gradeIds.map(({ id }) => id) : [],
        userId,
        storyId: quizResult.storyId,
        totalCorrectAnswer: quizResult.totalCorrectAnswer + (isCorrect ? 1 : 0),
      },
    });
  }
  await Promise.all([
    updatequizResultPromise,
    userFirstAnsPromise,
    userFirstScorePromise,
  ]);
  return {
    errorRes: null,
    success: true,
  };
}

//insert data if data is not found
export async function insertIfNotExists<
  Model extends Prisma.ModelName,
  WhereUniqueInput,
  CreateInput,
>(param: { model: Model; where: WhereUniqueInput | null; data: CreateInput }) {
  const { model, where, data } = param;
  // Dynamically get the model delegate
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  const modelDelegate = (prisma as any)[model];

  if (!modelDelegate) {
    throw new Error(`Model ${model} not found in Prisma Client.`);
  }

  // Check if the record already exists
  const existingRecordCount = where
    ? await modelDelegate.count({
        where,
      })
    : 0;
  // If the record does not exist, create a new record
  if (existingRecordCount === 0) {
    const result = await modelDelegate.create({
      data,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    return {
      data: result,
      inserted: true,
    };
  } else {
    return {
      data: null,
      inserted: false,
    };
  }
}
function createArray(length: number, defaultValue: any) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(defaultValue);
  }
  return arr;
}
