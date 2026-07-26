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

const storyUrlSchema = z.string().refine(
  (value) => {
    try {
      new URL(value, "http://example.com");
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid story URL",
  },
);

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
        storyURL: storyUrlSchema,
      }),
    ),
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
          storyURL: storyUrlSchema,
        }),
      )
      .optional(),
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
