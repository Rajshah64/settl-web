import { apiFetch } from "./client";
import type { Settlement } from "./types";

export function listSettlements(groupId: number) {
  return apiFetch<Settlement[]>(`/groups/${groupId}/settlements`);
}

export function createSettlement(
  groupId: number,
  body: {
    fromUserId: number;
    toUserId: number;
    amountPaise: number;
    note?: string;
  },
) {
  return apiFetch<Settlement>(`/groups/${groupId}/settlements`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deleteSettlement(groupId: number, settlementId: number) {
  return apiFetch<void>(`/groups/${groupId}/settlements/${settlementId}`, {
    method: "DELETE",
  });
}
