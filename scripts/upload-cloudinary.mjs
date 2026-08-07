#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// RahatVerse — Cloudinary media migration
//
// Uploads the 14 approved legacy images from https://rahatahmedbd.github.io
// to the `rahatverse/…` public IDs the site expects (see IMAGE_MIGRATION_GUIDE.md).
//
// Zero dependencies. Requires Node 18+ (built-in fetch).
//
// Usage:
//   CLOUDINARY_CLOUD_NAME=kbc3dfnj \
//   CLOUDINARY_API_KEY=xxxxx \
//   CLOUDINARY_API_SECRET=xxxxx \
//   node scripts/upload-cloudinary.mjs
//
// Or rely on .env.local which is auto-loaded if present.
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Auto-load .env.local without any dependency (values here are only defaults;
// real environment variables always win).
const envPath = join(__dirname, "..", ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error("Missing CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.");
  process.exit(1);
}

// public ID -> legacy source URL (Cloudinary fetches it server-side)
const MAPPINGS = [
  ["rahatverse/profile", "https://rahatahmedbd.github.io/assets/images/profile.jpg"],
  ["rahatverse/shantichakra-logo", "https://rahatahmedbd.github.io/assets/images/logo.png"],
  ["rahatverse/father-photo", "https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg"],
  ["rahatverse/ssc-2025", "https://rahatahmedbd.github.io/assets/images/ssc-gpa5-2025.jpg"],
  ["rahatverse/ssc-songbordhona", "https://rahatahmedbd.github.io/assets/images/ssc-songbordhona-2025.jpg"],
  ["rahatverse/ssc-crest-shantichakra", "https://rahatahmedbd.github.io/assets/images/ssc-crest-shantichakra.jpg"],
  ["rahatverse/shantichakra-blood-society", "https://rahatahmedbd.github.io/assets/images/shantichakra-blood-society.jpg"],
  ["rahatverse/46-science-fair-2025", "https://rahatahmedbd.github.io/assets/images/46-science-fair-2025.jpg"],
  ["rahatverse/srijonshil-medha-2024", "https://rahatahmedbd.github.io/assets/images/srijonshil-medha-2024.jpg"],
  ["rahatverse/44-science-fair-2024", "https://rahatahmedbd.github.io/assets/images/44-science-fair-2024.jpg"],
  ["rahatverse/45-science-fair-2023", "https://rahatahmedbd.github.io/assets/images/45-science-fair-2023.jpg"],
  ["rahatverse/42-science-fair-2020", "https://rahatahmedbd.github.io/assets/images/42-science-fair-2020.jpg"],
  ["rahatverse/fs-coaching-center", "https://rahatahmedbd.github.io/assets/images/fs-coaching-center.jpg"],
  ["rahatverse/helping-hand-org", "https://rahatahmedbd.github.io/assets/images/helping-hand-org.jpg"],
];

function sign(params, secret) {
  const toSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + secret;
  return createHash("sha1").update(toSign).digest("hex");
}

async function uploadOne(publicId, sourceUrl) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { overwrite: "true", public_id: publicId, timestamp };
  const body = new URLSearchParams({
    ...params,
    api_key: API_KEY,
    signature: sign(params, API_SECRET),
    file: sourceUrl,
  });
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `HTTP ${res.status}`);
  return data;
}

let failed = 0;
for (const [publicId, sourceUrl] of MAPPINGS) {
  try {
    const r = await uploadOne(publicId, sourceUrl);
    console.log(`OK   ${publicId}  ${r.width}x${r.height}  ${r.bytes} bytes  ${r.secure_url}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${publicId}  ${err.message}`);
  }
}

// Verify delivery URLs (what the site will request)
console.log("\nDelivery URL check:");
for (const [publicId] of MAPPINGS) {
  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${publicId}`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    console.log(`${res.ok ? "200" : res.status}  ${url}`);
    if (!res.ok) failed++;
  } catch (err) {
    failed++;
    console.error(`ERR  ${url}  ${err.message}`);
  }
}

if (failed) {
  console.error(`\n${failed} item(s) failed.`);
  process.exit(1);
}
console.log("\nAll 14 images migrated successfully.");
