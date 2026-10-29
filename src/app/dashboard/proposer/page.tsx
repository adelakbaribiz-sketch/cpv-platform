"use client";

import Link from "next/link";
import { FileText, Sparkles, MessageSquare, TrendingUp, Plus, AlertCircle } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProposerDashboard() {
  const { items: drafts } = useProposals({ status: "draft", sort: "recent" });
  const { items: inReview } = useProposals({ status: "community_review", sort: "recent" });
  const { items: inVerification } = useProposals({ status: "verification", sort: "recent" });
  const { items: all } = useProposals({ sort: "votes", pageSize: 10 });

  const myProposals = all.slice(0, 6); // demo: assume top items are "mine"

  return (
    <RoleDashboard role="proposer">
      <DashboardGrid>
        <StatCard label="Drafts" value={drafts.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="In community review" value={inReview.length} icon={<MessageSquare className="h-4 w-4" />} />
        <StatCard label="Awaiting verification" value={inVerification.length} icon={<AlertCircle className="h-4 w-4" />} />
        <StatCard label="Total engagement" value={all.reduce((s, p) => s + p.voteSummary.total + p.commentCount, 0)} icon={<TrendingUp className="h-4 w-4" />} hint="Demo aggregate" />
      </DashboardGrid>

      <div className="flex justify-end mb-4 mt-2">
        <Button asChild><Link href="/proposals/new"><Plus className="mr-1 h-4 w-4" /> New proposal</Link></Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProposalListCard title="Your drafts" proposals={drafts} emptyText="No drafts. Start a new proposal." viewAllHref="/proposals?status=draft" />
        <ProposalListCard title="In community review" proposals={inReview} emptyText="Nothing in community review." viewAllHref="/proposals?status=community_review" />
        <ProposalListCard title="Awaiting verification" proposals={inVerification} emptyText="Nothing awaiting verification." viewAllHref="/proposals?status=verification" />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> AI usage</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Suggestions generated</span><Badge variant="outline">12</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Suggestions applied</span><Badge variant="outline">7</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Average confidence</span><Badge variant="outline">74%</Badge></div>
            <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-border">Mock AI — clearly labeled advisory. No external API.</p>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
