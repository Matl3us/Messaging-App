"use client";

import { useState, useEffect } from "react";
import { fetchProfile } from "@/utils/api";

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
