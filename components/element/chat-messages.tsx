"use client";

import Image from "next/image";

import { Fragment, useEffect, useRef, ElementRef } from "react";
import { format } from "date-fns";

import { Message, User } from "@prisma/client";

import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useChatScroll } from "@/hooks/useChatScroll";
import GroupIcon from "../ui/group-icon";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

type MessageWithMember = Message & {
  member: UserData;
};

interface ChatMessagesProps {
  name: string;
  userId: string;
  conversationId: string;
  isGroup: boolean;
  members: Array<UserData>;
  imageUrl: string;
  apiUrl: string;
  socketUrl: string;
}

const ChatMessages = ({
  name,
  userId,
  conversationId,
  isGroup,
  members,
  imageUrl,
  apiUrl,
  socketUrl,
}: ChatMessagesProps) => {
  const queryKey = `chat:${conversationId}`;
  const addKey = `chat:${conversationId}:messages`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const messagesRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramValue: conversationId,
    });
  useChatSocket({ queryKey, addKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  // @ts-ignore
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        <p className="text-sm">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-10 w-10 text-primary-600" />
        <p className="text-sm">Something went wrong!</p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex flex-1 flex-col p-6 w-full overflow-scroll"
    >
      {!hasNextPage && (
        <div className="flex flex-col items-center mt-auto">
          {isGroup ? (
            <>
              <GroupIcon members={members} size="large" />
              <p className="mb-12 mt-6 font-semibold text-background-500 ">
                This is the start of the conversation in the group {name}
              </p>
            </>
          ) : (
            <>
              <Image
                className="rounded-lg"
                src={imageUrl}
                placeholder="empty"
                alt="Avatar"
                width="64"
                height="64"
                unoptimized
              />{" "}
              <p className="mb-12 mt-6 font-semibold text-background-500 ">
                This is the start of the conversation with @{name}
              </p>
            </>
          )}
        </div>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-32 w-8 text-primary-600 animate-spin" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-xs text-background-600"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div ref={messagesRef} className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMember) => (
              <ChatItem
                key={message.id}
                id={message.id}
                userId={userId}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
