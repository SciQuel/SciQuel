import { z } from "zod";

export const questionTypeSchema = z.enum(
  [
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "DIRECT_MATCHING",
    "COMPLEX_MATCHING",
    "SELECT_ALL",
  ],
  {
    required_error: "question_type is required",
    invalid_type_error:
      "Invalid question_type.  Valid question_type: MULTIPLE_CHOICE | SELECT_ALL | COMPLEX_MATCHING | DIRECT_MATCHING | TRUE_FALSE",
  },
);

export const storyIdSchema = z
  .string({
    required_error: "story_id is required",
    invalid_type_error: "story_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, {
    message: "story_id must be a valid ObjectId",
  });

export const postSchema = z.object({
  quiz_question_id: z
    .string({
      required_error: "quiz_question_id is required",
      invalid_type_error: "quiz_question_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      message: "quiz_question_id must be a valid ObjectId",
    }),
  quiz_record_id: z
    .string({
      required_error: "quiz_record_id is required",
      invalid_type_error: "quiz_record_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      message: "quiz_record_id must be a valid ObjectId",
    }),
  answer: z.any({
    required_error: "answer is required",
  }),
});
export const complexMatchingAnswerSchema = z
  .array(
    z.array(
      z
        .number({
          invalid_type_error: "value in answer must be a nonnegative integer",
        })
        .nonnegative({ message: "value in answer must be a nonnegative" })
        .int({ message: "value in answer must be a integer" }),
      {
        invalid_type_error:
          "value is answer array must be a nonnegative integer array",
      },
    ),
    {
      required_error: "answer is required",
      invalid_type_error: "answer must be a nonnegative integer 2D array",
    },
  )
  //check if there is duplicate index answer
  .refine((arr) => !isDuplicate(arr), {
    message: "There must be no duplicate index in answer",
  });

export const directMatchingAnswerSchema = z
  .array(
    z
      .number({
        invalid_type_error:
          "value in correct_answer must be a nonnegative int number",
      })
      .int(),
    {
      required_error: "answer is required",
      invalid_type_error: "answer must be a nonnegative integer array",
    },
  )
  //check if number is nonnegative (except -1 which represent no answer)
  .refine((arr) => arr.every((number) => number >= 0 || number === -1), {
    message: "There must be no negative number, except -1, in answer",
  })
  //check if there is duplicate index answer (except -1 which represent no answer)
  .refine((arr) => !isDuplicate(arr, [-1]), {
    message: "There must be no duplicate index, except -1, in answer",
  });

export const trueFalseAnswerSchema = z.array(
  z.boolean({
    invalid_type_error: "value in answer must be a boolean",
  }),
  {
    required_error: "answer is required",
    invalid_type_error: "explanations must be a boolean array",
  },
);
export const multipleChoiceAnswerSchema = z
  .number({
    invalid_type_error: "answer must be a nonnegative integer , except -1",
  })
  .int({ message: "value in answer must be a integer" })
  //check if number is nonnegative (except -1 which represent no answer)
  .refine((number) => number >= 0 || number === -1, {
    message: "There must be no negative number, except -1, in answer",
  });

export const selectAllAnswerSchema = z.array(
  z
    .number({
      invalid_type_error: "value in answer must be a nonnegative int number",
    })
    .int({ message: "value in correct_answer must be a integer number" })
    .nonnegative({ message: "value in answer must be a nonnegative number" }),
  {
    required_error: "answer is required",
    invalid_type_error: "answer must be a nonnegative integer array",
  },
);

//Checking value function

//check if there is duplicate number in array
function isDuplicate(arr: number[] | number[][], excludeNumber: number[] = []) {
  if (arr.length === 0) return false;
  const set: { [key: number]: boolean } = {};
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      //confirm this index arr is 2d array
      arr = arr as number[][];
      for (let j = 0; j < arr[i].length; j++) {
        const num = arr[i][j];
        if (excludeNumber.includes(num)) continue;
        if (set[num]) return true;
        set[num] = true;
      }
    } else {
      //confirm this index arr is 1d array
      arr = arr as number[];
      const num = arr[i];
      if (excludeNumber.includes(num)) continue;
      if (set[num]) return true;
      set[num] = true;
    }
  }
  return false;
}
