import * as z from "zod";
import { zfd } from "zod-form-data";

interface StoryRequestSchema {
  id: string;
  shortHeadline: string;
  storyURL: string;
}

export const getSeriesSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
});

export const postSeriesSchema = zfd.formData({
  title: zfd.text(),
  stories: z.preprocess(
    (val) => {
      if (typeof val == "string") {
        const newVal = JSON.parse(val) as StoryRequestSchema[];
        return newVal;
      }
      return [];
    },
    z.array(
      z.object({
        id: zfd.text(),
        shortHeadline: zfd.text(),
      }),
    ).superRefine((items, ctx) => {
        if (items) {
          const seen = new Map();
          items.forEach((item, idx) => {
            if (seen.has(item.id)) {
              ctx.addIssue({
                code: "custom",
                message: `Duplicate id: ${item.id}`,
                path: [idx, "id"],
              });
              ctx.addIssue({
                code: "custom",
                message: `Duplicate id: ${item.id}`,
                path: [seen.get(item.id), "id"],
              });
            } else {
              seen.set(item.id, idx);
            }
          });
        }
      }),,
  ),
});

export const putSeriesSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    stories: z
      .array(
        z.object({
          id: z.string(),
          shortHeadline: z.string(),
        }),
      )
      .optional()
      .superRefine((items, ctx) => {
        if (items) {
          const seen = new Map();
          items.forEach((item, idx) => {
            if (seen.has(item.id)) {
              ctx.addIssue({
                code: "custom",
                message: `Duplicate id: ${item.id}`,
                path: [idx, "id"],
              });
              ctx.addIssue({
                code: "custom",
                message: `Duplicate id: ${item.id}`,
                path: [seen.get(item.id), "id"],
              });
            } else {
              seen.set(item.id, idx);
            }
          });
        }
      }),
  })
  .refine(({ title, stories }) => title || stories, {
    message: "title or stories array must be defined",
  });

export const getStorySeriesSchema = z.object({
  id: z.string(),
});

export const deleteSeriesSchema = z.object({
  id: z.string(),
});
