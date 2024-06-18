import prisma from "@/lib/prisma";
import { QuestionType, type Prisma } from "@prisma/client";
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
interface resultGrade {
  errorMessage: string | null;
  errors: string[];
  results: boolean[][];
  correctCount: number;
  total: number;
  userResponse: string[];
}

/**
 * return score, user response that is converted to string array
 */
export function grading(params: questinoType) {
  let { questionType, userAnswer, correctAnswer, maxScore } = params;
  // set default value
  let resultGrade: resultGrade = {
    results: [],
    total: 1,
    errorMessage: null,
    errors: [],
    correctCount: 0,
    userResponse: [],
  };

  //correctAnswer is taken from data base which is guarantee the correct type we are looking for
  switch (questionType) {
    case "COMPLEX_MATCHING": {
      //correctAnswer is guarantee to be string array
      correctAnswer = correctAnswer as string[];
      resultGrade = complexMatchingGrade(correctAnswer, userAnswer);
      break;
    }
    case "DIRECT_MATCHING": {
      //correctAnswer is guarantee to be number array
      correctAnswer = correctAnswer as number[];
      resultGrade = directMatchingGrade(correctAnswer, userAnswer);
      break;
    }
    case "MULTIPLE_CHOICE": {
      //correctAnswer is guarantee to be number
      correctAnswer = correctAnswer as number;
      resultGrade = multipleChoiceGrade(correctAnswer, userAnswer);
      break;
    }
    case "SELECT_ALL": {
      //correctAnswer is guarantee to be boolean array
      correctAnswer = correctAnswer as boolean[];
      resultGrade = selectAllGrade(correctAnswer, userAnswer);
      break;
    }
    case "TRUE_FALSE": {
      //correctAnswer is guarantee to be boolean array
      correctAnswer = correctAnswer as boolean[];
      resultGrade = trueFalseGrade(correctAnswer, userAnswer);
      break;
    }
    default: {
      throw new Error("Unknown type " + questionType + " in grading");
    }
  }
  const { errorMessage, errors, correctCount, total, userResponse, results } =
    resultGrade;
  const score = Math.floor(maxScore * (correctCount / total));
  return { errorMessage, results, errors, score, userResponse };
}

/**
 * Convert to map
 * key: "categotyIndex OptionIndex"
 * value: boolean
 */
function convertMapCheck(correctAnswer: string[]) {
  let map: { [key: string]: boolean } = {};
  let countCorrectAnswer = 0;
  correctAnswer.forEach((str, index) => {
    //if this category is not empty
    if (str !== "") {
      const numberStr = str.split(" ");
      countCorrectAnswer += numberStr.length;
      numberStr.forEach((num) => {
        map[`${index} ${num}`] = true;
      });
    }
  });
  return { map, countCorrectAnswer };
}

function complexMatchingGrade(
  correctAnswer: string[],
  userAnswer: any,
): resultGrade {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponse: string[] = [];
  //check user answer type
  const userAnswerParse = complexMatchingAnswerSchema.safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    //convert correctAnswer to map to check answer
    const { map, countCorrectAnswer } = convertMapCheck(correctAnswer);
    total = countCorrectAnswer;
    const numbersArray = userAnswerParse.data;
    for (let i = 0; i < numbersArray.length; i++) {
      let curResponse = "";
      let curResult: boolean[] = [];
      numbersArray[i].forEach((number) => {
        const isCorrect = map[`${i} ${number}`] === true;
        correctCount += isCorrect ? 1 : 0;
        curResult.push(isCorrect);
        curResponse += curResponse.length === 0 ? `${number}` : ` ${number}`;
      });
      results.push(curResult);
      userResponse.push(curResponse);
    }
  }
  return { errorMessage, errors, results, correctCount, total, userResponse };
}

function directMatchingGrade(
  correctAnswer: number[],
  userAnswer: any,
): resultGrade {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponse: string[] = [];
  total = correctAnswer.length;

  //check user answer type
  const userAnswerParse = directMatchingAnswerSchema
    .refine(
      (numbers) => numbers.length === (correctAnswer as number[]).length,
      { message: "answer length must be equal to number of categories" },
    )
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
      userResponse.push(numbers[i].toString());
    }
  }
  return { errorMessage, errors, results, correctCount, total, userResponse };
}

function multipleChoiceGrade(
  correctAnswer: number,
  userAnswer: any,
): resultGrade {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponse: string[] = [];

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
    userResponse.push(number.toString());
  }
  return { errorMessage, errors, results, correctCount, total, userResponse };
}

function selectAllGrade(
  correctAnswer: boolean[],
  userAnswer: any,
): resultGrade {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponse: string[] = [];
  total = correctAnswer.length;

  //check user answer type
  const userAnswerParse = selectAllAnswerSchema
    .refine((ans) => ans.every((number) => number < total), {
      message:
        "index in answer is out of bound. Index must be less than " + total,
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
        userResponse.push(userAnswer[i] ? "true" : "false");
      }
    }
  }
  return { errorMessage, errors, results, correctCount, total, userResponse };
}

function trueFalseGrade(
  correctAnswer: boolean[],
  userAnswer: any,
): resultGrade {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  let correctCount = 0;
  let total = 1;
  let userResponse: string[] = [];
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
      userResponse.push(userAnswer[i] ? "true" : "false");
    }
  }
  return { errorMessage, errors, results, correctCount, total, userResponse };
}

export async function insertIfNotExists<
  Model extends Prisma.ModelName,
  WhereUniqueInput,
  CreateInput,
>(param: { model: Model; where: WhereUniqueInput; data: CreateInput }) {
  const { model, where, data } = param;
  // Dynamically get the model delegate
  const modelDelegate = (prisma as any)[model];

  if (!modelDelegate) {
    throw new Error(`Model ${model} not found in Prisma Client.`);
  }

  // Check if the record already exists
  const existingRecord = await modelDelegate.findUnique({
    where,
    select: {},
  });

  // If the record does not exist, create a new record
  if (!existingRecord) {
    await modelDelegate.create({
      data,
      select: {},
    });
    return true;
  } else {
    return false;
  }
}
