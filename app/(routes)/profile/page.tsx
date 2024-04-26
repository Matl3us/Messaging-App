"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useLogout";

import { LoadingSpinner } from "@/components/ui/spinner";
import { useState } from "react";
import { ClipboardCopy, EyeOff } from "lucide-react";

const Profile = () => {
  const { profile, loading } = useProfile();
  const [show, setShow] = useState(false);
  const logout = useLogout();

  const changeInputState = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profile.friendCode);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-96 mx-auto mt-12 p-12 rounded-lg bg-background-900">
      <h1 className="text-2xl font-medium">Profile</h1>
      <div className="flex flex-col gap-2 mt-8 text-base text-background-50">
        {!profile.imageUrl ? (
          <Skeleton className="w-16 h-16 rounded-lg mb-4" />
        ) : (
          <Image
            className="rounded-lg mb-4"
            src={profile.imageUrl}
            placeholder="empty"
            alt="Avatar"
            width="64"
            height="64"
            unoptimized
          />
        )}
        <div className="flex justify-between">
          <p>Username</p>
          {!profile.username ? (
            <Skeleton className="w-32 h-5 rounded-lg mt-2" />
          ) : (
            <p>{profile.username}</p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p>Friend code</p>
          {!profile.friendCode ? (
            <Skeleton className="w-32 h-5 rounded-lg mt-2" />
          ) : (
            <div className="flex gap-2 items-center border border-background-700 p-1 rounded-md relative left-1">
              <p className="pl-2">{show ? profile.friendCode : "**********"}</p>
              <div className="flex">
                <button>
                  <EyeOff
                    size="28"
                    className="p-1 hover:bg-background-800 text-primary-600 hover:text-primary-500 rounded-lg"
                    onClick={() => changeInputState()}
                  />
                </button>
                <button>
                  <ClipboardCopy
                    size="28"
                    className="p-1 hover:bg-background-800 text-primary-600 hover:text-primary-500 rounded-lg"
                    onClick={() => {
                      copyToClipboard();
                    }}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {loading && <LoadingSpinner className="mt-4" />}
      <Button className="mt-8" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
};

export default Profile;
