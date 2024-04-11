export const fetchProfile = async () => {
  const response = await fetch("/api/profile", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};
