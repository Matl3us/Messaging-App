import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("This is not a valid email format.")
    .min(1, "Email cannot be empty.")
    .max(64, "Email too long."),
  password: z
    .string()
    .min(1, "Password cannot be empty.")
    .max(64, "Password too long."),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email cannot be empty.")
      .email("This is not a valid email format."),
    username: z
      .string()
      .min(3, "Username has to be at lest 3 characters long.")
      .max(32, "Username cannot be longer than 32 characters."),
    password: z
      .string()
      .min(8, "Password has to be at least 8 characters long.")
      .max(64, "Password cannot be longer than 64 characters."),
    confPassword: z.string(),
  })
  .refine((data) => data.password === data.confPassword, {
    message: "Passwords don't match.",
    path: ["confPassword"],
  });
