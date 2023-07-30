import { z } from "zod";

export const getSchema = z.object({
  user_id: z
  .string({
    required_error: "user_id is required",
    invalid_type_error: "user_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
})

export const postSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),

  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
});