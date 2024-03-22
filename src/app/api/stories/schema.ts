import {
  Category,
  ContributionType,
  StoryTopic,
  StoryType,
} from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

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
  staff_pick: z
    .preprocess(
      (value) => (value === "true" ? true : undefined),
      z.boolean().optional(),
    )
    .optional(),
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
  published: z.preprocess(
    (value) => (value === "false" ? false : true),
    z.boolean().optional().default(true),
  ),
});

export const postStorySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const subtopicSchema = z.object({
  id: z.string(),
});

const generalSubjectSchema = z.object({
  id: z.string(),
});

const storyContributionSchema = z.object({
  userId: z.string(),
  contributionType: z.nativeEnum(ContributionType),
  bio: z.string().optional(),
});

export const putStorySchema = zfd.formData({
  id: zfd.text().optional(),
  storyType: z.nativeEnum(StoryType),
  category: z.nativeEnum(Category),
  title: zfd.text(),
  titleColor: zfd.text(),
  slug: zfd.text(),
  summary: zfd.text(),
  summaryColor: zfd.text(),
  topics: z.array(z.nativeEnum(StoryTopic)),
  subtopics: z.array(subtopicSchema),
  generalSubjects: z.array(generalSubjectSchema),
  staffPick: zfd.checkbox(),
  image: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob).optional(),
  ),
  imageUrl: zfd.text().optional(),
  imageCaption: zfd.text().optional(),
  // storyContent
  content: zfd.text(),
  footer: zfd.text().optional(),
  // storyContribution, 1 to many relationship
  contributions: z.array(storyContributionSchema),

  published: zfd.checkbox(),
});

export const patchStorySchema = z.object({
  contributions: z
    .array(
      z.object({
        email: z.string(),
        contributionType: z.nativeEnum(ContributionType),
        bio: z.string(),
      }),
    )
    .optional(),
  content: z.string().optional(),
  footer: z.string().nullable().optional(),
  published: z.boolean().optional(),
});
