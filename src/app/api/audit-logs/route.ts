import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";
import type { AuditLog, Role } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const res = await getProvider().getAuditLogs({
    search: sp.get("q") ?? undefined,
    actorRole: (sp.get("actorRole") as Role) ?? undefined,
    targetType: (sp.get("targetType") as AuditLog["targetType"]) ?? undefined,
    page: sp.get("page") ? parseInt(sp.get("page")!, 10) : undefined,
    pageSize: sp.get("pageSize") ? parseInt(sp.get("pageSize")!, 10) : undefined,
  });
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data);
}
