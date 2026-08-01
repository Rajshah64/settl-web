"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ApiError } from "@/lib/api/client";
import { updateGroup } from "@/lib/api/groups";
import type { Group } from "@/lib/api/types";

interface Props {
  open: boolean;
  onClose: () => void;
  group: Group;
  onUpdated: (group: Group) => void;
}

export function EditGroupModal({ open, onClose, group, onUpdated }: Props) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(group.name);
    setDescription(group.description ?? "");
    setError(null);
  }, [open, group]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const updated = await updateGroup(group.id, {
        name: trimmed,
        description: description.trim() || null,
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update group");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit group">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Name"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Description"
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          hint="Optional"
        />
        {error ? (
          <p className="font-mono text-xs text-accent border-2 border-ink bg-canvas px-2 py-1.5">
            {error}
          </p>
        ) : null}
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
