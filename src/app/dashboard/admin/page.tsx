"use client";

import { Users, ShieldCheck, AlertTriangle, Activity, Server, Cpu } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_USERS } from "@/lib/mock-data";
import { ROLE_LABEL } from "@/lib/constants";

export default function AdminDashboard() {
  const { items: drafts } = useProposals({ status: "draft" });
  const { items: flagged } = useProposals({ status: "rejected" });

  // Demo user/role breakdown
  const roleCounts = MOCK_USERS.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <RoleDashboard role="admin">
      <DashboardGrid>
        <StatCard label="Registered users" value="1,284" icon={<Users className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Active proposals" value="42" icon={<Activity className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Pending moderation" value={flagged.length} icon={<AlertTriangle className="h-4 w-4" />} />
        <StatCard label="Platform uptime" value="99.94%" icon={<Server className="h-4 w-4" />} hint="Demo" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Users by role</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs">
              {Object.entries(roleCounts).map(([r, c]) => (
                <li key={r} className="flex items-center justify-between">
                  <span>{ROLE_LABEL[r as keyof typeof ROLE_LABEL]}</span>
                  <Badge variant="secondary" className="text-[10px]">{c} (demo)</Badge>
                </li>
              ))}
              <li className="flex items-center justify-between pt-2 border-t border-border">
                <span>Total active</span>
                <Badge variant="outline" className="text-[10px]">1,284</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <ProposalListCard title="Content moderation queue" proposals={flagged} emptyText="No items needing moderation." viewAllHref="/proposals?status=rejected" />
        <ProposalListCard title="Drafts (auto-saved)" proposals={drafts} emptyText="No drafts." viewAllHref="/proposals?status=draft" />

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> Platform health</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div><div className="text-muted-foreground">API p95</div><div className="font-semibold mt-0.5">142ms</div></div>
            <div><div className="text-muted-foreground">DB connections</div><div className="font-semibold mt-0.5">8 / 20</div></div>
            <div><div className="text-muted-foreground">Error rate (24h)</div><div className="font-semibold mt-0.5">0.21%</div></div>
            <div><div className="text-muted-foreground">Last deploy</div><div className="font-semibold mt-0.5">2h ago</div></div>
            <div className="col-span-2 md:col-span-4 text-[10px] text-muted-foreground italic pt-2 border-t border-border">
              All metrics are simulated demo data — not real production telemetry.
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
