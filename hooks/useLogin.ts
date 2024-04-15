"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

import { loginUser } from "@/utils/auth";
import { loginSchema } from "@/lib/zod-schemas";

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (values: z.infer<typeof loginSchema>, form: any) => {
    setLoading(true);
    form.reset();
    try {
      const response = await loginUser(values);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userData", JSON.stringify(data.data));
        router.push("/");
      } else {
        if (response.status === 400) {
          form.setError("password", {
            type: "custom",
            message: "Email or password doesn't match.",
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
    }
  };

  return { login, loading };
};
