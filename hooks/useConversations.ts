"use client";

import { useState, useEffect } from "react";

import {
  fetchConversations,
  fetchConversation,
  createPrivateConversation,
} from "@/utils/api";

interface ConversationItem {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<UserItem>;
  messages?: Array<MessageItem>;
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
  const acceptInvite = async (id: string) => {
    try {
      const response = await createPrivateConversation(id);
      if (response.ok) {
        refreshConversations();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return acceptInvite;
}
