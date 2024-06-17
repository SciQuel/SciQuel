import { PublishStatus } from "@prisma/client";
import { z } from "zod";

export const getSeriesSchema = z.object({
  createdBy: z.string().optional(),
  publishedByScheduler: z.boolean().optional(),
  seriesPublishStatus: z.nativeEnum(PublishStatus).optional(),
});

export const postSeriesSchema = z.object({
  seriesName: z.string(),
  seriesDescription: z.string(),
  seriesSlug: z.string().optional(),
  versionName: z.string().optional(),
  scheduledPublishDate: z
    .preprocess((value) => new Date(z.string().parse(value)), z.date())
    .optional(),
  storyIds: z.array(z.string()),
});

export const patchSeriesSchema = z.object({
  seriesName: z.string().optional(),
  seriesDescription: z.string().optional(),
  seriesSlug: z.string().optional(),
  versionName: z.string().optional(),
  scheduledPublishDate: z
    .preprocess((value) => new Date(z.string().parse(value)), z.date())
    .optional(),
  seriesPublishStatus: z.nativeEnum(PublishStatus).optional(),
  storyIds: z.array(z.string()).optional(),
});
