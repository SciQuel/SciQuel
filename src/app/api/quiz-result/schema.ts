import { QuizType } from "@prisma/client";
import { z } from "zod";

export const storyIdSchema = z
  .string({
    required_error: "story_id is required",
    invalid_type_error: "story_id must be a ObjectId",
  })
  .regex(/^[0-9a-f]{24}$/, {
    message: "story_id must be a valid ObjectId",
  })
  .optional();
export const quizTypeSchema = z.nativeEnum(QuizType, {
  required_error: "quiz_type is required",
  invalid_type_error:
    "Invalid quiz_type.  Valid quiz_type: " + Object.keys(QuizType).join(" | "),
});
