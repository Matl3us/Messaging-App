"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  fetchProfile,
  fetchUserStatus,
  updateProfileImage,
  updateUserStatus,
} from "@/utils/api";
import { useRouter } from "next/navigation";

type Status = "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";

interface Profile {
  id: string;
  email: string;
  username: string;
  imageUrl: string;
  friendCode: string;
  status: Status;
}

export function useProfile(): { profile: Profile; loadingProfile: boolean } {
  const [profile, setProfile] = useState({
    id: "",
    email: "",
    username: "",
    imageUrl: "",
    friendCode: "",
    status: "ONLINE" as Status,
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

export function useCheckStatus(): {
  userStatus: Status;
  setUserStatus: Dispatch<SetStateAction<Status>>;
  loadingStatus: boolean;
} {
  const [userStatus, setUserStatus] = useState<Status>("ONLINE");
  const [loadingStatus, setLoading] = useState(true);

  const checkStatus = async () => {
    try {
      const { status } = await fetchUserStatus();
      setUserStatus(status);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return { userStatus, setUserStatus, loadingStatus };
}
