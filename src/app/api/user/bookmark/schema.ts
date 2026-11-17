import { z } from "zod";

export const requestSchema = z.object({
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

  user_email: z.string({
    error: (issue) =>
      issue.input === undefined ? "user_email is required" : undefined,
  }),
});
