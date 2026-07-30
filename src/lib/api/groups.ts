import { apiFetch } from "./client";
import type { Group } from "./types";

export function listMyGroups() {
  return apiFetch<Group[]>("/groups");
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
