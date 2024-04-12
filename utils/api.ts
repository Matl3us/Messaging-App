import { z } from "zod";

import { inviteSchema } from "@/lib/zod-schemas";

export const fetchProfile = async () => {
  const response = await fetch("/api/profile", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile.");
  }
  return response.json();
};

export const fetchFriends = async () => {
  const response = await fetch("/api/friends/list", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch friends list.");
  }
  return response.json();
};

export const fetchInvitesSent = async () => {
  const response = await fetch("/api/friends/invites/created", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch sent invites.");
  }
  return response.json();
};

export const fetchInvitesReceived = async () => {
  const response = await fetch("/api/friends/invites/received", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch received invites.");
  }
  return response.json();
};

export const postInvite = async (values: z.infer<typeof inviteSchema>) => {
  const { friendCode } = values;

  return fetch("/api/friends/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendCode }),
  });
};

export const deleteSentInvite = async (id: string) => {
  return fetch("/api/friends/invites/created?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const deleteReceivedInvite = async (id: string) => {
  return fetch("/api/friends/invites/received?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const acceptReceivedInvite = async (id: string) => {
  return fetch("/api/friends/invites?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const deleteFriendReq = async (id: string) => {
  return fetch("/api/friends/list?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const fetchConversations = async () => {
  const response = await fetch("/api/conversations", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch conversations.");
  }
  return response.json();
};

export const createPrivateConversation = async (id: string) => {
  return fetch("/api/conversations/private?" + new URLSearchParams({ id }), {
    method: "POST",
  });
};
