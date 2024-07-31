import { z } from "zod";

import { inviteSchema, messageSchema } from "@/lib/zod-schemas";

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

  return fetch("/api/socket/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ friendCode }),
  });
};

export const deleteSentInvite = async (id: string) => {
  return fetch("/api/socket/invites/cancel?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const deleteReceivedInvite = async (id: string) => {
  return fetch("/api/socket/invites/reject?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const acceptReceivedInvite = async (id: string) => {
  return fetch("/api/socket/friends/add?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const deleteFriendReq = async (id: string) => {
  return fetch("/api/socket/friends/remove?" + new URLSearchParams({ id }), {
    method: "PUT",
  });
};

export const fetchConversations = async () => {
  const response = await fetch("/api/conversations/all", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch conversations.");
  }
  return response.json();
};

export const fetchConversation = async (id: string) => {
  const response = await fetch(
    "/api/conversations?" + new URLSearchParams({ id }),
    {
      method: "GET",
    }
  );
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

export const createGroupConversation = async (name: string) => {
  return fetch("/api/conversations/group", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
};

export const addUsersToGroup = async (id: string, userIds: Array<string>) => {
  return fetch("/api/conversations/group", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId: id, userIds }),
  });
};

export const updateGroupName = async (conversationId: string, name: string) => {
  return fetch("/api/conversations/group/name", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, name }),
  });
};

export const createMessage = async (
  values: z.infer<typeof messageSchema>,
  id: string
) => {
  const { message, fileUrl } = values;

  return fetch(
    "/api/socket/messages?" + new URLSearchParams({ conversationId: id }),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message, fileUrl }),
    }
  );
};

export const updateProfileImage = async (imageUrl: string) => {
  return fetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });
};

export const updateUserStatus = async (status: number) => {
  return fetch("/api/profile/status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
};

export const fetchUserStatus = async () => {
  const response = await fetch("/api/profile/status", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user status.");
  }
  return response.json();
};
