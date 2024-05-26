import { z } from "zod";

export const genSubGetSchema = z.object({
  search_string: z.string(),
  page: z.preprocess((val) => {
    if (typeof val == "string" && Number.isInteger(parseInt(val))) {
      return parseInt(val);
    } else {
      return 0;
    }
  }, z.number().optional().default(0)),
});

export const genSubCreatePostSchema = z.object({
  name: z.string(),
});
