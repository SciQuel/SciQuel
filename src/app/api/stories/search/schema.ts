import { StoryTopic, StoryType } from "@prisma/client";
import { z } from "zod";

export const getStorySchema = z.object({
  page: z
    .preprocess(
      (value) => parseInt(z.string().parse(value)),
      z.number().positive().int(),
    )
    .optional(),
  page_size: z
    .preprocess(
      (value) => parseInt(z.string().parse(value)),
      z.number().positive().int(),
    )
    .optional(),
  keyword: z.string().optional(),
  topic: z
    .preprocess(
      (value) => String(z.string().parse(value).toUpperCase()),
      z.nativeEnum(StoryTopic),
    )
    .optional(),
  type: z
    .preprocess(
      (value) => String(z.string().parse(value).toUpperCase()),
      z.nativeEnum(StoryType),
    )
    .optional(),
  date_from: z
    .preprocess((value) => new Date(z.string().parse(value)), z.date())
    .optional(),
  date_to: z
    .preprocess((value) => new Date(z.string().parse(value)), z.date())
    .optional(),
  sort_by: z.enum(["newest", "oldest"]).optional(),
});
