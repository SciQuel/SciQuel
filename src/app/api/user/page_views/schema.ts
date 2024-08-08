import { z } from "zod";

const DEFAULT_LIMIT = 10;

export const getSchema = z.object({
  distinct: z
    .boolean({
      invalid_type_error: "distince must be a boolean",
    })
    .default(false),
  page: z
    .number({
      invalid_type_error: "page must be a non-negative int number",
    })
    .int("page must be a int number")
    .nonnegative("page must be a non-negative number")
    .default(0),
  limit: z
    .number({
      invalid_type_error: "limit must be a non-negative int number",
    })
    .int("limit must be a int number")
    .nonnegative("limit must be a non-negative number")
    .default(DEFAULT_LIMIT),
});

export const postSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
  time_zone: z
    .number({
      invalid_type_error: "time_zone must be an int number",
      required_error: "time_zone is required in the body",
    })
    .int("limit must be a int number")
    .gte(-12, "minimum of time_zone is -12")
    .lte(14, "maximum of time_zone is 14"),
});
