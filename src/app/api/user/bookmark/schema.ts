import { z } from "zod";

export const requestSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),

  user_email: z.string({
    required_error: "user_email is required",
  }),
});
