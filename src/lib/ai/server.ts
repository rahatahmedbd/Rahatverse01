// ── Nuva — LLM Providers (server only) ─────────────
// Resolution order:
//   1. Grok AI — the user's own Vercel deployment (OpenAI-compatible endpoint).
//      Point GROK_API_URL at the Vercel app that proxies Grok, or set a
//      GROK_API_KEY to call https://api.x.ai directly.
//   2. Groq (free tier) — called over plain HTTPS (no SDK needed):
//      free key at https://console.groq.com/keys
// If no provider key/URL is set (or all calls fail), the API route falls back
// to the local knowledge base so the chat never breaks.
//
// GREETING RULE: Salam ("Assalamu Alaikum") is used ONLY on the very first
// message of a conversation. Follow-ups never repeat the greeting.

import { SITE_FACTS, type AiLocale } from "@/lib/ai/knowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const REQUEST_TIMEOUT_MS = 15_000;

/**
 * True when the conversation has not started yet — i.e. there is no prior
 * assistant message. This is the only case where a Salam greeting is used.
 */
export function isFirstExchange(messages: ChatMessage[]): boolean {
  return !messages.some((m) => m.role === "assistant");
}

function systemPrompt(locale: AiLocale, firstExchange: boolean): string {
  const languageNote =
    locale === "bn"
      ? "The visitor is browsing the Bangla version of the site, so prefer Bangla unless they write in English."
      : "The visitor is browsing the English version of the site, so prefer English unless they write in Bangla.";

  const greetingRule = firstExchange
    ? "GREETING RULE: This is the FIRST message of a brand-new conversation, so begin your reply with the Islamic greeting \"Assalamu Alaikum\" (English) or \"আসসালামু আলাইকুম\" (Bangla). Never use Nomoskar/Namaskar/Namaste/Hello/Hi as the opening greeting."
    : "GREETING RULE: This is a FOLLOW-UP message in an ongoing conversation — the visitor has already been greeted. Do NOT greet again: never start your reply with \"Assalamu Alaikum\" or any other greeting. Answer directly and naturally.";

  const maturityNote =
    "MATURITY RULE: Be mature, realistic and honest. Give practical, grounded, professional answers — no hype, no exaggerated claims, and never invent facts, prices, discounts or promises. If you are unsure about something (e.g. exact availability), say so honestly and suggest contacting Rahat on WhatsApp or via the /contact page. Keep answers concise.";

  return `${SITE_FACTS}\n\n${languageNote}\n\n${greetingRule}\n\n${maturityNote}`;
}

/** Shared OpenAI-compatible chat completions caller. */
async function callChatCompletions(
  endpoint: string,
  apiKey: string | undefined,
  model: string,
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt(locale, isFirstExchange(messages)) },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    const text = (
      data as { choices?: { message?: { content?: string } }[] }
    ).choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

/**
 * Grok AI — primary provider.
 * Uses the user's Vercel deployment when GROK_API_URL is set (OpenAI-compatible
 * POST /chat/completions, e.g. a Vercel AI Gateway or custom Grok proxy route).
 * When only GROK_API_KEY is set, calls https://api.x.ai directly.
 */
export async function chatWithGrok(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<string | null> {
  const url = process.env.GROK_API_URL;
  const apiKey = process.env.GROK_API_KEY;
  if (!url && !apiKey) return null;

  const endpoint = url || "https://api.x.ai/v1/chat/completions";
  const model = process.env.GROK_MODEL || "grok-3-mini";
  return callChatCompletions(endpoint, apiKey, model, messages, locale);
}

/** Groq (free tier) via its OpenAI-compatible endpoint. */
export async function chatWithGroq(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  return callChatCompletions(
    "https://api.groq.com/openai/v1/chat/completions",
    apiKey,
    model,
    messages,
    locale,
  );
}

/**
 * Try the configured providers in order: Grok AI (Vercel) → Groq → null.
 * Returns the reply text plus which provider produced it, or null when no
 * provider is available.
 */
export async function chatWithProviders(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<{ reply: string; provider: "grok" | "groq" } | null> {
  const grok = await chatWithGrok(messages, locale);
  if (grok) return { reply: grok, provider: "grok" };

  const groq = await chatWithGroq(messages, locale);
  if (groq) return { reply: groq, provider: "groq" };

  return null;
}
