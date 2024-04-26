"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  fetchConversations,
  fetchConversation,
  createPrivateConversation,
  createGroupConversation,
  addUsersToGroup,
} from "@/utils/api";

interface ConversationItem {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<UserItem>;
  messages: Array<MessageItem>;
}

interface UserItem {
  id: string;
  username: string;
  imageUrl: string;
}

interface MessageItem {
  id: string;
  content: string;
  fileUrl: string;
  createdAt: Date;
  member: UserItem;
}

export function useConversations(): {
  conversations: Array<ConversationItem>;
  loadingConversations: boolean;
  refreshConversations: () => void;
} {
  const [conversations, setConversations] = useState<Array<ConversationItem>>(
    []
  );
  const [loadingConversations, setLoading] = useState(true);

  const fetchConversationsData = async () => {
    try {
      const fetchedConversations: Array<ConversationItem> =
        await fetchConversations();
      setConversations(fetchedConversations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversationsData();
  }, []);

  const refreshConversations = () => {
    fetchConversationsData();
  };

  return { conversations, loadingConversations, refreshConversations };
}

export function useConversation(id: string): {
  conversation: ConversationItem;
  loadingConversation: boolean;
} {
  const [conversation, setConversation] = useState<ConversationItem>({
    id: "",
    isGroup: false,
    members: [],
    messages: [],
  });
  const [loadingConversation, setLoading] = useState(true);

  const fetchConversationData = async (id: string) => {
    try {
      const fetchedConversations: ConversationItem = await fetchConversation(
        id
      );
      setConversation(fetchedConversations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  useEffect(() => {
    fetchConversationData(id);
  }, [id]);

  return { conversation, loadingConversation };
}

export function useCreatePrivateConv(refreshConversations: () => void) {
  const router = useRouter();
  const acceptInvite = async (id: string) => {
    try {
      const response = await createPrivateConversation(id);
      const data = await response.json();
      if (response.ok) {
        refreshConversations();
        router.push(data.location);
      } else if (response.status === 409) {
        router.push(data.location);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return acceptInvite;
}

export function useCreateGroup(refreshConversations: () => void) {
  const router = useRouter();
  const createGroup = async (
    name: string,
    userIds: Array<string>,
    setOpen: (open: boolean) => void
  ) => {
    try {
      const createResponse = await createGroupConversation(name);
      const data = await createResponse.json();
      if (createResponse.ok) {
        const addResponse = await addUsersToGroup(data.id, userIds);
        if (addResponse.ok) {
          refreshConversations();
          setOpen(false);
          router.push(`/conversations/${data.id}`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return createGroup;
}
