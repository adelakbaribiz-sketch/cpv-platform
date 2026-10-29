import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getProvider().markNotificationRead(id);
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 404 });
  return NextResponse.json(res.data);
}
