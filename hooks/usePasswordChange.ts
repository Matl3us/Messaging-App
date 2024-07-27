"use client";

import { useState } from "react";
import { z } from "zod";

import { passwordChangeSchema } from "@/lib/zod-schemas";
import { changeUserPass } from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";

export const usePasswordChange = () => {
  const [loadingChange, setLoading] = useState(false);
  const { toast } = useToast();

  const changePassword = async (
    values: z.infer<typeof passwordChangeSchema>,
    form: any
  ) => {
    setLoading(true);
    try {
      const response = await changeUserPass(values);
      if (response.ok) {
        toast({
          title: "Password changed successfully.",
          variant: "success",
        });
      } else {
        if (response.status === 401) {
          form.setError("oldPassword", {
            type: "custom",
            message: "Invalid password.",
          });
        } else {
          form.setError("oldPassword", {
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

  return { changePassword, loadingChange };
};
