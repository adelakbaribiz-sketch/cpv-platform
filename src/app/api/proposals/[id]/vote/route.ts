import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";
import type { VoteType } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Invalid JSON body" } }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  if (b.voteType !== "support" && b.voteType !== "oppose" && b.voteType !== "abstain") {
    return NextResponse.json({ error: { code: "validation", message: "voteType must be support | oppose | abstain", field: "voteType" } }, { status: 422 });
  }
  const res = await getProvider().castDemoVote(id, b.voteType as VoteType, "u_demo_api", "Demo API voter");
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data);
}
