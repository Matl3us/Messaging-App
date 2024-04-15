"use client";

import Image from "next/image";

import { Fragment } from "react";
import { format } from "date-fns";

import { Message, User } from "@prisma/client";

import { useChatQuery } from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

type MessageWithMember = Message & {
  member: User;
};

interface ChatMessagesProps {
  name: string;
  conversationId: string;
  apiUrl: string;
  socketUrl: string;
}

const ChatMessages = ({
  name,
  conversationId,
  apiUrl,
  socketUrl,
}: ChatMessagesProps) => {
  const queryKey = `chat:${conversationId}`;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramValue: conversationId,
    });

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
    <div className="flex flex-1 flex-col w-[550px] overflow-scroll">
      <div className="flex flex-col items-center mt-auto">
        <Image
          className="rounded-lg"
          src="https://ui-avatars.com/api/?background=random&color=fff&name=user"
          placeholder="empty"
          alt="Avatar"
          width="64"
          height="64"
          unoptimized
        />
        <p className="mt-6 font-semibold text-background-500 ">
          This is start of the conversation with @user
        </p>
      </div>
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMember) => (
              <ChatItem
                key={message.id}
                id={message.id}
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
    </div>
  );
};

export default ChatMessages;
