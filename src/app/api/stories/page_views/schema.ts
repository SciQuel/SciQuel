import { StoryTopic } from "@prisma/client";
import { z } from "zod";

export const getSchema = z.object({
  story_id: z
    .string({
      required_error: "story_id is required",
      invalid_type_error: "story_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "story_id must be a valid ObjectId" }),
});

export const postSchema = z.object({
  topic: z.nativeEnum(StoryTopic, {
    required_error: "topic is required in body",
  }),
  start_date: z
    .string({
      invalid_type_error: "start_date must be a date string",
      required_error: "start_date is required in body",
    })
    .datetime({
      message:
        "Invalid string start_date. Try use toISOString() function from Date class",
    }),
  end_date: z
    .string({
      invalid_type_error: "end_date must be a date string",
      required_error: "end_date is required in body",
    })
    .datetime({
      message:
        "Invalid string end_date. Try use toISOString() function from Date class",
    }),
});
