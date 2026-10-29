"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/feedback/states";
import { useRole } from "@/contexts/role-context";
import { DASHBOARD_NAV } from "@/components/layout/nav-config";

const ROLE_TO_HREF: Record<string, string> = Object.fromEntries(
  DASHBOARD_NAV.map((d) => [d.role, d.href]),
);

export default function DashboardRedirect() {
  const router = useRouter();
  const { role } = useRole();
  useEffect(() => {
    router.replace(ROLE_TO_HREF[role] ?? "/dashboard/citizen");
  }, [role, router]);
  return (
    <AppShell>
      <LoadingState label="Redirecting to your dashboard..." />
    </AppShell>
  );
}
