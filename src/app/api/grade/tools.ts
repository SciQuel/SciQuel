import prisma from "@/lib/prisma";
import { type Prisma, type QuestionType, type QuizType } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  getSubpartByQuizQuestion,
  type getSubpartByQuizQuestionType,
} from "../tools/SubpartQuiz";
import {
  complexMatchingAnswerSchema,
  directMatchingAnswerSchema,
  multipleChoiceAnswerSchema,
  selectAllAnswerSchema,
  trueFalseAnswerSchema,
} from "./schema";

const ROUND_UP_DECIMAL = 1;

//lookup-object help determine which function should use for grading based on QuestionType
const GRADING_FUNCTION: {
  [key in QuestionType]: (correctAnswer: any, userAnswer: any) => resultGradeI;
} = {
  //correctAnswer is guarantee to be string array in data base
  COMPLEX_MATCHING: (correctAnswer, userAnswer) =>
    complexMatchingGrade(correctAnswer as string[], userAnswer),
  //correctAnswer is guarantee to be number array
  DIRECT_MATCHING: (correctAnswer, userAnswer) =>
    directMatchingGrade(correctAnswer as number[], userAnswer),
  //correctAnswer is guarantee to be number
  MULTIPLE_CHOICE: (correctAnswer, userAnswer) =>
    multipleChoiceGrade(correctAnswer as number, userAnswer),
  //correctAnswer is guarantee to be boolean array
  SELECT_ALL: (correctAnswer, userAnswer) =>
    selectAllGrade(correctAnswer as boolean[], userAnswer),
  //correctAnswer is guarantee to be boolean array
  TRUE_FALSE: (correctAnswer, userAnswer) =>
    trueFalseGrade(correctAnswer as boolean[], userAnswer),
};

export const QUIZ_TYPE_HANDLER: {
  [key in QuizType]: (param: handleQuizI) => Promise<handleQuizReturnI>;
} = {
  POST_QUIZ: handlePostQuiz,
  PRE_QUIZ: handlePreQuiz,
};

interface handleQuizI {
  quizQuestion: Exclude<getSubpartByQuizQuestionType, null | undefined>;
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
    used: boolean;
  };
}

interface gradingParam {
  questionType: QuestionType;
  userAnswer: number | boolean[] | number[] | number[][] | null;
  correctAnswer: number | boolean[] | string[] | number[];
  maxScore: number;
}
interface resultGradeI {
  errorMessage: string | null;
  errors: string[];
  results: boolean[][];
  correctCount: number;
  total: number;
  skipped: boolean;
  userResponseSubpart: string[];
  categoriesResult: boolean[];
  correctOptionCounts?: number[];
}
interface handleQuizReturnI {
  errorRes: NextResponse | null;
  success: boolean;
}
<<<<<<< HEAD

/** return score, user response that is converted to string array */
export function grading(params: questinoType) {
=======
/**
 * return score, user response that is converted to string array
 */
export function grading(params: gradingParam) {
>>>>>>> origin/quiz_back_end
  const { questionType, userAnswer, correctAnswer, maxScore } = params;

  //correctAnswer is taken from data base which is guarantee the correct type we are looking for
  const resultGrade = GRADING_FUNCTION[questionType](correctAnswer, userAnswer);

  const {
    errorMessage,
    errors,
    correctCount,
    total,
    userResponseSubpart,
    categoriesResult,
    results,
    correctOptionCounts,
  } = resultGrade;
  const score = Math.floor(maxScore * (correctCount / total));
  return {
    errorMessage,
    results,
    errors,
    score,
    userResponseSubpart,
    categoriesResult,
    correctOptionCounts,
  };
}

/**
 * calculate the percentage of people get the question right
 */
export async function getPercentageQuizQuestionRight(
  quizQuestionId: string,
  quizType: QuizType = "POST_QUIZ",
  includeSkipped = false,
) {
  const whereInput: Prisma.QuestionAnswerFirstTimeWhereInput = {
    quizQuestionId: quizQuestionId,
    quizType,
  };
  if (!includeSkipped) {
    whereInput["grade"] = {
      is: {
        skipped: false,
      },
    };
  }
  //count how many people answer correct question
  const countPeopleAnswerCorrectPromise = prisma.questionAnswerFirstTime.count({
    where: {
      ...whereInput,
      correct: true,
    },
  });
  const countPeopleAnswerPromise = prisma.questionAnswerFirstTime.count({
    where: whereInput,
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
  storyId: string,
  numberCorrectAnswer: number,
  quizType: QuizType = "POST_QUIZ",
  includeSkipped = false,
) {
  //create where input
  const whereInput: Prisma.StoryQuizScoreFirstTimeWhereInput = {
    storyId,
    quizType,
  };
  //if not include skip question, add additional search variable
  if (!includeSkipped) {
    whereInput["quizResult"] = {
      is: {
        skippedQuestion: false,
      },
    };
  }

  //count how many people answer correct question
  const countPeopleGetExactScorePromise = prisma.storyQuizScoreFirstTime.count({
    where: {
      ...whereInput,
      totalCorrectAnswer: numberCorrectAnswer,
    },
  });
  const countPeopleGetScoreStoryPromise = prisma.storyQuizScoreFirstTime.count({
    where: whereInput,
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

/** Convert to map key: "categotyIndex OptionIndex" value: boolean */
function convertMapCheck(correctAnswer: string[]) {
  const map: { [key: string]: boolean } = {};
  const countCorrectAnswerRemain: number[] = createArray(
    correctAnswer.length,
    0,
  );
  correctAnswer.forEach((str, index) => {
    //if this category is not empty
    if (str !== "") {
      const numberStr = str.split(" ");
      numberStr.forEach((num) => {
        map[`${index} ${num}`] = true;
        countCorrectAnswerRemain[index]++;
      });
    }
  });
  return { map, countCorrectAnswerRemain };
}

function complexMatchingGrade(
  correctAnswer: string[],
  userAnswer: any,
): resultGradeI {
  const isSkipped = userAnswer === null;
  let errorMessage = null;
  let errors: string[] = [];
  const results: boolean[][] = [];
  let correctCount = 0;
  //convert correctAnswer to map to check answer
  //Map converted in a form map[`categoryIndex optionIndex`])
  const { map, countCorrectAnswerRemain } = convertMapCheck(correctAnswer);
  //make a copy
  const correctOptionCounts = [...countCorrectAnswerRemain];
  //use to check if all option in each categories is all answeared correctly
  const recordCategoriesResult: boolean[] = [];
  const userResponseSubpart: string[] = [];

  //if user skipped, create empty response
  if (isSkipped) {
    correctAnswer.forEach((str) => {
      if (str.length !== 0) {
        const numStr = str.split(" ");
        results.push(createArray(numStr.length, false));
      }
      recordCategoriesResult.push(false);
    });
    return {
      errorMessage,
      errors,
      results,
      correctCount,
      skipped: true,
      total: correctAnswer.length,
      userResponseSubpart,
      categoriesResult: recordCategoriesResult,
    };
  }

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
    const numbersArray = userAnswerParse.data;
    for (let i = 0; i < numbersArray.length; i++) {
      let curResponse = "";
      let isCorrectAll = true;
      const curResult: boolean[] = [];
      numbersArray[i].forEach((number) => {
        const isCorrect = map[`${i} ${number}`] === true;
        if (isCorrect) countCorrectAnswerRemain[i]--;
        else isCorrectAll = false;
        curResult.push(isCorrect);
        curResponse += curResponse.length === 0 ? `${number}` : ` ${number}`;
      });
      const isCurCategoryCorrect =
        countCorrectAnswerRemain[i] === 0 && isCorrectAll;
      recordCategoriesResult.push(isCurCategoryCorrect);
      correctCount += isCurCategoryCorrect ? 1 : 0;
      results.push(curResult);
      userResponseSubpart.push(curResponse);
    }
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total: correctAnswer.length,
    skipped: false,
    userResponseSubpart,
    categoriesResult: recordCategoriesResult,
    correctOptionCounts,
  };
}

function directMatchingGrade(
  correctAnswer: number[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  const isSkipped = userAnswer === null;
  let correctCount = 0;
  const total = correctAnswer.length;
  //use to check if all option in each categories is all answeared correctly
  let recordCategoriesResult: boolean[] = [];
  const userResponseSubpart: string[] = [];

  //if user skipped, create empty response
  if (isSkipped) {
    results = createArray(correctAnswer.length, [false]);
    recordCategoriesResult = createArray(correctAnswer.length, false);
    return {
      errorMessage,
      errors,
      results,
      skipped: true,
      correctCount,
      total,
      userResponseSubpart,
      categoriesResult: recordCategoriesResult,
    };
  }

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
      const isCorrect = numbers[i] === correctAnswer[i];
      correctCount += isCorrect ? 1 : 0;
      results.push([isCorrect]);
      recordCategoriesResult.push(isCorrect);
      userResponseSubpart.push(numbers[i].toString());
    }
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    skipped: false,
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
  const isSkipped = userAnswer === null;
  let correctCount = 0;
  let isCorrect = false;
  const total = 1;
  const userResponseSubpart: string[] = [];

  //if user skipped, create empty response
  if (isSkipped) {
    results.push([false]);
    return {
      errorMessage,
      errors,
      results,
      correctCount,
      total,
      skipped: true,
      userResponseSubpart,
      categoriesResult: [false],
    };
  }

  //check user answer type
  const userAnswerParse = multipleChoiceAnswerSchema.safeParse(userAnswer);
  if (!userAnswerParse.success) {
    errorMessage = userAnswerParse.error.errors[0].message;
    errors = userAnswerParse.error.errors.map((value) => value.message);
  } else {
    const number = userAnswerParse.data;
    isCorrect = number === correctAnswer;
    correctCount += isCorrect ? 1 : 0;
    results.push([isCorrect]);
    userResponseSubpart.push(number.toString());
  }
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    total,
    skipped: false,
    userResponseSubpart,
    categoriesResult: [isCorrect],
  };
}

function selectAllGrade(
  correctAnswer: boolean[],
  userAnswer: any,
): resultGradeI {
  let errorMessage = null;
  let errors: string[] = [];
  let results: boolean[][] = [];
  const isSkipped = userAnswer === null;
  let correctCount = 0;
  const total = correctAnswer.length;
  const userResponseSubpart: string[] = [];

  //if user skipped, create empty response
  if (isSkipped) {
    results = createArray(correctAnswer.length, [false]);
    return {
      errorMessage,
      errors,
      skipped: true,
      results,
      correctCount,
      total,
      userResponseSubpart,
      categoriesResult: [false],
    };
  }

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
    const userAnswer: boolean[] = createArray(correctAnswer.length, false);
    for (let i = 0; i < numberAnsArr.length; i++) {
      userAnswer[numberAnsArr[i]] = true;
    }
    if (!errorMessage) {
      for (let i = 0; i < correctAnswer.length; i++) {
        const isCorrect = userAnswer[i] === correctAnswer[i];
        correctCount += isCorrect ? 1 : 0;
        results.push([isCorrect]);
        userResponseSubpart.push(userAnswer[i] ? "true" : "false");
      }
    }
  }
  //check if all user answers are correct
  const allCorrect =
    results.length != 0 &&
    results.every((result) => result.every((value) => value));
  return {
    errorMessage,
    errors,
    results,
    correctCount,
    skipped: false,
    total,
    userResponseSubpart,
    categoriesResult: [allCorrect],
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
  const total = correctAnswer.length;
  let userResponseSubpart: string[] = [];
  let recordCategoriesResult: boolean[] = [];
  const isSkipped = userAnswer === null;

  //if user skipped, create empty response
  if (isSkipped) {
    recordCategoriesResult = createArray(correctAnswer.length, false);
    results = createArray(correctAnswer.length, [false]);
    return {
      errorMessage,
      errors,
      results,
      skipped: true,
      correctCount,
      total,
      userResponseSubpart,
      categoriesResult: recordCategoriesResult,
    };
  }

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
    skipped: false,
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

  const userGrades = await prisma.grade.findMany({
    where: {
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      quizResultId: quizResult.id,
    },
    select: {
      id: true,
    },
  });

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
  //store user first answer
  await insertIfNotExists<
    "QuestionAnswerFirstTime",
    Prisma.QuestionAnswerFirstTimeWhereInput,
    Prisma.QuestionAnswerFirstTimeUncheckedCreateInput
  >({
    model: "QuestionAnswerFirstTime",
    where: {
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      quizType: "PRE_QUIZ",
    },
    data: {
      gradeId: gradeCreate.id,
      quizType: "PRE_QUIZ",
      userId: userId,
      quizQuestionId: quizQuestion.quizQuestionId,
      correct: isCorrect,
    },
  });
  return {
    errorRes: null,
    success: true,
  };
}

interface aggregateGradeI {
  _id: {
    $oid: string;
  };
  firstGrade: {
    totalScore: number;
    maxScore: number;
    createAt: {
      $date: string;
    };
    questionType: QuestionType;
    categoriesResult: boolean[];
  };
}

/**
 * calculate to get total score and max score
 * calculate how many question user answer right first time
 * create Grade for other quiz question that user not answered
 * Update total score, total question, maxScore, and amount of questions user answer right
 */
export async function updatePreQuiz(userId: string, storyId: string) {
  //get pre-quiz result
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
  //no update is needed if not exist
  if (!preQuizResult) {
    return {
      errorRes: null,
      success: true,
    };
  }
  //get all quiz question
  const quizzesPromise = prisma.quizQuestion.findMany({
    where: {
      storyId: storyId,
      deleted: false,
    },
    select: {
      id: true,
      maxScore: true,
    },
  });

  //get all grades
  const gradesPromise = prisma.grade.aggregateRaw({
    pipeline: [
      {
        $match: { quizResultId: { $oid: preQuizResult.id } },
      },
      {
        $sort: { createAt: 1 },
      },
      {
        $group: {
          _id: "$quizQuestionId",
          firstGrade: {
            $first: {
              totalScore: "$totalScore",
              createAt: "$createAt",
              questionType: "$questionType",
              categoriesResult: "$categoriesResult",
            },
          },
        },
      },
    ],
  });
  const fetchResult = await Promise.all([gradesPromise, quizzesPromise]);
  const grades = fetchResult[0] as unknown as aggregateGradeI[];
  const quizzes = fetchResult[1];

  if (!grades) {
    return {
      errorRes: null,
      success: true,
    };
  }

  //convert grades array into grade map with key is quiz question id
  //this help check if user answered quiz question
  const gradesMap = new Map<string, aggregateGradeI>();
  grades.forEach((grade) => gradesMap.set(grade._id.$oid, grade));

  const totalQuestion = quizzes.length;
  const maxScore = quizzes.reduce(
    (total, current) => total + current.maxScore,
    0,
  );

  //record how many question user anwer correctly and how many score user get
  let totalCorrectAnswer = 0;
  let totalScore = 0;

  //array of quiz that user haven't answer
  const quizRemain: typeof quizzes = [];
  //check each quiz if user answered
  //if grade exist mean user answered quiz -> add to total record
  //else add in quiz remain to create grade later
  quizzes.forEach((quiz) => {
    const quizGraded = gradesMap.get(quiz.id);
    if (quizGraded) {
      const firstGraded = quizGraded.firstGrade;
      const isCorrect = firstGraded.categoriesResult.every((result) => result);
      totalCorrectAnswer += isCorrect ? 1 : 0;
      totalScore += firstGraded.totalScore;
    } else {
      quizRemain.push(quiz);
    }
  });
  const subpartRemainPrommise = quizRemain.map((quiz) =>
    getSubpartByQuizQuestion(quiz.id, true, true),
  );

  const subpartRemain = await Promise.all(subpartRemainPrommise);
  //if subpart not exist, then not create grade
  const gradeResultArr = subpartRemain.map((subpart) => {
    if (!subpart) return null;
    return grading({ ...subpart, userAnswer: null });
  });

  //create remaining missing grade and mark as skipped
  const dataCreateMissingGrades: Prisma.GradeUncheckedCreateInput[] = [];
  gradeResultArr.forEach((grade, index) => {
    const subpart = subpartRemain[index];
    if (subpart && grade) {
      dataCreateMissingGrades.push({
        questionType: subpart.questionType,
        userId: userId,
        quizQuestionId: subpart.quizQuestionId,
        userAns: [],
        result: grade.results.map((result) =>
          result.map((isCorrect) => (isCorrect ? "true" : "false")).join(" "),
        ),
        categoriesResult: grade.categoriesResult,
        totalScore: 0,
        maxScore: subpart.maxScore,
        quizResultId: preQuizResult.id,
        skipped: true,
      });
    }
  });
  const createGrades = await Promise.all(
    dataCreateMissingGrades.map((data) =>
      prisma.grade.create({ data, select: { id: true, quizQuestionId: true } }),
    ),
  );
  //create remaining missing user first time answer of pre quiz
  const createQuestionAnsFirstTimePromise =
    prisma.questionAnswerFirstTime.createMany({
      data: createGrades.map((gradeCreated) => ({
        quizQuestionId: gradeCreated.quizQuestionId,
        correct: false,
        quizType: "PRE_QUIZ",
        userId,
        gradeId: gradeCreated.id,
      })),
    });
  const createQuizScoreFirstTimePromise = prisma.storyQuizScoreFirstTime.create(
    {
      data: {
        userId,
        storyId: storyId,
        totalCorrectAnswer,
        quizType: "PRE_QUIZ",
        quizResultId: preQuizResult.id,
      },
      select: {
        id: true,
      },
    },
  );
  //lock prequiz
  const updatePreQuizPromise = prisma.quizResult.update({
    where: {
      id: preQuizResult.id,
    },
    data: {
      maxScore,
      score: totalScore,
      totalQuestion,
      totalCorrectAnswer,
      skippedQuestion: quizRemain.length !== 0,
      lastUpdate: new Date(),
    },
    select: {
      id: true,
    },
  });
  await Promise.all([
    createQuestionAnsFirstTimePromise,
    updatePreQuizPromise,
    createQuizScoreFirstTimePromise,
  ]);

  return {
    errorRes: null,
    success: true,
  };
}

//grade the post-quiz
//if pre-quiz-result exist, then update the pre-quiz-result then grade post-quiz
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
  //if post-quiz-result used is false, mean pre quiz result is not updated
  //update pre-quiz
  if (!quizResult.used) {
    const { errorRes, success } = await updatePreQuiz(
      userId,
      quizResult.storyId,
    );
    if (!success) {
      return {
        errorRes,
        success,
      };
    }
  }

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
      used: true,
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
          quizType: "POST_QUIZ",
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
  let userFirstScorePromise = new Promise((resolve) => {
    resolve(0);
  });
  if (isLastQuestion) {
    userFirstScorePromise = insertIfNotExists<
      "StoryQuizScoreFirstTime",
      Prisma.StoryQuizScoreFirstTimeWhereInput,
      Prisma.StoryQuizScoreFirstTimeUncheckedCreateInput
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
        userId,
        storyId: quizResult.storyId,
        totalCorrectAnswer: quizResult.totalCorrectAnswer + (isCorrect ? 1 : 0),
        quizResultId: quizResult.id,
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
    return {
      data: result,
      inserted: true,
    };
  } else {
    return {
      data: null,
      inserted: false,
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    /* eslint-enable @typescript-eslint/no-unsafe-call */
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
  }
}
function createArray<T>(length: number, defaultValue: T) {
  const arr: T[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(defaultValue);
  }
  return arr;
}
