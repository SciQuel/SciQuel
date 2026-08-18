import { type ContactMessage } from "@prisma/client";
import { z } from "zod";

export const contactSchema = z.object({
  message: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "message is required"
        : "message must be a string",
  }),

  contact_name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "contact_name is required"
        : "contact_name must be a string",
  }),

  reply_email: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "reply_email is required"
        : "reply_email must be a string",
  }),
});

export const contactGetSchema = z.object({
  status: z.enum(["UNOPENED", "NEEDS_RESPONSE", "CLOSED", "ARCHIVED"], {
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "Invalid status.  Valid statuses: UNOPENED | NEEDS_RESPONSE | CLOSED | ARCHIVED",
  }),

  start_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.int().nonnegative(),
  ),
  end_index: z.preprocess(
    (value) => parseInt(z.string().parse(value)),
    z.int().nonnegative(),
  ),
});

export const contactPatchSchema = z.object({
  new_status: z.enum(["UNOPENED", "NEEDS_RESPONSE", "CLOSED", "ARCHIVED"], {
    error: (issue) =>
      issue.input === undefined
        ? undefined
        : "Invalid new_status.  Valid statuses: UNOPENED | NEEDS_RESPONSE | CLOSED | ARCHIVED",
  }),

  send_reply: z.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "send_reply is required"
        : "send_reply must be a boolean.",
  }),

  reply_text: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "reply_text is required."
        : "reply_text must be a string.",
  }),
});

export interface ContactPatchResult {
  updatedFeedback: ContactMessage;
}
