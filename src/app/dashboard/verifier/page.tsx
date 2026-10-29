"use client";

import { ShieldCheck, CheckCircle2, XCircle, Clock, ListChecks } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProvider } from "@/lib/repository";
import { STATUS_LABEL } from "@/lib/constants";
import type { Proposal } from "@/lib/types";

export default function VerifierDashboard() {
  const { items: queue } = useProposals({ status: "verification", sort: "recent" });
  const { items: approved } = useProposals({ status: "approved", sort: "recent" });

  const handleVerify = async (p: Proposal, pass: boolean) => {
    const next = pass ? "public_vote" : "rejected";
    const res = await getProvider().transitionProposal(p.id, next, "u_demo_verifier", "Demo Verifier");
    if (res.success) {
      toast.success(`Proposal ${pass ? "approved → public vote" : "rejected"}`, { description: `Recorded for "${p.title.slice(0, 50)}…"` });
      // Reload page state by triggering re-fetch via window.location (simple demo)
      setTimeout(() => window.location.reload(), 600);
    } else {
      toast.error("Could not transition", { description: res.error?.message });
    }
  };

  return (
    <RoleDashboard role="verifier">
      <DashboardGrid>
        <StatCard label="Verification queue" value={queue.length} icon={<Clock className="h-4 w-4" />} hint="Awaiting review" />
        <StatCard label="Approved this period" value={approved.length} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Avg. review time" value="2.4d" icon={<ShieldCheck className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Rejection rate" value="14%" icon={<XCircle className="h-4 w-4" />} hint="Demo" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" /> Verification queue</CardTitle>
            </CardHeader>
            <CardContent>
              {queue.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">Queue is empty.</p>
              ) : (
                <ul className="space-y-3">
                  {queue.map((p) => (
                    <li key={p.id} className="p-3 rounded-md border border-border bg-surface-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{p.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px]">v{p.versionCount}</Badge>
                            <span className="text-[10px] text-muted-foreground">{p.commentCount} comments</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-shrink-0">
                          <Button size="sm" variant="outline" className="h-7 text-xs border-accent/30 text-accent hover:bg-accent/10" onClick={() => handleVerify(p, true)}>
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => handleVerify(p, false)}>
                            <XCircle className="mr-1 h-3 w-3" /> Reject
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
        <ProposalListCard title="Recently approved" proposals={approved} emptyText="No approvals yet." />
      </div>
    </RoleDashboard>
  );
}
