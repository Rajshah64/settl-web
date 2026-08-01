"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api/client";
import { joinGroup } from "@/lib/api/groups";
import type { Group } from "@/lib/api/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onJoined: (group: Group) => void;
}

export function JoinGroupModal({ open, onClose, onJoined }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const group = await joinGroup(code.trim());
      setCode("");
      onJoined(group);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not join group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Join by code">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Invite code"
          required
          pattern="\d{6}"
          maxLength={6}
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="123456"
          hint="6-digit code — or open a short link /j/123456 from a QR"
        />
        {error ? (
          <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Join
          </Button>
        </div>
      </form>
    </Modal>
  );
}
