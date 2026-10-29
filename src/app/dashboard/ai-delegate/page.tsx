"use client";

import { Bot, Sparkles, FileText, AlertCircle } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProvider } from "@/lib/repository";

export default function AiDelegateDashboard() {
  const { items: drafts } = useProposals({ status: "draft" });
  const { items: aiReview } = useProposals({ status: "ai_review" });

  const handleGenerate = async () => {
    const res = await getProvider().suggestProposalImprovements({
      title: "Untitled draft",
      description: "Sample draft description for AI summary generation.",
      tags: ["sample"],
    });
    if (res.success) {
      toast.success("Generated sample suggestions", { description: `${res.data?.length ?? 0} suggestions (mock).` });
    }
  };

  return (
    <RoleDashboard role="ai_delegate">
      <Card className="mb-6 border-warning/30 bg-warning/5">
        <CardContent className="py-3 text-xs text-amber-300/90 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Advisory only.</strong> The AI delegate role previews AI-assisted
            summaries and drafts for human review. It does <strong>not</strong> cast votes, transition proposals, or
            take autonomous actions. Autonomous voting is not implemented and would require explicit governance approval.
          </div>
        </CardContent>
      </Card>

      <DashboardGrid>
        <StatCard label="Drafts needing review" value={drafts.length + aiReview.length} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Summaries generated" value="47" icon={<Sparkles className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Recommendations drafted" value="19" icon={<Bot className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Autonomous votes cast" value="0" icon={<AlertCircle className="h-4 w-4" />} hint="Forbidden by design" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /> Human review queue</CardTitle>
              <CardDescription className="text-xs">Items awaiting a human reviewer's attention.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...aiReview, ...drafts].slice(0, 5).map((p) => (
                  <li key={p.id} className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-medium line-clamp-1">{p.title}</p>
                      <p className="text-muted-foreground mt-0.5">Drafted by {p.authorName}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{p.versionCount === 1 ? "needs review" : "revised"}</Badge>
                  </li>
                ))}
                {aiReview.length + drafts.length === 0 && (
                  <li className="py-6 text-center text-muted-foreground">Queue is empty.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          <ProposalListCard title="Example AI-assisted summary" proposals={aiReview.slice(0, 3)} emptyText="No AI review items." />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Sample summary (mock)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <Badge variant="outline" className="text-[10px] mb-1">Topic</Badge>
              <p>Cyclist safety on a major Copenhagen corridor.</p>
            </div>
            <div>
              <Badge variant="outline" className="text-[10px] mb-1">Stakeholders</Badge>
              <p className="text-muted-foreground">Daily commuters (~18k), parents, school children, elderly riders.</p>
            </div>
            <div>
              <Badge variant="outline" className="text-[10px] mb-1">Suggested framing</Badge>
              <p className="text-primary">"Reduce cyclist-involved collisions by 30% within 24 months via 1.4 km of protected lane and three raised intersections."</p>
            </div>
            <Button size="sm" variant="outline" className="w-full mt-2" onClick={handleGenerate}>
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Regenerate suggestions
            </Button>
            <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-border">
              Deterministic mock — no real model call. Advisory only.
            </p>
          </CardContent>
        </Card>
      </div>
    </RoleDashboard>
  );
}
