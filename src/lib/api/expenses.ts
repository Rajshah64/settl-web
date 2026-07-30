import { apiFetch } from "./client";
import type { Expense, Paginated } from "./types";

export function listExpenses(groupId: number, page = 1, limit = 20) {
  const q = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  return apiFetch<Paginated<Expense>>(
    `/groups/${groupId}/expenses?${q.toString()}`,
  );
}

export function createExpense(
  groupId: number,
  input: {
    description: string;
    amountPaise: number;
    paidByUserId: number;
    participantUserIds: number[];
    spentAt?: string;
  },
) {
  return apiFetch<Expense>(`/groups/${groupId}/expenses`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteExpense(groupId: number, expenseId: number) {
  return apiFetch<void>(`/groups/${groupId}/expenses/${expenseId}`, {
    method: "DELETE",
  });
}
