import { z } from "zod";

export const userResponseSchema = z.object({
  storyId: z.string(),
  questionType: z.enum([
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "DIRECT_MATCHING",
    "COMPLEX_MATCHING",
    "SELECT_ALL",
  ]),
  userId: z.string(),
  quizQuestionId: z.string(),
  responseSubparts: z.array(
    z.object({
      subpartId: z.string(),
      subpartUserAns: z.array(z.string()),
    }),
  ),
});
