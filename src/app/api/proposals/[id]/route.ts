import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";
import type { ProposalStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProvider().getProposalById(id);
  if (!res.success) {
    return NextResponse.json({ error: res.error }, { status: 404 });
  }
  return NextResponse.json(res.data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Invalid JSON body" } }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  // Allow lifecycle transitions via PATCH with { status: "..." }
  if (typeof b.status === "string") {
    const res = await getProvider().transitionProposal(id, b.status as ProposalStatus, "u_demo_api", "Demo API author");
    if (!res.success) return NextResponse.json({ error: res.error }, { status: 422 });
    return NextResponse.json(res.data);
  }
  // Otherwise, treat as field update
  const res = await getProvider().updateProposal(
    id,
    {
      title: typeof b.title === "string" ? b.title : undefined,
      description: typeof b.description === "string" ? b.description : undefined,
      tags: Array.isArray(b.tags) ? (b.tags as string[]) : undefined,
      location: typeof b.location === "string" ? b.location : undefined,
      affectedCommunity: typeof b.affectedCommunity === "string" ? b.affectedCommunity : undefined,
    },
    "u_demo_api",
    "Demo API author",
  );
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data);
}
