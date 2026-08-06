// ── Device Detection ───────────────────────────────────
// Lightweight user-agent based device classification used by the analytics
// ingestion endpoint. Deliberately dependency-free; accuracy is best-effort.

import type { DeviceType } from "@/types/database";

const TABLET_PATTERN =
  /ipad|tablet|playbook|silk|kindle|(android(?!.*mobile))/i;
const MOBILE_PATTERN =
  /mobi|iphone|ipod|android.*mobile|windows phone|blackberry|opera mini|iemobile/i;

export function detectDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "unknown";
  if (TABLET_PATTERN.test(userAgent)) return "tablet";
  if (MOBILE_PATTERN.test(userAgent)) return "mobile";
  return "desktop";
}
