"use client";

import { PenLine } from "lucide-react";
import { ArchiveX } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useFriends } from "@/hooks/useFriends";
import UserItemScroll from "@/components/element/user-item-scroll";
import {
  useConversations,
  useCreatePrivateConv,
} from "@/hooks/useConversations";
import ConversationItem from "@/components/element/conversation-item";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { friends, loadingFriends } = useFriends();
  const { conversations, loadingConversations, refreshConversations } =
    useConversations();

  const createInvite = useCreatePrivateConv(refreshConversations);

  const [opened, setOpened] = useState(false);
  const [friendName, setFriendName] = useState("");

  const changeInputState = () => {
    if (opened) {
      setOpened(false);
      setFriendName("");
    } else {
      setOpened(true);
    }
  };

  console.log(conversations);

  const filteredFriends = friends.filter((item) =>
    item?.user?.username.includes(friendName)
  );

  return (
    <div className="flex h-full">
      <div className="min-w-72 p-8 rounded-lg bg-background-900">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">Chat</h1>
          <button>
            <PenLine
              size="36"
              className="p-1 hover:bg-background-700 bg-background-800 text-background-400 rounded-lg"
              onClick={() => changeInputState()}
            />
          </button>
        </div>
        {opened && (
          <div className="mt-4">
            <Input
              placeholder="Search"
              onChange={(e) => setFriendName(e.target.value)}
              value={friendName}
            />
            <div className="flex flex-col gap-1 bg-background-950 p-2 max-h-48 rounded-b-md overflow-y-scroll">
              {loadingFriends && <Skeleton className="mt-6 w-50 h-12" />}
              {filteredFriends.length === 0 ? (
                <p className="text-center text-background-200 text-sm font-medium">
                  No friends found
                </p>
              ) : (
                filteredFriends.map((e) => (
                  <UserItemScroll
                    key={e.id}
                    id={e.user?.id}
                    username={e.user?.username}
                    imageUrl={e.user?.imageUrl}
                    onSubmit={createInvite}
                  />
                ))
              )}
            </div>
          </div>
        )}
        <Separator className="mt-5" />
        {!loadingConversations && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-background-500 text-sm font-medium">
            <ArchiveX size="36" />
            <p className="text-center">No conversations started</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {conversations.map((e) => (
            <ConversationItem
              key={e.id}
              id={e.id}
              name={e.name}
              isGroup={e.isGroup}
              members={e.members}
              lastMessage={e?.messages[0]}
            />
          ))}
        </div>
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
