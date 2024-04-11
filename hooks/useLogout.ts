"use client";

import { useRouter } from "next/navigation";

import { logoutUser } from "@/utils/auth";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
}
