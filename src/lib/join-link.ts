/** First-party short join path — no external shortener. */
export function joinPath(inviteCode: string): string {
  return `/j/${inviteCode}`;
}

/** Absolute share URL for QR / clipboard. */
export function joinUrl(inviteCode: string, origin?: string): string {
  const base =
    origin ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${joinPath(inviteCode)}`;
}
