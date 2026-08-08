// ── Nuva — LLM Providers (server only) ─────────────
// Free-tier friendly providers, called over plain HTTPS (no SDK needed):
//   1. Google Gemini  — free key at https://aistudio.google.com/apikey
//   2. Groq           — free key at https://console.groq.com/keys
// Both are tried in order; if neither key is set (or both fail), the API
// route falls back to the local knowledge base so the chat never breaks.

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
  return `${SITE_FACTS}\n\n${languageNote}`;
}

/** Google Gemini (free tier) via the REST generateContent endpoint. */
export async function chatWithGemini(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model,
  )}:generateContent`;

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt(locale) }],
    },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 400,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data: unknown = await response.json();
    const candidates = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })
      .candidates;
    const text = candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  }
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
 * Try each configured free provider in order. Returns the reply text plus
 * which provider produced it, or null when no provider is available.
 */
export async function chatWithProviders(
  messages: ChatMessage[],
  locale: AiLocale,
): Promise<{ reply: string; provider: "gemini" | "groq" } | null> {
  const gemini = await chatWithGemini(messages, locale);
  if (gemini) return { reply: gemini, provider: "gemini" };

  const groq = await chatWithGroq(messages, locale);
  if (groq) return { reply: groq, provider: "groq" };

  return null;
}
