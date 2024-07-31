"use client";

import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { z } from "zod";

import {
  fetchFriends,
  fetchInvitesSent,
  postInvite,
  deleteSentInvite,
  deleteReceivedInvite,
  acceptReceivedInvite,
  fetchInvitesReceived,
  deleteFriendReq,
} from "@/utils/api";
import { inviteSchema } from "@/lib/zod-schemas";

interface FriendItem {
  id: string;
  user: {
    id: string;
    username: string;
    imageUrl: string;
    status: "ONLINE" | "AWAY" | "DONTDISTURB" | "OFFLINE";
  };
}

interface InviteItem {
  id: string;
  receiver: {
    id: string;
    username: string;
    imageUrl: string;
  };
}

interface NotificationItem {
  id: string;
  sender: {
    id: string;
    username: string;
    imageUrl: string;
  };
}

export function useFriends(): {
  friends: Array<FriendItem>;
  setFriends: Dispatch<SetStateAction<FriendItem[]>>;
  loadingFriends: boolean;
  refreshFriends: () => void;
} {
  const [friends, setFriends] = useState<Array<FriendItem>>([]);
  const [loadingFriends, setLoading] = useState(true);

  const fetchFriendsData = async () => {
    try {
      const fetchedFriends: Array<FriendItem> = await fetchFriends();
      setFriends(fetchedFriends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const refreshFriends = () => {
    fetchFriendsData();
  };

  return { friends, setFriends, loadingFriends, refreshFriends };
}

export function useInvitesSent(): {
  invites: Array<InviteItem>;
  setInvites: Dispatch<SetStateAction<InviteItem[]>>;
  loadingInvites: boolean;
  refreshInvites: () => void;
} {
  const [invites, setInvites] = useState<Array<InviteItem>>([]);
  const [loadingInvites, setLoading] = useState(true);

  const fetchInvitesData = async () => {
    setLoading(true);
    try {
      const fetchedInvites: Array<InviteItem> = await fetchInvitesSent();
      setInvites(fetchedInvites);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friend invites:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitesData();
  }, []);

  const refreshInvites = () => {
    fetchInvitesData();
  };

  return { invites, setInvites, loadingInvites, refreshInvites };
}

export function useInvitesReceived(): {
  invites: Array<NotificationItem>;
  setInvites: Dispatch<SetStateAction<NotificationItem[]>>;
  loadingInvites: boolean;
  refreshInvites: () => void;
} {
  const [invites, setInvites] = useState<Array<NotificationItem>>([]);
  const [loadingInvites, setLoading] = useState(true);

  const fetchInvitesData = async () => {
    setLoading(true);
    try {
      const fetchedInvites: Array<NotificationItem> =
        await fetchInvitesReceived();
      setInvites(fetchedInvites);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching received invites:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitesData();
  }, []);

  const refreshInvites = () => {
    fetchInvitesData();
  };

  return { invites, setInvites, loadingInvites, refreshInvites };
}

export function useCreateInvite(refreshInvites: () => void) {
  const { toast } = useToast();

  const createInvite = async (values: z.infer<typeof inviteSchema>) => {
    try {
      const response = await postInvite(values);
      if (response.ok) {
        refreshInvites();
        toast({
          title: "Invite sent.",
          variant: "success",
        });
      } else {
        if (response.status === 400) {
          toast({
            title: "Invalid invite code.",
            variant: "error",
          });
        } else {
          toast({
            title: "Error has occurred.",
            variant: "error",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return createInvite;
}

export function useCancelSentInvite(refreshInvites: () => void) {
  const cancelSentInvite = async (id: string) => {
    try {
      const response = await deleteSentInvite(id);
      if (response.ok) {
        refreshInvites();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return cancelSentInvite;
}

export function useAcceptInvite(refreshInvites: () => void) {
  const acceptInvite = async (id: string) => {
    try {
      const response = await acceptReceivedInvite(id);
      if (response.ok) {
        refreshInvites();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return acceptInvite;
}

export function useRejectInvite(refreshInvites: () => void) {
  const rejectInvite = async (id: string) => {
    try {
      const response = await deleteReceivedInvite(id);
      if (response.ok) {
        refreshInvites();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return rejectInvite;
}

export function useDeleteFriend(refreshFriends: () => void) {
  const deleteFriend = async (id: string) => {
    try {
      const response = await deleteFriendReq(id);
      if (response.ok) {
        refreshFriends();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return deleteFriend;
}
