import { z } from "zod";

export const createQuizSchema = z.object({
  storyId: z.string(),
  questionType: z.enum([
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "DIRECT_MATCHING",
    "COMPLEX_MATCHING",
  ]),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.array(z.string()),
});

export const getQuizzesSchema = z.object({
  storyID: z.string()
});