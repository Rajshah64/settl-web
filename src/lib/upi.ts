import { displayName, paiseToRupees } from "./format";

/**
 * UPI intent URI. Opens GPay / PhonePe / etc. when `pa` (VPA) is set.
 * https://www.npci.org.in/what-we-do/upi/product-overview
 */
export function buildUpiPayUrl(input: {
  pa: string;
  payeeName: string;
  amountPaise: number;
  note?: string;
}): string {
  const am = paiseToRupees(input.amountPaise).toFixed(2);
  const params = new URLSearchParams({
    pa: input.pa,
    pn: input.payeeName,
    am,
    cu: "INR",
  });
  if (input.note) {
    params.set("tn", input.note.slice(0, 50));
  }
  return `upi://pay?${params.toString()}`;
}

export function upiPayHref(input: {
  to: { firstName: string; lastName: string; upiId?: string | null };
  amountPaise: number;
  note?: string;
}): string | null {
  const pa = input.to.upiId?.trim();
  if (!pa) return null;
  return buildUpiPayUrl({
    pa,
    payeeName: displayName(input.to),
    amountPaise: input.amountPaise,
    note: input.note,
  });
}
