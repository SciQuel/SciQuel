import { z } from "zod";

export const getSchema = z.object({
  search_string: z.string({
    required_error: "search_string is required",
    invalid_type_error: "search_string must be a string",
  }),

  field: z.enum(["EMAIL", "NAME", "MESSAGE", "IP"]),
});
