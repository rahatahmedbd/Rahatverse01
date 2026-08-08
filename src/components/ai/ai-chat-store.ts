"use client";

// ── Rahat AI — Chat Widget Store ───────────────────────
// Shared open/closed state so both the desktop floating bubble and the
// mobile bottom-nav AI button can open the same chat panel.

import { create } from "zustand";

interface AiChatState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useAiChatStore = create<AiChatState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
