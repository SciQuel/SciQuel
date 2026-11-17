import { z } from "zod";

export const BanPostSchema = z.object({
  method: z.enum(["EMAIL", "IP"], {
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "invalid method: valid methods include 'EMAIL' and 'IP'",
  }),
  value: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "value is required"
        : "value must be a string",
  }),
  reason: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "reason for ban is required."
        : "reason must be a string",
  }),
  should_archive: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "should_archive is required."
        : "should_archive must be a boolean",
  }),
  end_time: z
    .preprocess(
      (value) => new Date(z.iso.datetime({ offset: true }).parse(value)),
      z.date(),
    )
    .optional(),
});

export const BanGetSchema = z.object({
  category: z.enum(["IP", "EMAIL", "REASON"], {
    error: (issue) =>
      issue.input === undefined
        ? "search category is required"
        : "invalid category. valid categories include: 'IP', 'EMAIL', and 'REASON'",
  }),
  search_string: z.string({
    error: (issue) =>
      issue.input === undefined ? "search_string is required" : undefined,
  }),
});

export const RecentBanGetSchema = z.object({
  start_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.int().nonnegative(),
  ),
});

export const BanDeleteSchema = z.object({
  id: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Banned Profile ID must be specified in id parameter"
        : "id must be a string",
  }),
});
