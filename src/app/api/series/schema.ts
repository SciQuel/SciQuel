import { title } from "node:process";
import * as z from "zod";
import { zfd } from "zod-form-data";

export const getSeriesSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
  })
  .refine(({ id, title }) => id || title, {
    message: "One of the fields must be defined",
  });

export const putSeriesSchema = zfd.formData({
  title: zfd.text(),
  stories: z.array(
    z.object({
      id: zfd.text(),
      shortHeadline: zfd.text(),
      storyURL: z.string().url(),
    }),
  ),
});

export const patchSeriesSchema = z
  .object({
    id: zfd.text(),
    title: zfd.text().optional(),
    stories: z.array(
      z
        .object({
          id: zfd.text(),
          shortHeadline: zfd.text(),
          storyURL: z.string().url(),
        })
        .optional(),
    ),
  })
  .refine(({ _, title, stories }) => title || stories, {
    message: "title or stories array must be defined",
  });

export const getStorySeriesSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
  })
  .refine(({ id, title }) => id || title, {
    message: "Id or title must be defined",
  });
