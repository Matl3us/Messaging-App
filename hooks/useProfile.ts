"use client";

import { useState, useEffect } from "react";
import { fetchProfile, updateProfileImage } from "@/utils/api";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  email: string;
  username: string;
  imageUrl: string;
  friendCode: string;
}

export function useProfile(): { profile: Profile; loading: boolean } {
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    username: "",
    imageUrl: "",
    friendCode: "",
  });
  const [loading, setLoading] = useState(true);

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

  return { profile, loading };
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
