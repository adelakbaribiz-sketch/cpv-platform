"use client";

import { Landmark, Gavel, Vote, FileText, Scale } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/constants";

export default function GovernanceDashboard() {
  const { items: inVote } = useProposals({ status: "public_vote", sort: "votes" });
  const { items: approved } = useProposals({ status: "approved", sort: "recent" });
  const { items: inVerification } = useProposals({ status: "verification", sort: "recent" });

  return (
    <RoleDashboard role="governance_council">
      <DashboardGrid>
        <StatCard label="Governance proposals" value={inVote.length + inVerification.length} icon={<Gavel className="h-4 w-4" />} />
        <StatCard label="Active votes" value={inVote.length} icon={<Vote className="h-4 w-4" />} />
        <StatCard label="Approved this period" value={approved.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Procedural reviews" value={inVerification.length} icon={<Scale className="h-4 w-4" />} />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <ProposalListCard title="Active governance votes" proposals={inVote} emptyText="No active votes." viewAllHref="/proposals?status=public_vote" />
        <ProposalListCard title="In procedural review" proposals={inVerification} emptyText="Nothing in procedural review." viewAllHref="/proposals?status=verification" />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" /> Procedural decisions (sample)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between p-2 rounded-md bg-surface-2">
                <span>Lower verification threshold</span>
                <Badge variant="outline" className="text-[10px]">Pending</Badge>
              </li>
              <li className="flex items-center justify-between p-2 rounded-md bg-surface-2">
                <span>Allow abstain votes in council ballots</span>
                <Badge variant="outline" className="text-[10px] text-accent border-accent/30">Approved</Badge>
              </li>
              <li className="flex items-center justify-between p-2 rounded-md bg-surface-2">
                <span>Require impact assessment for &gt; €1M</span>
                <Badge variant="outline" className="text-[10px] text-accent border-accent/30">Approved</Badge>
              </li>
              <li className="flex items-center justify-between p-2 rounded-md bg-surface-2">
                <span>Public read of council minutes</span>
                <Badge variant="outline" className="text-[10px]">In discussion</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aggregate voting results</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-3 font-medium">Proposal</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium text-right">Support</th>
                  <th className="py-2 pr-3 font-medium text-right">Oppose</th>
                  <th className="py-2 pr-3 font-medium text-right">Abstain</th>
                  <th className="py-2 pr-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...inVote, ...approved].slice(0, 8).map((p) => (
                  <tr key={p.id} className="border-b border-border/50">
                    <td className="py-2 pr-3 line-clamp-1 max-w-md">{p.title}</td>
                    <td className="py-2 pr-3">{STATUS_LABEL[p.status]}</td>
                    <td className="py-2 pr-3 text-right text-accent">{p.voteSummary.support}</td>
                    <td className="py-2 pr-3 text-right text-destructive">{p.voteSummary.oppose}</td>
                    <td className="py-2 pr-3 text-right text-muted-foreground">{p.voteSummary.abstain}</td>
                    <td className="py-2 pr-3 text-right font-medium">{p.voteSummary.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
