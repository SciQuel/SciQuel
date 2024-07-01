import { StoryTopic } from "@prisma/client";
import { z } from "zod";

export const getFavoriteTopicsSchema = z.object({
  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
});

export const postFavoriteTopicSchema = z.object({
  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
  topic: z.nativeEnum(StoryTopic),
});

export const deleteFavoriteTopicSchema = z.object({
  user_id: z
    .string({
      required_error: "user_id is required",
      invalid_type_error: "user_id must be a ObjectId",
    })
    .regex(/^[0-9a-f]{24}$/, { message: "user_id must be a valid ObjectId" }),
  topic: z.nativeEnum(StoryTopic),
});
