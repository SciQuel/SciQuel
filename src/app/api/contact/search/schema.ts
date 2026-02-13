import { z } from "zod";

export const getSchema = z.object({
  search_string: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "search_string is required"
        : "search_string must be a string",
  }),

  field: z.enum(["EMAIL", "NAME", "MESSAGE", "IP"]),
});
