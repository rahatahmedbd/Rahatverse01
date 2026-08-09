import { NextResponse } from "next/server";
import { getGlobalConfig } from "@/lib/global/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

/**
 * Public maintenance check endpoint used by proxy/middleware to decide
 * whether to return 503 Service Unavailable.
 * Returns { enabled, blocked, messageBn, messageEn, allowAdmins }
 */
export async function GET() {
  try {
    const globalConfig = await getGlobalConfig();
    const maintenance = globalConfig.maintenance;

    if (!maintenance.enabled) {
      return NextResponse.json({ enabled: false, blocked: false });
    }

    if (!maintenance.allowAdmins) {
      return NextResponse.json({
        enabled: true,
        blocked: true,
        allowAdmins: false,
        messageBn: maintenance.messageBn,
        messageEn: maintenance.messageEn,
      });
    }

    // allowAdmins === true — check if current user is admin
    const { isAdmin } = await getCurrentUserContext();
    if (isAdmin) {
      return NextResponse.json({ enabled: true, blocked: false, allowAdmins: true });
    }

    return NextResponse.json({
      enabled: true,
      blocked: true,
      allowAdmins: true,
      messageBn: maintenance.messageBn,
      messageEn: maintenance.messageEn,
    });
  } catch {
    return NextResponse.json({ enabled: false, blocked: false });
  }
}
