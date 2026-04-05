import { z } from "zod";
import { zfd } from "zod-form-data";

export const getSeriesSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
});

export const putSeriesSchema = zfd.formData({
  title: zfd.text(),
  stories: z.array(zfd.text()),
});

export const patchSeriesSchema = z.object({
  id: zfd.text(),
  title: zfd.text().optional(),
  stories: z.array(zfd.text()).optional(),
});
