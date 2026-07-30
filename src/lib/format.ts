/** Rupees display <-> paise (integer) helpers. */

export function paiseToRupees(paise: number | string): number {
  const n = typeof paise === "string" ? Number(paise) : paise;
  if (!Number.isFinite(n)) return 0;
  return n / 100;
}

export function formatINR(paise: number | string): string {
  const rupees = paiseToRupees(paise);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/** Parse user rupee input ("1200", "1200.5", "1,200.50") → paise. */
export function rupeesInputToPaise(input: string): number | null {
  const cleaned = input.replace(/,/g, "").trim();
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const rupees = Number(cleaned);
  if (!Number.isFinite(rupees) || rupees <= 0) return null;
  return Math.round(rupees * 100);
}

/** Mirror of backend splitEquallyPaise for live preview. */
export function splitEquallyPaise(
  amountPaise: number,
  participantCount: number,
): number[] {
  if (participantCount < 1 || amountPaise < 1) return [];
  const base = Math.floor(amountPaise / participantCount);
  const remainder = amountPaise % participantCount;
  return Array.from({ length: participantCount }, (_, i) =>
    i < remainder ? base + 1 : base,
  );
}

export function displayName(user: {
  firstName: string;
  lastName: string;
}): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function initials(user: { firstName: string; lastName: string }): string {
  return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
}
