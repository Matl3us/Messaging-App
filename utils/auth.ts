"use client";
import { z } from "zod";

import { loginSchema, registerSchema } from "@/lib/zod-schemas";

const BASE_URL = "http://localhost:3000";

export const loginUser = async (values: z.infer<typeof loginSchema>) => {
  const { email, password } = values;

  return fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = async (values: z.infer<typeof registerSchema>) => {
  const { email, username, password, confPassword } = values;

  return fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password, confPassword }),
  });
};
