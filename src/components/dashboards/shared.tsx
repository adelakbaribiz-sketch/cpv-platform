"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Vote,
  MessageSquare,
  Users,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/data-display/status-badge";
import { LoadingState } from "@/components/feedback/states";
import { ROLE_LABEL, ROLE_DESCRIPTION, CATEGORY_LABEL } from "@/lib/constants";
import type { Proposal, ProposalFilters, Role } from "@/lib/types";
import { getProvider } from "@/lib/repository";
import { useRole } from "@/contexts/role-context";
import { relativeTime } from "@/lib/utils";
import { ROLE_LABEL as R_LBL } from "@/lib/constants";

// Generic dashboard shell that takes a role and renders relevant sections
export function RoleDashboard({
  role,
  sections,
  children,
}: {
  role: Role;
  sections?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { user } = useRole();
  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <PageHeader
          title={`${ROLE_LABEL[role]} dashboard`}
          description={ROLE_DESCRIPTION[role]}
          actions={
            <Badge variant="outline" className="gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
              Demo · {user.displayName}
            </Badge>
          }
        />
        {sections ?? children}
      </div>
    </AppShell>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  delta?: { value: string; positive: boolean };
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {delta && (
              <p className={`text-[10px] mt-1 flex items-center gap-0.5 ${delta.positive ? "text-accent" : "text-destructive"}`}>
                <ArrowUpRight className={`h-3 w-3 ${!delta.positive && "rotate-90"}`} />
                {delta.value}
              </p>
            )}
            {hint && <p className="text-[10px] text-muted-foreground mt-1">{hint}</p>}
          </div>
          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProposalListCard({
  title,
  proposals,
  emptyText = "No proposals to show.",
  viewAllHref,
}: {
  title: string;
  proposals: Proposal[];
  emptyText?: string;
  viewAllHref?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          {viewAllHref && (
            <Button asChild variant="ghost" size="sm">
              <Link href={viewAllHref}>View all<ChevronRight className="ml-1 h-3 w-3 rtl:rotate-180" /></Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">{emptyText}</p>
        ) : (
          <ul className="divide-y divide-border">
            {proposals.map((p) => (
              <li key={p.id} className="py-2.5 first:pt-0 last:pb-0">
                <Link href={`/proposals/${p.id}`} className="block group">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <StatusBadge status={p.status} />
                    <span className="text-[10px] text-muted-foreground">{relativeTime(p.updatedAt)}</span>
                  </div>
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">{p.title}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">{CATEGORY_LABEL[p.category]}</Badge>
                    <span className="flex items-center gap-0.5"><Vote className="h-3 w-3" />{p.voteSummary.total}</span>
                    <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{p.commentCount}</span>
                    <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{p.followerCount}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function useProposals(filters: ProposalFilters) {
  const [items, setItems] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getProvider().listProposals({ ...filters, pageSize: 50 });
      if (!cancelled && res.success && res.data) setItems(res.data.items);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [JSON.stringify(filters)]);
  return { items, loading };
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>;
}
