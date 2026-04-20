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
  totalScore: z.number(),
  subparts: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswer: z.array(z.string()),
      explanation: z.string(),
    }),
  ),
});

export const getQuizzesSchema = z.object({
  storyId: z.string(),
});
