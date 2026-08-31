import { z } from "zod";

export const getSchema = z.object({
  user_id: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "user_id is required"
          : "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      error: "user_id must be a valid ObjectId",
    }),
});

export const postSchema = z.object({
  story_id: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "story_id is required"
          : "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      error: "story_id must be a valid ObjectId",
    }),

  user_id: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "user_id is required"
          : "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, {
      error: "user_id must be a valid ObjectId",
    }),
});
