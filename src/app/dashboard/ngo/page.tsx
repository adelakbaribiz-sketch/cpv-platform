"use client";

import { HeartHandshake, Megaphone, Users, TrendingUp } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LIST, CATEGORY_LABEL } from "@/lib/constants";
import type { Category } from "@/lib/types";

export default function NgoDashboard() {
  const { items: supported } = useProposals({ sort: "votes", pageSize: 20 });
  const top = supported.slice(0, 5);

  // Aggregate by category
  const byCategory = CATEGORY_LIST.map((c) => ({
    category: c,
    count: supported.filter((p) => p.category === c).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <RoleDashboard role="ngo">
      <DashboardGrid>
        <StatCard label="Supported proposals" value={top.length} icon={<HeartHandshake className="h-4 w-4" />} />
        <StatCard label="Active campaigns" value={4} icon={<Megaphone className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Members reached" value="2,140" icon={<Users className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Vote share influenced" value="38%" icon={<TrendingUp className="h-4 w-4" />} hint="Demo aggregate" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <ProposalListCard title="Proposals you support" proposals={top} emptyText="No supported proposals." viewAllHref="/proposals" />
        </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Topics you organize around</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs">
              {byCategory.map((c) => (
                <li key={c.category} className="flex items-center justify-between">
                  <span>{CATEGORY_LABEL[c.category as Category]}</span>
                  <Badge variant="secondary" className="text-[10px]">{c.count}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
