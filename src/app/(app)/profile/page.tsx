"use client";

import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { changePassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { updateProfile } from "@/lib/api/users";
import { useAuth } from "@/lib/auth/auth-context";
import { snapSpring } from "@/lib/motion";

export default function ProfilePage() {
  const { profile, user, logout, refreshProfile } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileOk, setProfileOk] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordOk, setPasswordOk] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
  }, [profile]);

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileOk(null);

    const nextFirst = firstName.trim();
    const nextLast = lastName.trim();
    if (!nextFirst || !nextLast) {
      setProfileError("First and last name are required");
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ firstName: nextFirst, lastName: nextLast });
      await refreshProfile();
      setProfileOk("Profile updated");
    } catch (err) {
      setProfileError(
        err instanceof ApiError ? err.message : "Could not update profile",
      );
    } finally {
      setProfileLoading(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordOk(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOk("Password updated");
    } catch (err) {
      setPasswordError(
        err instanceof ApiError ? err.message : "Could not change password",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <header className="border-b-2 border-ink pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mb-1">
          Account // Profile
        </p>
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          Profile
        </h1>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={snapSpring}
        className="border-2 border-ink bg-cream shadow-hard divide-y-2 divide-ink"
      >
        <Row label="Email" value={profile?.email ?? user?.email ?? "—"} />
        <Row label="User ID" value={String(user?.id ?? "—")} mono />
      </motion.div>

      <section className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Edit name
        </p>
        <form
          onSubmit={onSaveProfile}
          className="border-2 border-ink bg-cream shadow-hard p-4 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {profileError ? (
            <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
              {profileError}
            </p>
          ) : null}
          {profileOk ? (
            <p className="font-mono text-xs border-2 border-ink bg-canvas px-2 py-1.5">
              {profileOk}
            </p>
          ) : null}
          <Button type="submit" loading={profileLoading}>
            Save name
          </Button>
        </form>
      </section>

      <section className="space-y-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Change password
        </p>
        <form
          onSubmit={onChangePassword}
          className="border-2 border-ink bg-cream shadow-hard p-4 space-y-4"
        >
          <Input
            label="Current password"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            hint="At least 8 characters"
          />
          <Input
            label="Confirm new password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {passwordError ? (
            <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
              {passwordError}
            </p>
          ) : null}
          {passwordOk ? (
            <p className="font-mono text-xs border-2 border-ink bg-canvas px-2 py-1.5">
              {passwordOk}
            </p>
          ) : null}
          <Button type="submit" variant="secondary" loading={passwordLoading}>
            Update password
          </Button>
        </form>
      </section>

      <Button
        variant="danger"
        onClick={() => {
          logout();
          router.replace("/");
        }}
      >
        Log out
      </Button>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-4 py-3 flex items-baseline justify-between gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted shrink-0">
        {label}
      </span>
      <span
        className={`text-sm font-bold text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
