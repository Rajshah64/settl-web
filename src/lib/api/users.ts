import { apiFetch } from "./client";
import type { Paginated, UserProfile } from "./types";

export function searchUsers(q: string, page = 1, limit = 10) {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });
  return apiFetch<Paginated<UserProfile>>(`/user/search?${params.toString()}`);
}

export function updateProfile(input: {
  firstName?: string;
  lastName?: string;
}) {
  return apiFetch<UserProfile>("/user/me", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
