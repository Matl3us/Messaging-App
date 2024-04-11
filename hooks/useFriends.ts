"use client";

import { useState, useEffect } from "react";
import { fetchFriends, fetchInvitesSent } from "@/utils/api";

interface FriendItem {
  id: string;
  user: {
    username: string;
    imageUrl: string;
  };
}

export function useFriends(): {
  friends: Array<FriendItem>;
  loadingFriends: boolean;
} {
  const [friends, setFriends] = useState<Array<FriendItem>>([]);
  const [loadingFriends, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriendsData() {
      try {
        const fetchedFriends: Array<FriendItem> = await fetchFriends();
        setFriends(fetchedFriends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    }

    fetchFriendsData();
  }, []);

  return { friends, loadingFriends };
}

export function useInvitesSent(): {
  invites: Array<FriendItem>;
  loadingInvites: boolean;
} {
  const [invites, setInvites] = useState<Array<FriendItem>>([]);
  const [loadingInvites, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFriendsData() {
      try {
        const fetchedFriends: Array<FriendItem> = await fetchInvitesSent();
        setInvites(fetchedFriends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friend invites:", error);
      }
    }

    fetchFriendsData();
  }, []);

  return { invites, loadingInvites };
}
