import prisma from "@/lib/prisma";
import { type Prisma, type QuestionType } from "@prisma/client";
import {
  complexMatchingAnswerSchema,
  directMatchingAnswerSchema,
  multipleChoiceAnswerSchema,
  selectAllAnswerSchema,
  trueFalseAnswerSchema,
} from "./schema";

interface questinoType {
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

/**
 * return score, user response that is converted to string array
 */
export function grading(params: questinoType) {
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
  switch (questionType) {
    case "COMPLEX_MATCHING": {
      //correctAnswer is guarantee to be string array
      resultGrade = complexMatchingGrade(correctAnswer as string[], userAnswer);
      break;
    }
    case "DIRECT_MATCHING": {
      //correctAnswer is guarantee to be number array
      resultGrade = directMatchingGrade(correctAnswer as number[], userAnswer);
      break;
    }
    case "MULTIPLE_CHOICE": {
      //correctAnswer is guarantee to be number
      resultGrade = multipleChoiceGrade(correctAnswer as number, userAnswer);
      break;
    }
    case "SELECT_ALL": {
      //correctAnswer is guarantee to be boolean array
      resultGrade = selectAllGrade(correctAnswer as boolean[], userAnswer);
      break;
    }
    case "TRUE_FALSE": {
      //correctAnswer is guarantee to be boolean array
      resultGrade = trueFalseGrade(correctAnswer as boolean[], userAnswer);
      break;
    }
    default: {
      throw new Error("Unknown type " + String(questionType) + " in grading");
    }
  }
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
  const userAnswerParse = multipleChoiceAnswerSchema
    .refine((ans) => ans)
    .safeParse(userAnswer);
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
  const results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  const userResponseSubpart: string[] = [];
  const recordCategoriesResult: boolean[] = [];
  total = correctAnswer.length;

  //check user answer type
  const userAnswerParse = trueFalseAnswerSchema.safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const userAnswer = userAnswerParse.data;
    for (let i = 0; i < correctAnswer.length; i++) {
      const isCorrect = userAnswer[i] === correctAnswer[i];
      correctCount += isCorrect ? 1 : 0;
      results.push([]);
      results[i].push(isCorrect);
      recordCategoriesResult.push(isCorrect);
      userResponseSubpart.push(userAnswer[i] ? "true" : "false");
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
    await modelDelegate.create({
      data,
      select: { id: true },
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    return true;
  } else {
    return false;
  }
}
