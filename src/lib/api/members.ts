import { apiFetch } from "./client";
import type { GroupMember } from "./types";

export function listMembers(groupId: number) {
  return apiFetch<GroupMember[]>(`/groups/${groupId}/members`);
}

export function addMember(groupId: number, userId: number) {
  return apiFetch<GroupMember>(`/groups/${groupId}/members`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export function removeMember(groupId: number, userId: number) {
  return apiFetch<void>(`/groups/${groupId}/members/${userId}`, {
    method: "DELETE",
  });
}
