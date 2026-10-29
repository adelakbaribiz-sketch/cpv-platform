"use client";

import Link from "next/link";
import { Vote, MessageSquare, Users, Bell, BookOpen, TrendingUp } from "lucide-react";
import { RoleDashboard, StatCard, ProposalListCard, useProposals, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

export default function CitizenDashboard() {
  const { items: communityProposals, loading } = useProposals({ status: "community_review", sort: "recent" });
  const { items: votingProposals } = useProposals({ status: "public_vote", sort: "recent" });
  const followed = communityProposals.slice(0, 4);
  const voting = votingProposals.slice(0, 3);
  const recentNotifs = MOCK_NOTIFICATIONS.slice(0, 4);

  return (
    <RoleDashboard role="citizen">
      <DashboardGrid>
        <StatCard label="Followed proposals" value={followed.length} icon={<BookOpen className="h-4 w-4" />} hint="Demo data" />
        <StatCard label="Open for vote" value={voting.length} icon={<Vote className="h-4 w-4" />} hint="Cast a demo vote" />
        <StatCard label="Comments" value={12} icon={<MessageSquare className="h-4 w-4" />} hint="Demo data" />
        <StatCard label="Notifications" value={MOCK_NOTIFICATIONS.filter((n) => !n.read).length} icon={<Bell className="h-4 w-4" />} hint="Unread" />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <ProposalListCard
            title="Proposals you follow"
            proposals={followed}
            emptyText="You aren't following any proposals yet."
            viewAllHref="/proposals"
          />
          <ProposalListCard
            title="Open for voting"
            proposals={voting}
            emptyText="No proposals are open for voting right now."
            viewAllHref="/proposals?status=public_vote"
          />
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentNotifs.map((n) => (
                  <li key={n.id} className="flex items-start gap-2 text-xs">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${n.read ? "bg-muted-foreground" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{n.title}</p>
                      <p className="text-muted-foreground line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{relativeTime(n.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Button asChild variant="ghost" size="sm" className="w-full mt-3">
                <Link href="/notifications">View all</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Voting history</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Support cast</span><Badge variant="outline">8</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Oppose cast</span><Badge variant="outline">2</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Abstain</span><Badge variant="outline">1</Badge></div>
              <p className="text-[10px] text-muted-foreground italic pt-2 border-t border-border">Demo data — not real vote records.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleDashboard>
  );
}
