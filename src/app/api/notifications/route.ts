import { NextResponse } from "next/server";
import { getProvider } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const res = await getProvider().getNotifications();
  if (!res.success) return NextResponse.json({ error: res.error }, { status: 400 });
  return NextResponse.json(res.data);
}
