import { apiFetch } from "./client";
import type { Group } from "./types";

export function listMyGroups() {
  return apiFetch<Group[]>("/groups");
}

export function listArchivedGroups() {
  return apiFetch<Group[]>("/groups/archived");
}

export function getGroup(groupId: number) {
  return apiFetch<Group>(`/groups/${groupId}`);
}

export function createGroup(input: { name: string; description?: string }) {
  return apiFetch<Group>("/groups", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateGroup(
  groupId: number,
  input: { name?: string; description?: string | null },
) {
  return apiFetch<Group>(`/groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function archiveGroup(groupId: number) {
  return apiFetch<void>(`/groups/${groupId}`, { method: "DELETE" });
}

export function restoreGroup(groupId: number) {
  return apiFetch<Group>(`/groups/${groupId}/restore`, { method: "POST" });
}

export function transferOwnership(groupId: number, newOwnerUserId: number) {
  return apiFetch<Group>(`/groups/${groupId}/transfer`, {
    method: "POST",
    body: JSON.stringify({ newOwnerUserId }),
  });
}

export function joinGroup(code: string) {
  return apiFetch<Group>("/groups/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export function leaveGroup(groupId: number) {
  return apiFetch<void>(`/groups/${groupId}/leave`, {
    method: "POST",
  });
}

export function regenerateInviteCode(groupId: number) {
  return apiFetch<{ inviteCode: string; inviteCodeExpiresAt: string }>(
    `/groups/${groupId}/invite-code`,
    { method: "POST" },
  );
}
