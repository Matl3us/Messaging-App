"use client";

import { SocketIndicator } from "@/components/ui/socket-indicator";
import { useEffect, useState } from "react";

import Image from "next/image";
import { Home, MessagesSquare,  Shell, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { useNavigationSocket } from "@/hooks/useNavigationSocket";
import UserStatus from "@/components/element/user-status";

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
  const currentPage = usePathname();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const notificationKey = `user:${userData.id}:notification`;
  const messageKey = `user:${userData.id}:received:message`;
  useNavigationSocket({
    currentPage,
    notificationKey,
    messageKey,
    notificationCount,
    setNotificationCount,
    messageCount,
    setMessageCount,
  });

  const logout = useLogout();

  useEffect(() => {
    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }

    if (currentPage === "/") {
      setNotificationCount(0);
    }

    if (currentPage === "/conversations") {
      setMessageCount(0);
    }
  }, [currentPage]);

  return (
    <div className="flex h-screen overflow-hidden bg-background-900">
      <nav className="w-1/6 min-w-16 max-w-16 flex flex-col items-center">
        <Shell size="36" className="ml-1 mt-2 text-primary-500" />
        <div className="mt-16 flex flex-col items-center gap-6 text-xs text-background-500">
          <Link
            href="/"
            className={cn(
              "flex gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage === "/" && "text-primary-500"
            )}
          >
            <div className="relative left-2 flex flex-col gap-2">
              <Home size="32" />
              <p>Home</p>
            </div>
            {notificationCount > 0 && (
              <div className="relative bottom-6 right-[3px] p-[3px] rounded-md bg-error">
                <p className="font-bold text-background-200 text-sm">
                  {notificationCount}
                </p>
              </div>
            )}
          </Link>
          <Link
            href="/friends"
            className={cn(
              "flex flex-col gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage === "/friends" && "text-primary-500"
            )}
          >
            <Users size="32" />
            <p>Friends</p>
          </Link>
          <Link
            href="/conversations"
            className={cn(
              "flex gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage?.startsWith("/conversations") && "text-primary-500"
            )}
          >
            <div className="flex flex-col gap-2">
              <MessagesSquare className="relative left-2" size="32" />
              <p>Messages</p>
            </div>
            {messageCount > 0 && (
              <div className="relative right-[20px] bottom-6 p-[3px] rounded-md bg-error">
                <p className="font-bold text-background-200 text-sm">
                  {messageCount}
                </p>
              </div>
            )}
          </Link>
        </div>
      </nav>
      <div className="flex flex-col w-screen">
        <nav className="h-12 pl-1 pr-6 flex gap-8 justify-between items-center">
          <p className="text-primary-500 text-xl font-semibold">Logo</p>
          <div className="flex gap-8 items-center">
            {userData.imageUrl && (
              <DropdownMenu>
                <DropdownMenuTrigger>
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
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-24 text-center">
                  <DropdownMenuLabel>
                    <button className="w-24">
                      <Link href="/profile">Profile</Link>
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuLabel>
                    <button
                      onClick={() => logout()}
                      className="text-error w-24"
                    >
                      Logout
                    </button>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <UserStatus />
            <SocketIndicator />
          </div>
        </nav>
        <div className="flex-1 overflow-auto border-l-[1px] border-t-[1px] border-background-700 bg-background-950">
          {children}
        </div>
      </div>
    </div>
  );
}
