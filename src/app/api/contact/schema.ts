import { ContactMessage } from "@prisma/client";
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

export interface ContactPatchResult {
  updatedFeedback: ContactMessage;
}
