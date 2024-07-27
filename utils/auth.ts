"use client";
import { z } from "zod";

import {
  loginSchema,
  passwordChangeSchema,
  registerSchema,
} from "@/lib/zod-schemas";

export const loginUser = async (values: z.infer<typeof loginSchema>) => {
  const { email, password } = values;

  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const logoutUser = async () => {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to logout user.");
  }
};

export const registerUser = async (values: z.infer<typeof registerSchema>) => {
  const { email, username, password, confPassword } = values;

  return fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, confPassword }),
  });
};

export const changeUserPass = async (
  values: z.infer<typeof passwordChangeSchema>
) => {
  const { oldPassword, newPassword } = values;

  return fetch("/api/profile/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
};
