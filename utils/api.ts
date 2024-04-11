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
