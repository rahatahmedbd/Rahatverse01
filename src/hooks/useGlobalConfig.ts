"use client";

import { useEffect, useState } from "react";
import { DEFAULT_GLOBAL_CONFIG, validateGlobalConfig } from "@/lib/global/config";
import type { GlobalConfig } from "@/types/global";

let cache: GlobalConfig | null = null;
let inflight: Promise<GlobalConfig> | null = null;

/** Loads the public global config once and caches it in module scope. */
export function useGlobalConfig(): GlobalConfig {
  const [config, setConfig] = useState<GlobalConfig>(cache ?? DEFAULT_GLOBAL_CONFIG);

  useEffect(() => {
    if (cache) return;
    if (!inflight) {
      inflight = fetch("/api/global-config", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((json) => {
          const validated = validateGlobalConfig((json as { data?: unknown } | null)?.data);
          cache = validated ?? DEFAULT_GLOBAL_CONFIG;
          return cache;
        })
        .catch(() => {
          cache = DEFAULT_GLOBAL_CONFIG;
          return cache;
        })
        .finally(() => {
          inflight = null;
        });
    }
    let cancelled = false;
    inflight.then((value) => {
      if (!cancelled) setConfig(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
