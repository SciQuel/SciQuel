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
      z.int().positive(),
    )
    .optional(),
  page_size: z
    .preprocess(
      (value) => parseInt(z.string().parse(value)),
      z.int().positive(),
    )
    .optional(),
  keyword: z.string().optional(),
  staff_pick: z
    .preprocess(
      (value) => {
        // Allow callers to explicitly ask for stories with or without a staff pick.
        if (value === "true") {
          return true;
        }

        if (value === "false") {
          return false;
        }

        return undefined;
      },
      z.boolean().optional(),
    )
    .optional(),
  topic: z
    .preprocess(
      (value) => String(z.string().parse(value).toUpperCase()),
      z.enum(StoryTopic),
    )
    .optional(),
  type: z
    .preprocess(
      (value) => String(z.string().parse(value).toUpperCase()),
      z.enum(StoryType),
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
    z.boolean().optional().prefault(true),
  ),
  category: z
    .preprocess(
      (value) => String(z.string().parse(value).toUpperCase()),
      z.enum(Category),
    )
    .optional(),
});

export const postStorySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const putStorySchema = zfd.formData({
  id: zfd.text().optional(),
  title: zfd.text(),
  summary: zfd.text(),
  image: z.preprocess(
    (val) => (val instanceof Blob && val.size === 0 ? undefined : val),
    z.instanceof(Blob).optional(),
  ),
  imageUrl: zfd.text().optional(),
  imageCaption: zfd.text(),
});

export const patchStorySchema = z.object({
  contributions: z
    .array(
      z.object({
        email: z.string(),
        contributionType: z.enum(ContributionType),
        bio: z.string(),
      }),
    )
    .optional(),
  content: z.string().optional(),
  footer: z.string().nullable().optional(),
  published: z.boolean().optional(),
});
