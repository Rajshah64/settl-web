import { apiFetch } from "./client";
import type { GroupBalances } from "./types";

export function getGroupBalances(groupId: number) {
  return apiFetch<GroupBalances>(`/groups/${groupId}/balances`);
}
