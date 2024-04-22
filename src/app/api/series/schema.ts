import { PublishStatus } from "@prisma/client";
import { z } from "zod";

export const getSeriesSchema = z.object({
  seriesPublishStatus: z.nativeEnum(PublishStatus).optional(),
  seriesURL: z.string().url().optional(),
  seriesName: z.string().optional(),
  seriesSlug: z.string().optional(),
  seriesDescription: z.string().optional(),
});

export const postSeriesSchema = z.object({
  scheduledPublishDate: z.date().optional(),
  seriesName: z.string(),
  seriesSlug: z.string().optional(),
  seriesDescription: z.string(),
});

export const updateSeriesSchema = z.object({
  id: z.string(),
  scheduledPublishDate: z.date().optional(),
  seriesPublishStatus: z.nativeEnum(PublishStatus).optional(),
  seriesName: z.string().optional(),
  seriesSlug: z.string().optional(),
  seriesDescription: z.string().optional(),
});
