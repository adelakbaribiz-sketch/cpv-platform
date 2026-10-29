import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";
import type { Category, ProposalStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const res = await getProvider().listProposals({
    search: sp.get("q") ?? undefined,
    status: (sp.get("status") as ProposalStatus) ?? undefined,
    category: (sp.get("category") as Category) ?? undefined,
    sort: (sp.get("sort") as "recent" | "votes" | "created") ?? undefined,
    page: sp.get("page") ? parseInt(sp.get("page")!, 10) : undefined,
    pageSize: sp.get("pageSize") ? parseInt(sp.get("pageSize")!, 10) : undefined,
  });
  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }
  return NextResponse.json(res.data);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Invalid JSON body" } }, { status: 400 });
  }
  // Minimal server-side validation
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string" || b.title.trim().length < 10) {
    return NextResponse.json({ error: { code: "validation", message: "title must be at least 10 characters", field: "title" } }, { status: 422 });
  }
  if (typeof b.description !== "string" || b.description.trim().length < 50) {
    return NextResponse.json({ error: { code: "validation", message: "description must be at least 50 characters", field: "description" } }, { status: 422 });
  }
  // Demo: server treats author as the demo user. Real auth would replace this.
  const res = await getProvider().createProposal(
    {
      title: b.title as string,
      description: b.description as string,
      category: b.category as Category,
      tags: Array.isArray(b.tags) ? (b.tags as string[]) : [],
      location: typeof b.location === "string" ? b.location : undefined,
      affectedCommunity: typeof b.affectedCommunity === "string" ? b.affectedCommunity : undefined,
    },
    "u_demo_api",
    "Demo API author",
    "proposer",
  );
  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 400 });
  }
  return NextResponse.json(res.data, { status: 201 });
}
