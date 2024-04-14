"use client";

import { useState, useEffect } from "react";

import { fetchConversations, createPrivateConversation } from "@/utils/api";

interface ConversationItem {
  id: string;
  name?: string;
  isGroup: boolean;
  members: Array<UserItem>;
}

interface UserItem {
  id: string;
  username: string;
  imageUrl: string;
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
