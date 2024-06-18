import { QuizType } from "@prisma/client";
import { z } from "zod";

const DEFAULT_MAX_POINT = 10;

export const quizTypeSchema = z.nativeEnum(QuizType, {
  required_error: "quiz_type is required in url url query parameters",
  invalid_type_error:
    "Invalid quiz_type.  Valid quiz_type: " +
    Object.values(QuizType).map((en) => en[0]),
});
export const storyIdSchema = z
  .string({
    required_error: "story_id is required in url query parameters",
    invalid_type_error: "story_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" });
export const quizQuestionIdSchema = z
  .string({
    required_error: "quiz_question_id is required in url query parameters",
    invalid_type_error: "quiz_question_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, {
    message: "quiz_question_id must be a valid ObjectId",
  });

export const complexMatchingSubpartSchema = z
  .object({
    question: z.string({
      required_error: "question is required",
      invalid_type_error: "question must be a string",
    }),
    categories: z.array(
      z.string({ invalid_type_error: "value in categories must be a string" }),
      {
        required_error: "categories is required",
        invalid_type_error: "categories must be a string array",
      },
    ),
    options: z.array(
      z.string({ invalid_type_error: "value in options must be a string" }),
      {
        required_error: "options is required",
        invalid_type_error: "options must be a string array",
      },
    ),
    correct_answers: z.array(
      z.array(
        z
          .number({
            invalid_type_error:
              "value in correct_answers must be a nonnegative integer",
          })
          .nonnegative({
            message: "value in correct_answers must be a nonnegative",
          })
          .int({ message: "value in correct_answers must be a integer" }),
        {
          invalid_type_error:
            "value is correct_answers array must be a nonnegative integer array",
        },
      ),
      {
        required_error: "correct_answers is required",
        invalid_type_error:
          "correct_answers must be a nonnegative integer 2D array",
      },
    ),
    explanations: z.array(
      z.string({
        invalid_type_error: "value in explanations must be a string",
      }),
      {
        required_error: "explanations is required",
        invalid_type_error: "explanations must be a string array",
      },
    ),
  })
  //check if all length array are equal
  .refine(
    ({ categories, correct_answers, explanations }) =>
      compareAllEqual([categories, correct_answers, explanations]),
    {
      message:
        "The length array of categories, correct_answers and explanations must be all equal",
    },
  )
  //check if there is duplicate index answer
  .refine(({ correct_answers }) => !isDuplicate(correct_answers), {
    message: "There must be no duplicate index in correct_answers",
  })
  //check if index answer is out of bound
  .refine(
    ({ correct_answers, options }) => !isOutOfBound(correct_answers, options),
    {
      message:
        "index in correct_answers array must be smaller than options length",
    },
  );
export const directMatchingSubpartSchema = z
  .object({
    question: z.string({
      required_error: "question is required",
      invalid_type_error: "question must be a string",
    }),
    categories: z.array(
      z.string({ invalid_type_error: "value in categories must be a string" }),
      {
        required_error: "categories is required",
        invalid_type_error: "categories must be a string array",
      },
    ),
    options: z.array(
      z.string({ invalid_type_error: "value in options must be a string" }),
      {
        required_error: "options is required",
        invalid_type_error: "options must be a string array",
      },
    ),
    correct_answers: z.array(
      z
        .number({
          invalid_type_error:
            "value in correct_answer must be a nonnegative int number",
        })
        .int()
        .nonnegative(),
      {
        required_error: "correct_answers is required",
        invalid_type_error:
          "correct_answers must be a nonnegative integer array",
      },
    ),
    explanations: z.array(
      z.string({
        invalid_type_error: "value in explanations must be a string",
      }),
      {
        required_error: "explanations is required",
        invalid_type_error: "explanations must be a string array",
      },
    ),
  })
  //check if all length array are equal
  .refine(
    ({ categories, options, correct_answers, explanations }) =>
      compareAllEqual([categories, correct_answers, explanations, options]),
    {
      message:
        "The length array of categories, options, correct_answers and explanations must be all equal",
    },
  )
  //check if there is duplicate index answer
  .refine(({ correct_answers }) => !isDuplicate(correct_answers), {
    message: "There must be no duplicate index in correct_answers",
  })
  //check if index answer is out of bound
  .refine(
    ({ correct_answers, options }) => !isOutOfBound(correct_answers, options),
    {
      message:
        "index in correct_answers array must be smaller than options length",
    },
  );

export const trueFalseSubpartSchema = z
  .object({
    questions: z.array(
      z.string({
        invalid_type_error: "value in questions must be a string",
      }),
      {
        required_error: "questions is required",
        invalid_type_error: "questions must be a string array",
      },
    ),
    correct_answers: z.array(
      z.boolean({
        invalid_type_error: "value in correct_answers must be a boolean",
      }),
      {
        required_error: "correct_answers is required",
        invalid_type_error: "explanations must be a boolean array",
      },
    ),
    explanations: z.array(
      z.string({
        invalid_type_error: "value in explanations must be a string",
      }),
      {
        required_error: "explanations is required",
        invalid_type_error: "explanations must be a string array",
      },
    ),
  })
  .refine(
    ({ questions, correct_answers, explanations }) =>
      compareAllEqual([questions, correct_answers, explanations]),
    {
      message:
        "The length array of categories, options, correct_answers and explanations must be all equal",
    },
  );

export const multipleChoiceSubpartSchema = z
  .object({
    question: z.string({
      required_error: "question is required",
      invalid_type_error: "question must be a string",
    }),
    options: z.array(
      z.string({ invalid_type_error: "value in options must be a string" }),
      {
        required_error: "options is required",
        invalid_type_error: "options must be a string array",
      },
    ),
    correct_answer: z
      .number({
        invalid_type_error: "answer must be a nonnegative integer",
      })
      .nonnegative({ message: "value must be a nonnegative" })
      .int({ message: "value must be a integer" }),
    explanations: z.array(
      z.string({
        invalid_type_error: "value in explanations must be a string",
      }),
      {
        required_error: "explanations is required",
        invalid_type_error: "explanations must be a string array",
      },
    ),
  })
  .refine(
    ({ options, explanations }) => compareAllEqual([explanations, options]),
    {
      message:
        "The lengths array of explanations and options must be all equal",
    },
  )
  .refine(
    ({ correct_answer, options }) => !isOutOfBound([correct_answer], options),
    {
      message: "the correct_answer index number must be smaller options length",
    },
  );

export const selectAllSubpartSchema = z
  .object({
    question: z.string({
      required_error: "question is required",
      invalid_type_error: "question must be a string",
    }),
    options: z.array(
      z.string({ invalid_type_error: "value in options must be a string" }),
      {
        required_error: "options is required",
        invalid_type_error: "options must be a string array",
      },
    ),
    correct_answers: z.array(
      z
        .number({
          invalid_type_error:
            "value in correct_answer must be a nonnegative int number",
        })
        .int({ message: "value in correct_answer must be a integer number" })
        .nonnegative({
          message: "value in correct_answer must be a nonnegative number",
        }),
      {
        required_error: "correct_answers is required",
        invalid_type_error:
          "correct_answers must be a nonnegative integer array",
      },
    ),
    explanations: z.array(
      z.string({
        invalid_type_error: "value in explanations must be a string",
      }),
      {
        required_error: "explanations is required",
        invalid_type_error: "explanations must be a string array",
      },
    ),
  })
  //check if all array equal
  .refine(
    ({ options, explanations }) => compareAllEqual([explanations, options]),
    {
      message:
        "The lengths array of explanations, and options must be all equal",
    },
  )
  //check if index answer is out of bound
  .refine(
    ({ options, correct_answers }) => !isOutOfBound(correct_answers, options),
    {
      message:
        "index in correct_answers array must be smaller than options length",
    },
  );
export const modifiedQuizSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
  content_category: z.string({
    required_error: "content_category is required",
    invalid_type_error: "content_category must be a string",
  }),
  question_type: z.enum(
    [
      "MULTIPLE_CHOICE",
      "TRUE_FALSE",
      "DIRECT_MATCHING",
      "COMPLEX_MATCHING",
      "SELECT_ALL",
    ],
    {
      invalid_type_error:
        "Invalid question_type.  Valid question_type: MULTIPLE_CHOICE | TRUE_FALSE | DIRECT_MATCHING | COMPLEX_MATCHING | SELECT_ALL",
    },
  ),
  max_score: z
    .number({
      invalid_type_error: "max_score must be a nonnegative int number",
    })
    .int()
    .nonnegative()
    .default(DEFAULT_MAX_POINT),
  subpart: z.any(),
  subheader: z.string({
    required_error: "subheader is required",
    invalid_type_error: "subheader must be a string",
  }),
});
export const getQuizzesSchema = z.object({
  storyId: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});

//Checking value function

//check if all array length are equals to each other
function compareAllEqual(values: any[][]) {
  const len = values.length;
  if (len === 0) return true;
  for (let i = 1; i < values.length; i++) {
    const m = values[0].length;
    const n = values[i].length;
    if (m !== n) return false;
  }
  return true;
}

//check if there is duplicate number in array
function isDuplicate(arr: number[] | number[][]) {
  if (arr.length === 0) return false;
  const set: { [key: number]: number } = {};
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      //confirm this index arr is 2d array
      arr = arr as number[][];
      for (let j = 0; j < arr[i].length; j++) {
        const num = arr[i][j];
        if (set[num]) return true;
      }
    } else {
      //confirm this index arr is 1d array
      arr = arr as number[];
      const num = arr[i];
      if (set[num]) return true;
    }
  }
  return false;
}
//check if answer index is out of bound
function isOutOfBound(answears: number[] | number[][], options: string[]) {
  //check if answears is 2d array
  for (let i = 0; i < answears.length; i++) {
    if (Array.isArray(answears[i])) {
      //confirm answears is 2d array
      answears = answears as number[][];
      for (let j = 0; j < answears[i].length; j++) {
        const num = answears[i][j];
        if (num >= options.length) return true;
      }
    } else {
      //confirm answears is 1d array
      answears = answears as number[];
      const num = answears[i];
      if (num >= options.length) return true;
    }
  }
  return false;
}
