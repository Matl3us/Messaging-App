"use client";

import { SocketIndicator } from "@/components/ui/socket-indicator";
import ChatInput from "@/components/element/chat-input";
import ChatMessages from "@/components/element/chat-messages";
import { useEffect, useState } from "react";
import { useConversation } from "@/hooks/useConversations";
import { Loader2 } from "lucide-react";

interface IParams {
  conversationId: string;
}

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

const createConversationName = (members: Array<UserData>, user: UserData) => {
  const otherUsers = members.filter((member) => member.id !== user.id);
  return otherUsers.length > 1
    ? `@${otherUsers.join(", ")}`
    : `@${otherUsers[0].username}`;
};

const Conversation = ({ params }: { params: IParams }) => {
  const { conversationId } = params;
  const { conversation, loadingConversation } = useConversation(conversationId);

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

  let name = "";
  if (!loadingConversation) {
    name = conversation?.name
      ? conversation?.name
      : createConversationName(conversation?.conversation?.members, userData);
  }

  return (
    <div className="flex flex-col gap-2 items-center h-full p-6 bg-background-950">
      <div className="self-start">
        <SocketIndicator />
      </div>
      {loadingConversation ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          <ChatMessages
            name={name}
            conversationId={conversationId}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
          />
          <ChatInput name={name} conversationID={conversationId} />
        </>
      )}
    </div>
  );
};

export default Conversation;
