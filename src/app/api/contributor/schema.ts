import { z } from "zod";

export const ContributorGetSchema = z.object({
  contributorSlug: z.string(),
  staffPick: z.preprocess((val) => (val == "True" ? true : false), z.boolean()),
  pageNum: z.preprocess((val) => {
    if (typeof val != "string") {
      return null;
    }
    return parseInt(val);
  }, z.number().optional()),
});
