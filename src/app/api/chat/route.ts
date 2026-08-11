import { NextResponse } from "next/server";
import {
  chatWithGroq,
  isFirstExchange,
  type ChatMessage,
} from "@/lib/ai/server";
import {
  answerFromKnowledgeBase,
  type AiLocale,
  actionsForMessage,
} from "@/lib/ai/knowledge";

// ── Nuva (AI assistant) — Chat API ────────────────────────────────
// POST /api/chat  { messages: ChatMessage[], locale: "en" | "bn" }
//
// Resolution order:
//   1. Groq when GROQ_API_KEY is configured → real AI answer
//   2. Built-in verified knowledge otherwise → instant FAQ answer
// The endpoint never hard-fails for provider problems: visitors always get
// a useful reply.
//
// GREETING RULE: Salam ("Assalamu Alaikum") is used ONLY on the very first
// message of a conversation — never repeated on follow-ups — enforced here
// for all sources.

export const dynamic = "force-dynamic";

const MAX_HISTORY = 12;
const MAX_CONTENT_LENGTH = 1_000;
const RATE_LIMIT_WINDOW_MS = 5 * 60_000; // 5 minutes
const RATE_LIMIT_MAX = 20; // requests per window per client

// NOTE: in-memory limiting is per server instance on serverless platforms.
// It stops casual abuse from a single visitor/session; pair with provider
// dashboard quotas for hard caps.
const rateBuckets = new Map<string, number[]>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateBuckets.get(key) ?? []).filter((ts) => ts > windowStart);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateBuckets.set(key, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(key, hits);
  // Keep the map bounded on long-lived instances.
  if (rateBuckets.size > 5_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.every((ts) => ts <= windowStart)) rateBuckets.delete(bucketKey);
    }
  }
  return false;
}

function sanitizeMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const cleaned: ChatMessage[] = [];
  for (const raw of input.slice(-MAX_HISTORY)) {
    if (!raw || typeof raw !== "object") return null;
    const { role, content } = raw as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || !content.trim() || content.length > MAX_CONTENT_LENGTH) return null;
    cleaned.push({
      role,
      content: content.trim(),
    });
  }

  // There must be a final user message to respond to.
  return cleaned[cleaned.length - 1]?.role === "user" ? cleaned : null;
}

/**
 * Salam enforcement:
 * - First exchange of a conversation → ensure the reply starts with Salam
 *   (and never with Nomoskar/Hello/Hi).
 * - Follow-up messages → the greeting must NOT be repeated: a leading Salam
 *   (if the LLM added one anyway) is stripped so replies stay natural.
 */
function ensureSalam(text: string, locale: AiLocale, isFirst: boolean): string {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const hasSalam =
    lower.startsWith("assalamu alaikum") ||
    lower.startsWith("আসসালামু আলাইকুম") ||
    lower.startsWith("আসসালামু") ||
    lower.startsWith("assalamu");

  if (!isFirst) {
    if (!hasSalam) return trimmed;
    // Strip a repeated greeting from a follow-up reply.
    const stripped = trimmed
      .replace(
        /^(assalamu alaikum|আসসালামু আলাইকুম|আসসালামু|assalamu)[\s!.,।:;—–]*/i,
        "",
      )
      .trim();
    return stripped || trimmed;
  }

  if (hasSalam) return trimmed;
  // Remove accidental Nomoskar/Hello prefix from LLM
  const withoutBadGreeting = trimmed
    .replace(/^(nomoskar|nomoshkar|namaskar|namaste|নমস্কার|নমস|hello|hi|hey)[!,.।\s]*/i, "")
    .trim();
  const prefix = locale === "bn" ? "আসসালামু আলাইকুম! " : "Assalamu Alaikum! ";
  return prefix + (withoutBadGreeting || trimmed);
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { error: "Too many messages — please wait a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const messages = sanitizeMessages(input.messages);
  if (!messages) {
    return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
  }

  const locale: AiLocale = input.locale === "bn" ? "bn" : "en";
  const lastUserMessage = messages[messages.length - 1].content;
  const firstExchange = isFirstExchange(messages);

  const isSensitiveRequest = /api\s*key|system\s*prompt|hidden\s*instructions?|environment\s*(variables?|config)|private\s*(database|data)|ignore\s+(your|previous)|admin\s*(data|dashboard)/i.test(lastUserMessage);
  if (isSensitiveRequest) {
    const reply = locale === "bn"
      ? "আমি গোপন নির্দেশনা, কী বা ব্যক্তিগত তথ্য শেয়ার করতে পারি না। RahatVerse-এর প্রকাশ্য তথ্য, সেবা বা পেজ খুঁজে পেতে আমি সাহায্য করতে পারি।"
      : "I can’t share private instructions, keys, or private information. I can help with public RahatVerse information, services, or finding a page.";
    return NextResponse.json({ reply: ensureSalam(reply, locale, firstExchange), source: "safety", actions: [] });
  }

  // Groq is the only AI provider. A provider outage falls back to verified local knowledge.
  const groqReply = await chatWithGroq(messages, locale);
  const actions = actionsForMessage(lastUserMessage);
  if (groqReply) {
    return NextResponse.json({ reply: ensureSalam(groqReply, locale, firstExchange), source: "groq", actions });
  }

  const kb = answerFromKnowledgeBase(lastUserMessage, locale, firstExchange);
  return NextResponse.json({ reply: ensureSalam(kb.reply, locale, firstExchange), source: "kb", actions });
}
