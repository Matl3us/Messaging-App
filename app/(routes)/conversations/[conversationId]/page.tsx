"use client";

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

const createConversationName = (otherUsers: Array<UserData>) => {
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
  let imageUrl = "";
  if (!loadingConversation) {
    const otherUsers = conversation?.conversation?.members.filter(
      (member) => member.id !== userData.id
    );
    name = conversation?.name
      ? conversation?.name
      : createConversationName(otherUsers);
    imageUrl = otherUsers[0].imageUrl;
  }

  return (
    <div className="flex h-full flex-col gap-2 items-center p-6 bg-background-950">
      {loadingConversation ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          <ChatMessages
            name={name}
            userId={userData.id}
            conversationId={conversationId}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            imageUrl={imageUrl}
          />
          <ChatInput name={name} conversationID={conversationId} />
        </>
      )}
    </div>
  );
};

export default Conversation;
