"use client";

import ChatInput from "@/components/element/chat-input";
import ChatMessages from "@/components/element/chat-messages";
import { useEffect, useState } from "react";
import { useConversation } from "@/hooks/useConversations";

import { Info, Loader2, Phone } from "lucide-react";

import Image from "next/image";
import GroupIcon from "@/components/ui/group-icon";

interface IParams {
  conversationId: string;
}

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
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
    const otherUsers = conversation?.members.filter(
      (member) => member.id !== userData.id
    );
    name = conversation?.name ? conversation?.name : otherUsers[0].username;
    imageUrl = otherUsers[0].imageUrl;
  }

  return (
    <div className="flex h-full flex-col gap-2 items-center bg-background-950">
      {loadingConversation ? (
        <div className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between px-6 w-full h-16 border-b-2 border-background-900">
            <div className="flex gap-5 items-center">
              {conversation?.isGroup ? (
                <GroupIcon members={conversation?.members} size="small" />
              ) : (
                <Image
                  className="rounded-lg"
                  src={imageUrl}
                  placeholder="empty"
                  alt="Avatar"
                  width="32"
                  height="32"
                  unoptimized
                />
              )}

              <p className="text-background-100 text-base font-semibold">
                {name}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button>
                <Phone
                  size="32"
                  className="p-1 hover:bg-background-800 text-primary-500 rounded-lg"
                />
              </button>
              <button>
                <Info
                  size="32"
                  className="p-1 hover:bg-background-800 text-primary-500 rounded-lg"
                />
              </button>
            </div>
          </div>
          <ChatMessages
            name={name}
            userId={userData.id}
            conversationId={conversationId}
            isGroup={conversation?.isGroup}
            members={conversation?.members}
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
