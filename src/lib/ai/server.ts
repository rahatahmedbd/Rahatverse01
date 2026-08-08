// ── Nuva — LLM Provider (server only) ─────────────
// Groq (free tier), called over plain HTTPS (no SDK needed):
//   free key at https://console.groq.com/keys
// If the key is not set (or the call fails), the API route falls back to
// the local knowledge base so the chat never breaks.

import { SITE_FACTS, type AiLocale } from "@/lib/ai/knowledge";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const REQUEST_TIMEOUT_MS = 15_000;

function systemPrompt(locale: AiLocale): string {
  const languageNote =
    locale === "bn"
      ? "The visitor is browsing the Bangla version of the site, so prefer Bangla unless they write in English."
      : "The visitor is browsing the English version of the site, so prefer English unless they write in Bangla.";

  const salamEnforcement =
    locale === "bn"
      ? "CRITICAL: Every reply MUST start with 'আসসালামু আলাইকুম!'. NEVER use Nomoskar/Namaskar. Always Salam, in every single response."
      : "CRITICAL: Every reply MUST start with 'Assalamu Alaikum!'. NEVER use Nomoskar/Namaskar. Always Salam, in every single response.";

  return `${SITE_FACTS}\n\n${languageNote}\n\n${salamEnforcement}`;
}

/** Groq (free tier) via its OpenAI-compatible endpoint. */
export async function chatWithGroq(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt(locale) },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 400,
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
 * Try the configured Groq provider. Returns the reply text plus which
 * provider produced it, or null when no provider is available.
 */
export async function chatWithProviders(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<{ reply: string; provider: "groq" } | null> {
  const groq = await chatWithGroq(messages, locale);
  if (groq) return { reply: groq, provider: "groq" };

  return null;
}
