"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api/client";
import { regenerateInviteCode } from "@/lib/api/groups";
import type { Group } from "@/lib/api/types";
import { joinUrl } from "@/lib/join-link";
import { snapSpring } from "@/lib/motion";

interface Props {
  group: Group;
  canManage: boolean;
  onGroupChange: (group: Group) => void;
  onError: (message: string) => void;
}

export function InviteSharePanel({
  group,
  canManage,
  onGroupChange,
  onError,
}: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "code" | null>(null);
  const [inviteBusy, setInviteBusy] = useState(false);

  const url = joinUrl(group.inviteCode);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 200,
          margin: 1,
          color: { dark: "#1a1a1a", light: "#fdfbf7" },
        });
        if (!cancelled) setQrDataUrl(dataUrl);
      } catch {
        if (!cancelled) setQrDataUrl(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  async function copy(kind: "link" | "code") {
    try {
      await navigator.clipboard.writeText(
        kind === "link" ? url : group.inviteCode,
      );
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }

  async function rotateInvite() {
    setInviteBusy(true);
    try {
      const next = await regenerateInviteCode(group.id);
      onGroupChange({
        ...group,
        inviteCode: next.inviteCode,
        inviteCodeExpiresAt: next.inviteCodeExpiresAt,
      });
    } catch (err) {
      onError(
        err instanceof ApiError ? err.message : "Could not rotate invite",
      );
    } finally {
      setInviteBusy(false);
    }
  }

  return (
    <div className="border-2 border-ink bg-cream px-3 py-3 space-y-3 shrink-0 w-full sm:w-auto">
      <p className="font-mono text-[10px] uppercase text-muted">
        Invite // short link
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrDataUrl}
            alt={`QR code to join ${group.name}`}
            className="border-2 border-ink w-[120px] h-[120px] bg-cream"
          />
        ) : (
          <div className="border-2 border-dashed border-ink w-[120px] h-[120px] bg-canvas flex items-center justify-center font-mono text-[10px] text-muted uppercase">
            QR…
          </div>
        )}

        <div className="space-y-2 min-w-0 flex-1">
          <p className="font-mono text-xs break-all text-ink">{url}</p>
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
            Code {group.inviteCode}
            {group.inviteCodeExpiresAt
              ? ` · expires ${new Date(group.inviteCodeExpiresAt).toLocaleDateString()}`
              : ""}
          </p>
          <div className="flex flex-wrap gap-1">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={snapSpring}
              onClick={() => void copy("link")}
              className="border-2 border-ink bg-canvas px-2 py-1 font-mono text-[10px] uppercase hover:bg-accent hover:text-cream"
            >
              {copied === "link" ? "Copied" : "Copy link"}
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={snapSpring}
              onClick={() => void copy("code")}
              className="border-2 border-ink bg-canvas px-2 py-1 font-mono text-[10px] uppercase hover:bg-ink hover:text-cream"
            >
              {copied === "code" ? "Copied" : "Copy code"}
            </motion.button>
            {canManage ? (
              <Button
                variant="ghost"
                className="!text-[10px] !py-1 !px-2"
                loading={inviteBusy}
                onClick={() => void rotateInvite()}
              >
                Rotate
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
