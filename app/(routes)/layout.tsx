"use client";

import { SocketIndicator } from "@/components/ui/socket-indicator";
import { useEffect, useState } from "react";

import Image from "next/image";
import { Home, MessagesSquare, Settings, Shell, Users } from "lucide-react";
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
  const logout = useLogout();

  useEffect(() => {
    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background-900">
      <nav className="w-1/6 min-w-16 max-w-16 flex flex-col items-center">
        <Shell size="36" className="ml-1 mt-2 text-accent-500" />
        <div className="mt-16 flex flex-col items-center gap-6 text-xs text-background-500">
          <Link
            href="/"
            className={cn(
              "flex flex-col gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage === "/" && "text-primary-500"
            )}
          >
            <Home size="32" />
            <p>Home</p>
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
              "flex flex-col gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage?.startsWith("/conversations") && "text-primary-500"
            )}
          >
            <MessagesSquare size="32" />
            <p>Messages</p>
          </Link>
          <Link
            href="/settings"
            className={cn(
              "flex flex-col gap-2 items-center w-14 p-1 rounded-md hover:bg-background-800 cursor-pointer",
              currentPage?.startsWith("/settings") && "text-primary-500"
            )}
          >
            <Settings size="32" />
            <p>Settings</p>
          </Link>
        </div>
      </nav>
      <div className="flex flex-col w-screen">
        <nav className="h-12 pl-1 pr-6 flex gap-8 justify-between items-center">
          <p className="text-accent-500 text-xl font-semibold">Logo</p>
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
