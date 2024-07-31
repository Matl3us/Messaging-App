import { useSocket } from "@/components/providers/socket-provider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ConversationProps = {
  conversations: ConversationItem[];
  setConversations: Dispatch<SetStateAction<ConversationItem[]>>;
};

type Status = "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";

type ConversationItem = {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<UserItem>;
  messages: Array<MessageItem>;
};

type MessageItem = {
  id: string;
  content: string;
  fileUrl: string;
  createdAt: Date;
  member: UserItem;
};

type MessageDto = MessageItem & {
  conversationId: string;
};

type UserItem = {
  id: string;
  username: string;
  imageUrl: string;
  status: Status;
};

type UserData = {
  id: string;
  username: string;
  imageUrl: string;
};

export const useConversationsSocket = ({
  conversations,
  setConversations,
}: ConversationProps) => {
  const { socket } = useSocket();
  const [userData, setUserData] = useState<UserData>({
    id: "",
    username: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!socket) {
      return;
    }

    const item = localStorage.getItem("userData");
    if (item) {
      const obj = JSON.parse(item) as UserData;
      setUserData(obj);
    }
    const messageAddKey = `user:${userData.id}:message:add`;

    socket.on(messageAddKey, (message: MessageDto) => {
      if (message) {
        const newConversations = conversations.map((c) => {
          if (c.id === message.conversationId) {
            c.messages.unshift({
              id: message.id,
              content: message.content,
              fileUrl: message.fileUrl,
              createdAt: message.createdAt,
              member: message.member,
            });
          }
          return c;
        });
        newConversations.sort((a, b) => {
          if (a.messages.length === 0) {
            return -1;
          }

          if (b.messages.length === 0) {
            return 1;
          }

          return (
            new Date(b.messages[0].createdAt).getTime() -
            new Date(a.messages[0].createdAt).getTime()
          );
        });
        setConversations(newConversations);
      }
    });

    return () => {
      socket.off(messageAddKey);
    };
  }, [socket, conversations, setConversations, userData.id]);
};
