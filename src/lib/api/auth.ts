import { apiFetch } from "./client";
import type { AuthTokenResponse, AuthUser, UserProfile } from "./types";

export function register(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return apiFetch<AuthTokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }) {
  return apiFetch<AuthTokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMe() {
  return apiFetch<AuthUser>("/auth/me");
}

export function getProfile() {
  return apiFetch<UserProfile>("/user/me");
}

export function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
