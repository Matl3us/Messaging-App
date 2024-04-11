"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { registerUser, loginUser } from "@/utils/auth";
import { registerSchema } from "@/lib/zod-schemas";

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const register = async (
    values: z.infer<typeof registerSchema>,
    form: any
  ) => {
    setLoading(true);
    try {
      const response = await registerUser(values);
      if (response.ok) {
        const response = await loginUser(values);
        if (response.ok) {
          router.push("/");
        } else {
          form.setError("password", {
            type: "custom",
            message: "There was an error.",
          });
        }
      } else {
        if (response.status === 400) {
          form.setError("confPassword", {
            type: "custom",
            message: "Email and password must be unique.",
          });
        } else {
          form.setError("password", {
            type: "custom",
            message: "There was an error.",
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      form.setError("password", {
        type: "custom",
        message: "There was an error.",
      });
    }
  };

  return { register, loading };
};
