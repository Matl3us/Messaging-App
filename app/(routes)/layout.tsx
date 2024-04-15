"use client";

import { SocketIndicator } from "@/components/ui/socket-indicator";
import { useEffect, useState } from "react";

import Image from "next/image";
import { Home, MessagesSquare, Settings, Users } from "lucide-react";
import Link from "next/link";

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  useEffect(() => {
    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background-900">
      <nav className="w-1/6 min-w-16 max-w-16">
        <div className="mt-[72px] flex flex-col items-center gap-6 text-xs text-background-500">
          <Link
            href="/"
            className="flex flex-col gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer"
          >
            <Home size="32" />
            <p>Home</p>
          </Link>
          <Link
            href="/friends"
            className="flex flex-col gap-2 items-center p-1 w-14 rounded-md hover:bg-background-800 cursor-pointer"
          >
            <Users size="32" />
            <p>Friends</p>
          </Link>
          <Link
            href="/conversations"
            className="flex flex-col gap-2 items-center p-1 w-14 rounded-md hover:bg-background-800 cursor-pointer"
          >
            <MessagesSquare size="32" />
            <p>Messages</p>
          </Link>
          <div className="flex flex-col gap-2 items-center p-1 w-14 rounded-md hover:bg-background-800 cursor-pointer">
            <Settings size="32" />
            <p>Settings</p>
          </div>
        </div>
      </nav>
      <div className="flex flex-col w-screen">
        <nav className="h-12 px-6 flex gap-8 justify-end items-center">
          {userData.imageUrl && (
            <div className="flex gap-2 p-2 hover:bg-background-800 rounded-md cursor-pointer">
              <Image
                className="rounded-lg"
                src={userData.imageUrl}
                placeholder="empty"
                alt="Avatar"
                width="28"
                height="28"
                unoptimized
              />
              <p className="text-background-200 text-sm font-semibold">
                {userData.username}
              </p>
            </div>
          )}
          <SocketIndicator />
        </nav>
        <div className="flex-1 overflow-auto border-l-[1px] border-t-[1px] border-background-700 bg-background-950">
          {children}
        </div>
      </div>
    </div>
  );
}
