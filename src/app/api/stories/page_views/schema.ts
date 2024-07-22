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
  topic: z.nativeEnum(StoryTopic),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
});
