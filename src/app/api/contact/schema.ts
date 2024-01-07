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
