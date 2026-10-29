"use client";

import { Building2, FileCheck, Users, Send } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GovernmentDashboard() {
  const { items: approved } = useProposals({ status: "approved", sort: "recent" });
  const { items: submitted } = useProposals({ status: "submitted", sort: "recent" });
  const totalBeneficiaries = approved.reduce((s, p) => s + (p.impactAssessment?.estimatedBeneficiaries ?? 0), 0);

  return (
    <RoleDashboard role="government">
      <DashboardGrid>
        <StatCard label="Approved proposals" value={approved.length} icon={<FileCheck className="h-4 w-4" />} />
        <StatCard label="Submission packages" value={submitted.length} icon={<Send className="h-4 w-4" />} hint="Prepared" />
        <StatCard label="Est. beneficiaries" value={totalBeneficiaries.toLocaleString()} icon={<Users className="h-4 w-4" />} hint="Aggregate, demo" />
        <StatCard label="Authorities engaged" value={3} icon={<Building2 className="h-4 w-4" />} hint="Demo" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <ProposalListCard title="Awaiting submission package" proposals={approved} emptyText="No approved proposals awaiting submission." viewAllHref="/proposals?status=approved" />
        <ProposalListCard title="Submitted to authorities" proposals={submitted} emptyText="No submissions yet." viewAllHref="/proposals?status=submitted" />
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Policy review queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-xs">
              {submitted.map((p) => (
                <li key={p.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium line-clamp-1">{p.title}</p>
                    <p className="text-muted-foreground">{p.location ?? "—"}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Awaiting authority review</Badge>
                </li>
              ))}
              {submitted.length === 0 && <li className="py-6 text-center text-muted-foreground">Queue is empty.</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
