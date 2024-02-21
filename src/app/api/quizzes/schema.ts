import { z } from "zod";

export const createQuizSchema = z.object({
  storyId: z.string(),
  contentCategory: z.string(),
  questionType: z.enum([
    "MULTIPLE_CHOICE",
    "TRUE_FALSE",
    "DIRECT_MATCHING",
    "COMPLEX_MATCHING",
    "SELECT_ALL",
  ]),
  questionName: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.array(z.string()),
  totalScore: z.number(),
  explanation: z.string(),
});

export const getQuizzesSchema = z.object({
  storyID: z.string(),
});
