import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { validateOrdersConfig } from "@/lib/orders/config";
import { validateExperienceConfig } from "@/lib/experience/config";
import { validateGalleryConfig, validateVideoConfig } from "@/lib/media/config";
import { validateBlogConfig } from "@/lib/blog/config";
import { validateContactConfig } from "@/lib/contact/config";
import { validateLinksConfig } from "@/lib/links/config";
import { validateNewsletterConfig } from "@/lib/newsletter/config";
import { validateThemeConfig } from "@/lib/theme/config";
import { validateContentConfig } from "@/lib/content/config";
import { validateAnalyticsConfig } from "@/lib/analytics/config";
import { validateGlobalConfig } from "@/lib/global/config";
import { validateServicesConfig } from "@/lib/services/config";

function loadJson(file: string): Record<string, unknown> {
  const sql = readFileSync(file, "utf8");
  const m = sql.match(/\$\$\s*([\s\S]*?)\s*\$\$/);
  if (!m) throw new Error("no $$ block in " + file);
  return JSON.parse(m[1]);
}

function extractBlock(sql: string, index: number): Record<string, unknown> {
  const matches = [...sql.matchAll(/\$\$\s*([\s\S]*?)\s*\$\$/g)];
  return JSON.parse(matches[index][1]);
}

describe("migration seed configs pass their validators", () => {
  it("013 services_config", () => {
    const v = loadJson("supabase/migrations/013_services_admin_control.sql");
    expect(validateServicesConfig(v)).not.toBeNull();
  });
  it("014 orders_config", () => {
    const v = loadJson("supabase/migrations/014_orders_admin_control.sql");
    expect(validateOrdersConfig(v)).not.toBeNull();
  });
  it("015 experience_config", () => {
    const v = loadJson("supabase/migrations/015_experience_admin_control.sql");
    expect(validateExperienceConfig(v)).not.toBeNull();
  });
  it("016 gallery_config", () => {
    const sql = readFileSync("supabase/migrations/016_media_admin_control.sql", "utf8");
    expect(validateGalleryConfig(extractBlock(sql, 0))).not.toBeNull();
  });
  it("016 video_config", () => {
    const sql = readFileSync("supabase/migrations/016_media_admin_control.sql", "utf8");
    expect(validateVideoConfig(extractBlock(sql, 1))).not.toBeNull();
  });
  it("017 blog_config", () => {
    expect(validateBlogConfig(loadJson("supabase/migrations/017_blog_admin_control.sql"))).not.toBeNull();
  });
  it("018 contact_config", () => {
    expect(validateContactConfig(loadJson("supabase/migrations/018_contact_admin_control.sql"))).not.toBeNull();
  });
  it("019 links_config", () => {
    expect(validateLinksConfig(loadJson("supabase/migrations/019_links_admin_control.sql"))).not.toBeNull();
  });
  it("020 newsletter_config", () => {
    expect(validateNewsletterConfig(loadJson("supabase/migrations/020_newsletter_admin_control.sql"))).not.toBeNull();
  });
  it("021 theme_config", () => {
    expect(validateThemeConfig(loadJson("supabase/migrations/021_theme_admin_control.sql"))).not.toBeNull();
  });
  it("022 content_config", () => {
    expect(validateContentConfig(loadJson("supabase/migrations/022_content_admin_control.sql"))).not.toBeNull();
  });
  it("023 analytics_config", () => {
    expect(validateAnalyticsConfig(loadJson("supabase/migrations/023_analytics_admin_control.sql"))).not.toBeNull();
  });
  it("024 global_config", () => {
    expect(validateGlobalConfig(loadJson("supabase/migrations/024_global_admin_control.sql"))).not.toBeNull();
  });
});
