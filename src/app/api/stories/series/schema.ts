import { z } from "zod";

export const getSchema = z.object({
  series_id: z
    .string({
      required_error: "series_id is required",
      invalid_type_error: "series_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "series_id must be a valid ObjectId" }),
});

export const postSchema = z.object({
  name: z.string(),
  story_ids: z
    .array(
      z.string().regex(/^[0-9a-f]{24}$/, {
        message: "story_id must be a valid ObjectId",
      }),
    )
    .nonempty({ message: "story_ids must not be empty" }),
});

export const putSchema = z.object({
  series_id: z.string().regex(/^[0-9a-f]{24}$/, {
    message: "series_id must be a valid ObjectId",
  }),
  name: z.string(),
  story_ids: z
    .array(
      z.string().regex(/^[0-9a-f]{24}$/, {
        message: "story_id must be a valid ObjectId",
      }),
    )
    .nonempty({ message: "story_ids must not be empty" }),
});
