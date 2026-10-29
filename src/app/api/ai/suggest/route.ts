import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Invalid JSON body" } }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  if (typeof b.title !== "string" || typeof b.description !== "string") {
    return NextResponse.json({ error: { code: "validation", message: "title and description are required" } }, { status: 422 });
  }
  // Advisory only — never autonomous. No external AI API is called in Phase 1.
  const res = await getProvider().suggestProposalImprovements({
    title: b.title,
    description: b.description,
    tags: Array.isArray(b.tags) ? (b.tags as string[]) : [],
  });
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json({ suggestions: res.data, label: "DEMO — deterministic mock" });
}
