import { describe, expect, it } from "vitest";
import {
  AI_FAQ,
  QUICK_PROMPTS,
  answerFromKnowledgeBase,
  matchFaq,
} from "@/lib/ai/knowledge";

describe("Nuva knowledge base", () => {
  it("matches an English pricing question", () => {
    const match = matchFaq("How much does a website cost?");
    expect(match?.entry.id).toBe("pricing");
  });

  it("matches a Bangla pricing question", () => {
    const match = matchFaq("ওয়েবসাইটের দাম কত?");
    expect(match?.entry.id).toBe("pricing");
  });

  it("matches an ordering question in Bangla", () => {
    const match = matchFaq("কীভাবে অর্ডার করবো?");
    expect(match?.entry.id).toBe("order");
  });

  it("matches a WhatsApp/contact question", () => {
    const match = matchFaq("what is your whatsapp number");
    expect(match?.entry.id).toBe("contact");
  });

  it("returns null for unrelated messages", () => {
    expect(matchFaq("do you like pizza with pineapple")).toBeNull();
  });

  it("greets short greetings in English", () => {
    const answer = answerFromKnowledgeBase("hello", "en");
    expect(answer.reply).toContain("Nuva");
  });

  it("answers in Bangla when the bn locale is active", () => {
    const answer = answerFromKnowledgeBase("hello", "bn");
    expect(answer.reply).toContain("নুভা");
  });

  it("says Salam on the first exchange of a conversation", () => {
    const answer = answerFromKnowledgeBase("How much does a website cost?", "en", true);
    expect(answer.reply.startsWith("Assalamu Alaikum")).toBe(true);
  });

  it("does NOT repeat Salam on follow-up messages", () => {
    const answer = answerFromKnowledgeBase("How much does a website cost?", "en", false);
    expect(answer.reply.startsWith("Assalamu Alaikum")).toBe(false);
  });

  it("does NOT repeat Salam when the visitor greets again mid-conversation", () => {
    const answer = answerFromKnowledgeBase("hi", "en", false);
    expect(answer.reply.toLowerCase()).not.toContain("assalamu");
    expect(answer.reply).toContain("I'm here");
  });

  it("falls back gracefully for unknown questions", () => {
    const answer = answerFromKnowledgeBase("xyzzy nonsense input", "en");
    expect(answer.reply.length).toBeGreaterThan(0);
    expect(answer.links.length).toBeGreaterThan(0);
  });

  it("every FAQ entry and quick prompt has both languages", () => {
    for (const entry of AI_FAQ) {
      expect(entry.answerEn.length).toBeGreaterThan(0);
      expect(entry.answerBn.length).toBeGreaterThan(0);
      expect(entry.keywords.length).toBeGreaterThan(0);
    }
    for (const prompt of QUICK_PROMPTS) {
      expect(prompt.en.length).toBeGreaterThan(0);
      expect(prompt.bn.length).toBeGreaterThan(0);
      // Quick prompts should always resolve to a built-in answer.
      expect(matchFaq(prompt.en)).not.toBeNull();
    }
  });
});
