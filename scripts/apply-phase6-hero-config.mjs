#!/usr/bin/env node

/**
 * One-time production deployment hook for migration 033.
 *
 * Vercel has the production Supabase service key, while this repository
 * checkout intentionally does not. This hook applies the same narrowly scoped
 * JSON update during the production build, verifies the returned row, and is
 * removed immediately after production verification. It never logs secrets or
 * unrelated configuration values.
 */

if (process.env.VERCEL_ENV !== "production") {
  console.log("[Phase 6 hero config] Skipped outside the production deployment.");
  process.exit(0);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("[Phase 6 hero config] Production Supabase credentials are unavailable.");
}

const endpoint = `${supabaseUrl}/rest/v1/site_settings?key=eq.hero_config`;
const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

const readResponse = await fetch(`${endpoint}&select=value`, {
  headers,
  signal: AbortSignal.timeout(20_000),
});

if (!readResponse.ok) {
  throw new Error(`[Phase 6 hero config] Read failed with HTTP ${readResponse.status}.`);
}

const rows = await readResponse.json();
if (!Array.isArray(rows) || rows.length !== 1) {
  throw new Error("[Phase 6 hero config] Expected exactly one hero_config row.");
}

const current = rows[0]?.value;
if (!current || typeof current !== "object" || Array.isArray(current) || !Array.isArray(current.ctas)) {
  throw new Error("[Phase 6 hero config] Stored hero_config is malformed.");
}

const orderCta = current.ctas.find((cta) => cta?.id === "cta-order");
const portfolioCta = current.ctas.find((cta) => cta?.id === "cta-portfolio");
if (!orderCta || !portfolioCta) {
  throw new Error("[Phase 6 hero config] Required CTA objects are missing; refusing an unsafe update.");
}

// Preserve every non-CTA field and every visual property of the retained CTAs.
const next = {
  ...current,
  ctas: [
    {
      ...orderCta,
      id: "cta-order",
      labelEn: "Order a Website",
      labelBn: "ওয়েবসাইট অর্ডার করুন",
    },
    {
      ...portfolioCta,
      id: "cta-portfolio",
      labelEn: "View Work & Proof",
      labelBn: "কাজ ও প্রমাণ দেখুন",
    },
  ],
};

const alreadyCorrect = JSON.stringify(current) === JSON.stringify(next);
if (!alreadyCorrect) {
  const updateResponse = await fetch(`${endpoint}&select=value`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ value: next }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!updateResponse.ok) {
    throw new Error(`[Phase 6 hero config] Update failed with HTTP ${updateResponse.status}.`);
  }

  const updatedRows = await updateResponse.json();
  if (!Array.isArray(updatedRows) || updatedRows.length !== 1) {
    throw new Error("[Phase 6 hero config] Update did not return exactly one row.");
  }

  verify(updatedRows[0]?.value);
  console.log("[Phase 6 hero config] Production hero_config.ctas updated and verified.");
} else {
  verify(current);
  console.log("[Phase 6 hero config] Production hero_config.ctas already correct; verified.");
}

function verify(config) {
  if (!config || !Array.isArray(config.ctas) || config.ctas.length !== 2) {
    throw new Error("[Phase 6 hero config] Verification failed: expected exactly two CTAs.");
  }

  const [order, portfolio] = config.ctas;
  const valid =
    order?.id === "cta-order" &&
    order.labelEn === "Order a Website" &&
    order.labelBn === "ওয়েবসাইট অর্ডার করুন" &&
    portfolio?.id === "cta-portfolio" &&
    portfolio.labelEn === "View Work & Proof" &&
    portfolio.labelBn === "কাজ ও প্রমাণ দেখুন";

  if (!valid) {
    throw new Error("[Phase 6 hero config] Verification failed: CTA labels or ordering do not match.");
  }
}
