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
  include_feedback: z.string(),
  include_get_involved: z.string(),

  include_unopened: z.string(),
  include_needs_response: z.string(),
  include_closed: z.string(),

  start_index: z.string(),
  end_index: z.string(),
});

export const contactPatchSchema = z.object({
  new_status: z
    .string()
    .regex(/^UNOPENED$|^NEEDS_RESPONSE$|^CLOSED$|^ARCHIVED$/),
});
