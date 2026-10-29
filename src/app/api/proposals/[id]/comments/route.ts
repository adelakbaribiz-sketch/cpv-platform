import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProvider().getComments(id);
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "invalid_json", message: "Invalid JSON body" } }, { status: 400 });
  }
  const b = body as Record<string, unknown>;
  if (typeof b.content !== "string" || b.content.trim().length === 0) {
    return NextResponse.json({ error: { code: "validation", message: "content is required", field: "content" } }, { status: 422 });
  }
  const res = await getProvider().addComment(
    { proposalId: id, content: b.content as string, parentId: typeof b.parentId === "string" ? b.parentId : undefined },
    "u_demo_api",
    "Demo API commenter",
    "citizen",
  );
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data, { status: 201 });
}
