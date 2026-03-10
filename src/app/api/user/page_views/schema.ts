import { z } from "zod";

const DEFAULT_LIMIT = 10;

export const getSchema = z.object({
  distinct: z.preprocess(
    (value) => {
      if (value) {
        const checkStr = (value as string).toLowerCase();
        if (checkStr === "false") return false;
        if (checkStr === "true") return true;
      }
      return value;
    },
    z
      .boolean({
        invalid_type_error: "distince must be a boolean",
      })
      .default(false),
  ),
  page: z.preprocess(
    (value) => {
      const checkNum = Number(value);
      if (isNaN(checkNum)) return 0;
      return checkNum;
    },
    z
      .number({
        invalid_type_error: "page must be a non-negative int number",
      })
      .int("page must be a int number")
      .nonnegative("page must be a non-negative number"),
  ),
  limit: z.preprocess(
    (value) => {
      const checkNum = Number(value);
      if (isNaN(checkNum)) return DEFAULT_LIMIT;
      return checkNum;
    },
    z
      .number({
        invalid_type_error: "limit must be a non-negative int number",
      })
      .int("limit must be a int number")
      .nonnegative("limit must be a non-negative number"),
  ),
});

export const postSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});
