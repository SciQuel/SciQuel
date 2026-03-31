import { z } from "zod";
import { zfd } from "zod-form-data";

export const getSeriesSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
});

export const putSeriesSchema = zfd.formData({
  id: zfd.text().optional(),
  title: zfd.text(),
  stories: zfd.repeatable(z.array(zfd.text()).min(1)),
});

export const patchSeriesSchema = z.object({
  id: zfd.text(),
  title: zfd.text().optional(),
  stories: zfd.repeatable(z.array(zfd.text()).min(1)).optional(),
});
