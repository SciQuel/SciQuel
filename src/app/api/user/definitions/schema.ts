import { z } from "zod";

export const postUserDefinitionsSchema = z.object({
  user_email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),

  definition_id: z
    .string({
      required_error: "definition_id is required",
      invalid_type_error: "definition_id must be a string",
    })
    .regex(/^[0-9a-f]{24}$/, {
      message: "definition_id must be a valid ObjectId",
    }),
});

export const getUserDefinitionsSchema = z.object({
  user_email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
});

export const deleteUserDefinitionsSchema = z.object({
  user_email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid email address" }),
});
