import { apiFetch } from "./client";
import type { Group } from "./types";

export function listMyGroups() {
  return apiFetch<Group[]>("/groups");
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
