"use client";

import { useState, useEffect } from "react";
import { fetchProfile, updateProfileImage, updateUserStatus } from "@/utils/api";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  email: string;
  username: string;
  imageUrl: string;
  friendCode: string;
  status: "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";
}

export function useProfile(): { profile: Profile; loadingProfile: boolean } {
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    username: "",
    imageUrl: "",
    friendCode: "",
  });
  const [loadingProfile, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostsData() {
      try {
        const fetchedProfile: Profile = await fetchProfile();     
        setProfile(fetchedProfile);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    fetchPostsData();
  }, []);

  return { profile, loadingProfile };
}

export function useUpdateImage() {
  const router = useRouter();

  const updateImage = async (imageUrl: string) => {
    try {
      const response = await updateProfileImage(imageUrl);
      if (response.ok) {
        router.push("/");
      } else {
        const text = await response.text();
        console.log(text);
      }
    } catch (error) {
      console.error("Error updating image:", error);
    }
  };

  return updateImage;
}

export function useUpdateStatus() {
  const changeStatus = async (status: number) => {
    try {
      await updateUserStatus(status);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return changeStatus;
}
