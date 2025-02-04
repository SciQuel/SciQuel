import prisma from "@/lib/prisma";
import { type QuestionType, type QuizType } from "@prisma/client";
import { getSubpartById } from "../tools/SubpartQuiz";

type AnsConvertType = (
  userAns: string[],
  correctAns: number | string[] | boolean[] | number[],
) => {
  userAnswerConvert: number | number[] | number[][] | boolean[] | null;
  correctAnswerConvert: number | number[] | number[][] | boolean[];
};
type getQuizResultType = Awaited<ReturnType<typeof getQuizResult>>;
const ANS_CONVERT: { [key in QuestionType]: AnsConvertType } = {
  COMPLEX_MATCHING: (userAns, correctAns) => ({
    correctAnswerConvert: stringArrToNumberArr(correctAns as string[]),
    userAnswerConvert:
      userAns.length !== 0 ? stringArrToNumberArr(userAns) : null,
  }),
  DIRECT_MATCHING: (userAns, correctAns) => ({
    correctAnswerConvert: correctAns as number[],
    userAnswerConvert:
      userAns.length !== 0 ? stringArrToNumberArr(userAns, false) : null,
  }),
  MULTIPLE_CHOICE: (userAns, correctAns) => ({
    correctAnswerConvert: correctAns as number,
    userAnswerConvert: userAns.length !== 0 ? Number(userAns[0]) : null,
  }),
  TRUE_FALSE: (userAns, correctAns) => ({
    correctAnswerConvert: correctAns as boolean[],
    userAnswerConvert:
      userAns.length !== 0 ? stringArrToBoolArr(userAns) : null,
  }),
  SELECT_ALL: (userAns, correctAns) => {
    const correctAnswerConvert: number[] = [];
    const userAnswerConvert: number[] | null = userAns.length !== 0 ? [] : null;
    (correctAns as boolean[]).forEach((choosed, index) => {
      if (choosed) correctAnswerConvert.push(index);
    });
    if (userAnswerConvert) {
      userAns.forEach((choosed, index) => {
        if (choosed === "true") userAnswerConvert.push(index);
      });
    }
    return {
      correctAnswerConvert,
      userAnswerConvert,
    };
  },
};
//get quiz result of user
//if no storyId is included,
//get the recent or first quizResult of userId base on all the stories
export async function getQuizResult(
  type: "RECENT" | "FIRST",
  userId: string,
  quizType: QuizType,
  storyId?: string | null,
) {
  const quizResult = await prisma.quizResult.findFirst({
    where: storyId
      ? {
          userId: userId,
          storyId: storyId,
          quizType,
        }
      : {
          userId: userId,
          quizType,
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
          createAt: true,
        },
      },
    },
    orderBy: {
      createAt: type === "FIRST" ? "asc" : "desc",
    },
  });
  const subpartArrPromise =
    quizResult?.grade.map(({ quizQuestion }) =>
      getSubpartById(quizQuestion, true, true),
    ) || [];
  const subpartArr = await Promise.all(subpartArrPromise);
  return {
    quizResult,
    subpartArr,
  };
}

//create quizResult resposne for the front-end
export function createResponseQuizResult(param: getQuizResultType) {
  const { quizResult, subpartArr } = param;
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
    //if subpart not exist return null
    if (!subpartArr[index]) {
      return {
        userAnsConvert: null,
        correctAnsConvert: null,
      };
    }
    //convert answer from databse for front end
    const result = ANS_CONVERT[quizQuestion.questionType](
      userAns,
      //unusual error where subpartArr[index] can be null even it had been checked
      //'!' symbol fix the issue
      subpartArr[index]!.correctAnswer,
    );
    return {
      userAnsConvert: result.userAnswerConvert,
      correctAnsConvert: result.correctAnswerConvert,
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
        createAt,
      } = curGrade;
      return {
        total_score: totalScore,
        max_score: maxScore,
        quiz_question_id: quizQuestionId,
        user_answer: resultAns[index].userAnsConvert,
        correct_answer: resultAns[index].correctAnsConvert,
        categories_result: categoriesResult,
        questions: subpartArr[index]?.questions,
        question: subpartArr[index]?.question,
        content_category: subpartArr[index]?.contentCategory,
        options: subpartArr[index]?.options,
        categories: subpartArr[index]?.categories,
        result: stringArrToBool2DArr(result),
        question_type: quizQuestion.questionType,
        create_at: createAt,
      };
    }),
  };
}

function stringArrToNumberArr(arr: string[], is2D = true) {
  const numberArr: number[][] | number[] = [];
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
  const boolArr: boolean[] = [];
  arr.forEach((str) => {
    boolArr.push(str === "true");
  });
  return boolArr;
}
function stringArrToBool2DArr(arr: string[]) {
  const bool2DArr: boolean[][] = [];
  arr.forEach((str, index) => {
    bool2DArr.push([]);
    str.split(" ").forEach((strBool) => {
      bool2DArr[index].push(strBool === "true");
    });
  });
  return bool2DArr;
}
