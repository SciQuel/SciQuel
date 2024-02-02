import { z } from "zod";

export const contactSchema = z.object({
  message: z.string({
    required_error: "message is required",
    invalid_type_error: "message must be a string",
  }),

  contact_name: z.string({
    required_error: "contact_name is required",
    invalid_type_error: "contact_name must be a string",
  }),

  reply_email: z.string({
    required_error: "reply_email is required",
    invalid_type_error: "reply_email must be a string",
  }),
});

export const contactGetSchema = z.object({
  status: z.enum(["UNOPENED", "NEEDS_RESPONSE", "CLOSED", "ARCHIVED"], {
    invalid_type_error:
      "Invalid status.  Valid statuses: UNOPENED | NEEDS_RESPONSE | CLOSED | ARCHIVED",
  }),

  start_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.number().nonnegative().int(),
  ),
  end_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.number().nonnegative().int(),
  ),
});

export const contactPatchSchema = z.object({
  new_status: z.enum(["UNOPENED", "NEEDS_RESPONSE", "CLOSED", "ARCHIVED"], {
    invalid_type_error:
      "Invalid new_status.  Valid statuses: UNOPENED | NEEDS_RESPONSE | CLOSED | ARCHIVED",
  }),

  send_reply: z.boolean({
    invalid_type_error: "send_reply must be a boolean.",
    required_error: "send_reply is required",
  }),

  reply_text: z.string({
    invalid_type_error: "reply_text must be a string.",
    required_error: "reply_text is required.",
  }),
});

export const BanPostSchema = z.object({
  method: z.enum(["EMAIL", "IP"], {
    invalid_type_error:
      "invalid method: valid methods include 'EMAIL' and 'IP'",
  }),
  value: z.string({
    invalid_type_error: "value must be a string",
    required_error: "value is required",
  }),
  reason: z.string({
    invalid_type_error: "reason must be a string",
    required_error: "reason for ban is required.",
  }),
  should_archive: z.boolean({
    invalid_type_error: "should_archive must be a boolean",
    required_error: "should_archive is required.",
  }),
  end_time: z
    .preprocess(
      (value) => new Date(z.string().datetime({ offset: true }).parse(value)),
      z.date(),
    )
    .optional(),
});

export const BanGetSchema = z.object({
  category: z.enum(["IP", "EMAIL", "REASON"], {
    required_error: "search category is required",
    invalid_type_error:
      "invalid category. valid categories include: 'IP', 'EMAIL', and 'REASON'",
  }),
  search_string: z.string({
    required_error: "search_string is required",
  }),
});

export const RecentBanGetSchema = z.object({
  start_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.number().nonnegative().int(),
  ),
});

export const BanDeleteSchema = z.object({
  id: z.string({
    required_error: "Banned Profile ID must be specified in id parameter",
    invalid_type_error: "id must be a string",
  }),
});
