import prisma from "@/lib/prisma";
import { QuestionType, QuizType } from "@prisma/client";
import { getSubpart, getSubpartReturnType } from "../tools/SubpartQuiz";

interface convertAnsI {
  userAns: string[];
  questionType: QuestionType;
  correctAns: string[] | boolean[] | number | number[];
}
interface QuizRecordI {
  storyId: string;
  maxScore: number;
  quizQuestionIdRemain: string[];
  grade: {
    quizQuestionId: string;
    quizQuestion: {
      subpartId: string;
      questionType: QuestionType;
    };
    totalScore: number;
    maxScore: number;
    userAns: string[];
    result: string[];
    categoriesResult: boolean[];
  }[];
  quizType: QuizType;
  score: number;
  createAt: Date;
}

//get quiz result of user
//if no storyId is included,
//get the recent or first quizResult of userId base on all the stories
export async function getQuizResult(
  type: "RECENT" | "FIRST",
  userId: string,
  storyId?: string | null,
) {
  const quizResult = await prisma.quizResult.findFirst({
    where: storyId
      ? {
          userId: userId,
          storyId: storyId,
        }
      : {
          userId: userId,
        },
    select: {
      storyId: true,
      quizType: true,
      maxScore: true,
      score: true,
      createAt: true,
      quizQuestionIdRemain: true,
      grade: {
        select: {
          id: true,
          categoriesResult: true,
          quizQuestionId: true,
          quizQuestion: {
            select: {
              subpartId: true,
              questionType: true,
            },
          },
          totalScore: true,
          maxScore: true,
          userAns: true,
          result: true,
        },
      },
    },
    orderBy: {
      createAt: type === "FIRST" ? "asc" : "desc",
    },
  });
  const subpartArrPromise =
    quizResult?.grade.map(({ quizQuestion }) =>
      getSubpart(quizQuestion, true),
    ) || [];
  const subpartArr = await Promise.all(subpartArrPromise);
  return {
    quizResult,
    subpartArr,
  };
}

//create quizResult resposne for the front-end
export function createResponseQuizResult(
  quizResult: QuizRecordI | null,
  subpartArr: getSubpartReturnType[],
) {
  if (!quizResult) return null;
  const {
    grade,
    createAt,
    storyId,
    score,
    maxScore,
    quizType,
    quizQuestionIdRemain,
  } = quizResult;
  const resultAns = grade.map(({ userAns, quizQuestion }, index) => {
    const result = convertAns({
      userAns,
      questionType: quizQuestion.questionType,
      correctAns: subpartArr[index].correctAnswer,
    });
    return {
      userAnsConvert: result.userAnswer,
      correctAnsConvert: result.correctAnswer,
    };
  });
  return {
    story_id: storyId,
    score,
    max_score: maxScore,
    quiz_type: quizType,
    create_at: createAt,
    quiz_question_id_remain: quizQuestionIdRemain,
    grades: grade.map((curGrade, index) => {
      const {
        quizQuestionId,
        totalScore,
        maxScore,
        result,
        categoriesResult,
        quizQuestion,
      } = curGrade;
      return {
        total_score: totalScore,
        max_score: maxScore,
        quiz_question_id: quizQuestionId,
        user_answer: resultAns[index].userAnsConvert,
        correct_answer: resultAns[index].correctAnsConvert,
        categories_result: categoriesResult,
        questions: subpartArr[index].questions,
        question: subpartArr[index].question,
        content_category: subpartArr[index].contentCategory,
        options: subpartArr[index].options,
        categories: subpartArr[index].categories,
        result: stringArrToBool2DArr(result),
        question_type: quizQuestion.questionType,
      };
    }),
  };
}

function convertAns(params: convertAnsI) {
  const { userAns, correctAns, questionType } = params;
  let userAnswerConvert: any = [];
  let correctAnswerConvert: any = [];
  if (questionType === "COMPLEX_MATCHING") {
    userAnswerConvert = stringArrToNumberArr(userAns);
    correctAnswerConvert = stringArrToNumberArr(correctAns as string[]);
  } else if (questionType === "DIRECT_MATCHING") {
    correctAnswerConvert = correctAns as number[];
    userAnswerConvert = stringArrToNumberArr(userAns, false);
  } else if (questionType === "MULTIPLE_CHOICE") {
    correctAnswerConvert = correctAns as number;
    userAnswerConvert = Number(userAns[0]);
  } else if (questionType === "SELECT_ALL") {
    (correctAns as boolean[]).forEach((choosed, index) => {
      if (choosed) correctAnswerConvert.push(index);
    });
    userAns.forEach((choosed, index) => {
      if (choosed === "true") userAnswerConvert.push(index);
    });
  } else if (questionType === "TRUE_FALSE") {
    correctAnswerConvert = correctAns as boolean[];
    userAnswerConvert = stringArrToBoolArr(userAns);
  } else {
    throw new Error(
      "Unknown type " + String(questionType) + " in convertAns function",
    );
  }
  return {
    userAnswer: userAnswerConvert,
    correctAnswer: correctAnswerConvert,
  };
}

function stringArrToNumberArr(arr: string[], is2D = true) {
  let numberArr: number[][] | number[] = [];
  for (let i = 0; i < arr.length; i++) {
    const str = arr[i];
    if (is2D) (numberArr as number[][]).push([]);
    if (str.length !== 0) {
      const numsStr = str.split(" ");
      for (let j = 0; j < numsStr.length; j++) {
        const num = numsStr[j];
        if (is2D) (numberArr as number[][])[i].push(Number(num));
        else (numberArr as number[]).push(Number(num));
      }
    }
  }
  return numberArr;
}
function stringArrToBoolArr(arr: string[]) {
  let boolArr: boolean[] = [];
  arr.forEach((str, index) => {
    boolArr.push(str === "true");
  });
  return boolArr;
}
function stringArrToBool2DArr(arr: string[]) {
  let bool2DArr: boolean[][] = [];
  arr.forEach((str, index) => {
    bool2DArr.push([]);
    str.split(" ").forEach((strBool) => {
      bool2DArr[index].push(strBool === "true");
    });
  });
  return bool2DArr;
}
