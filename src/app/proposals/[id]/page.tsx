"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Vote,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
  Tag,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Minus,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Bot,
  Send,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/states";
import { toast } from "sonner";
import { useRole } from "@/contexts/role-context";
import {
  CATEGORY_LABEL,
  ROLE_LABEL,
  STATUS_DESCRIPTION,
  STATUS_LABEL,
  STATUS_ORDER,
  DEMO_DISCLAIMER,
} from "@/lib/constants";
import { canTransition, nextStatuses } from "@/lib/lifecycle";
import type {
  AiSuggestion,
  AuditLog,
  Comment,
  ImpactAssessment,
  Proposal,
  ProposalLifecycleEvent,
  ProposalStatus,
  ProposalVersion,
  VoteType,
} from "@/lib/types";
import { getProvider } from "@/lib/repository";
import { formatDateTime, formatDate, initials, relativeTime, safeLocalGet, safeLocalSet } from "@/lib/utils";
import { ROLE_LABEL as ROLE_LBL } from "@/lib/constants";

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { role, user } = useRole();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<ProposalVersion[]>([]);
  const [lifecycle, setLifecycle] = useState<ProposalLifecycleEvent[]>([]);
  const [related, setRelated] = useState<Proposal[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState<VoteType | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [pRes, cRes, vRes, lRes, rRes] = await Promise.all([
        getProvider().getProposalById(id),
        getProvider().getComments(id),
        getProvider().getProposalVersions(id),
        getProvider().getLifecycleEvents(id),
        getProvider().getRelatedProposals(id),
      ]);
      if (cancelled) return;
      if (!pRes.success || !pRes.data) {
        setError(pRes.error?.message ?? "Proposal not found");
        setLoading(false);
        return;
      }
      setProposal(pRes.data);
      setAiSuggestions(pRes.data.aiSuggestions ?? []);
      setComments(cRes.success && cRes.data ? cRes.data : []);
      setVersions(vRes.success && vRes.data ? vRes.data : []);
      setLifecycle(lRes.success && lRes.data ? lRes.data : []);
      setRelated(rRes.success && rRes.data ? rRes.data : []);
      // Check demo vote state from localStorage
      try {
        const voted = JSON.parse(safeLocalGet("cpv:demoVotes") ?? "{}");
        setHasVoted(!!voted[id]);
      } catch {
        setHasVoted(false);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleVote = async (voteType: VoteType) => {
    if (!proposal) return;
    if (proposal.status !== "public_vote") {
      toast.error("Voting is not open for this proposal.", { description: `Current status: ${STATUS_LABEL[proposal.status]}` });
      return;
    }
    if (hasVoted) {
      toast.error("You have already cast a demo vote on this proposal.");
      return;
    }
    setVoting(voteType);
    const res = await getProvider().castDemoVote(proposal.id, voteType, user.id, user.displayName);
    if (res.success && res.data) {
      setProposal(res.data);
      setHasVoted(true);
      try {
        const voted = JSON.parse(safeLocalGet("cpv:demoVotes") ?? "{}");
        voted[id] = voteType;
        safeLocalSet("cpv:demoVotes", JSON.stringify(voted));
      } catch {
        // ignore
      }
      toast.success(`Demo vote recorded: ${voteType}`, { description: DEMO_DISCLAIMER });
    } else {
      toast.error("Could not record vote.", { description: res.error?.message });
    }
    setVoting(null);
  };

  const handleTransition = async (next: ProposalStatus) => {
    if (!proposal) return;
    const res = await getProvider().transitionProposal(proposal.id, next, user.id, user.displayName);
    if (res.success && res.data) {
      setProposal(res.data);
      const updatedLifecycle = await getProvider().getLifecycleEvents(id);
      if (updatedLifecycle.success && updatedLifecycle.data) setLifecycle(updatedLifecycle.data);
      toast.success(`Status changed to ${STATUS_LABEL[next]}`, { description: "Demo transition recorded in audit trail." });
    } else {
      toast.error("Transition not allowed", { description: res.error?.message });
    }
  };

  const handleComment = async () => {
    if (!proposal || !newComment.trim()) return;
    setSubmittingComment(true);
    const res = await getProvider().addComment(
      { proposalId: proposal.id, content: newComment.trim() },
      user.id,
      user.displayName,
      role,
    );
    if (res.success && res.data) {
      setComments((c) => [...c, res.data!]);
      setNewComment("");
      toast.success("Comment posted", { description: "Recorded in the audit trail." });
    } else {
      toast.error("Could not post comment", { description: res.error?.message });
    }
    setSubmittingComment(false);
  };

  const handleGetAiSuggestions = async () => {
    if (!proposal) return;
    const res = await getProvider().suggestProposalImprovements({
      title: proposal.title,
      description: proposal.description,
      tags: proposal.tags,
    });
    if (res.success && res.data) {
      setAiSuggestions(res.data);
      toast.success("AI suggestions generated", { description: "Deterministic mock — clearly labeled advisory." });
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="px-4 md:px-8 py-6"><LoadingState label="Loading proposal..." /></div>
      </AppShell>
    );
  }
  if (error || !proposal) {
    return (
      <AppShell>
        <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
          <ErrorState message={error ?? "Proposal not found."} onRetry={() => router.push("/proposals")} />
          <div className="text-center mt-4">
            <Button asChild variant="ghost"><Link href="/proposals"><ArrowLeft className="mr-1 h-4 w-4" /> Back to proposals</Link></Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const allowedTransitions = nextStatuses(proposal.status);
  const impact = proposal.impactAssessment;
  const totalVotes = proposal.voteSummary.total;
  const supportPct = totalVotes > 0 ? Math.round((proposal.voteSummary.support / totalVotes) * 100) : 0;
  const opposePct = totalVotes > 0 ? Math.round((proposal.voteSummary.oppose / totalVotes) * 100) : 0;
  const abstainPct = totalVotes > 0 ? Math.round((proposal.voteSummary.abstain / totalVotes) * 100) : 0;

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
          <Link href="/proposals" className="hover:text-foreground">Proposals</Link>
          <ChevronRight className="h-3 w-3 rtl:rotate-180" />
          <span className="text-foreground truncate max-w-xs">{proposal.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <StatusBadge status={proposal.status} />
                <Badge variant="outline" className="text-xs">{CATEGORY_LABEL[proposal.category]}</Badge>
                {proposal.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">#{t}</Badge>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">{proposal.title}</h1>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed whitespace-pre-line">{proposal.description}</p>
            </div>

            {/* Lifecycle stepper */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Lifecycle</CardTitle>
                <CardDescription className="text-xs">{STATUS_DESCRIPTION[proposal.status]}</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="flex flex-wrap gap-2 items-center">
                  {STATUS_ORDER.map((s, i) => {
                    const active = proposal.status === s;
                    const passed = STATUS_ORDER.indexOf(proposal.status) > i;
                    return (
                      <li key={s} className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs ${
                            active ? "bg-primary/15 text-primary border border-primary/30" :
                            passed ? "bg-accent/10 text-accent" : "text-muted-foreground bg-surface-2"
                          }`}
                        >
                          {passed && <CheckCircle2 className="h-3 w-3" />}
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                          {STATUS_LABEL[s]}
                        </div>
                        {i < STATUS_ORDER.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground rtl:rotate-180" />}
                      </li>
                    );
                  })}
                </ol>
                {allowedTransitions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Available transitions (demo)</div>
                    <div className="flex flex-wrap gap-2">
                      {allowedTransitions.map((s) => (
                        <Button key={s} size="sm" variant="outline" onClick={() => handleTransition(s)}>
                          Move to {STATUS_LABEL[s]}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {lifecycle.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Recent events</div>
                    <ul className="space-y-1.5 text-xs">
                      {lifecycle.slice(0, 5).map((e) => (
                        <li key={e.id} className="flex items-start gap-2">
                          <span className="text-muted-foreground font-mono">{relativeTime(e.occurredAt)}</span>
                          <span className="text-foreground">{e.actorName}</span>
                          <span className="text-muted-foreground">moved</span>
                          <span className="text-muted-foreground">{e.fromStatus ? STATUS_LABEL[e.fromStatus] : "—"}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground">{STATUS_LABEL[e.toStatus]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="discussion">
              <TabsList>
                <TabsTrigger value="discussion" className="text-xs"><MessageSquare className="mr-1 h-3 w-3" /> Discussion ({comments.length})</TabsTrigger>
                <TabsTrigger value="versions" className="text-xs"><History className="mr-1 h-3 w-3" /> Versions ({versions.length})</TabsTrigger>
                <TabsTrigger value="ai" className="text-xs"><Sparkles className="mr-1 h-3 w-3" /> AI Suggestions</TabsTrigger>
                <TabsTrigger value="related" className="text-xs">Related</TabsTrigger>
              </TabsList>

              <TabsContent value="discussion" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Add a comment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Share a constructive comment, question, or concern..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      aria-label="New comment"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Posting as <span className="text-foreground font-medium">{user.displayName}</span> ({ROLE_LBL[role]}) · Demo</span>
                      <Button size="sm" onClick={handleComment} disabled={!newComment.trim() || submittingComment}>
                        <Send className="mr-1 h-3.5 w-3.5" />
                        {submittingComment ? "Posting..." : "Post comment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-4 space-y-3">
                  {comments.length === 0 ? (
                    <EmptyState title="No comments yet" description="Be the first to start the discussion." />
                  ) : (
                    comments.map((c) => (
                      <CommentItem key={c.id} comment={c} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="versions" className="mt-4">
                {versions.length === 0 ? (
                  <EmptyState title="No version history" description="Revisions will appear here when the proposal is updated." />
                ) : (
                  <ol className="space-y-3">
                    {versions.map((v) => (
                      <Card key={v.id}>
                        <CardContent className="py-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold">Version {v.versionNumber}</span>
                            <span className="text-[10px] text-muted-foreground">{formatDateTime(v.editedAt)}</span>
                          </div>
                          <p className="text-sm font-medium">{v.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{v.description}</p>
                          {v.changeSummary && (
                            <p className="text-[11px] text-primary mt-2">↳ {v.changeSummary}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </ol>
                )}
              </TabsContent>

              <TabsContent value="ai" className="mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Bot className="h-4 w-4 text-primary" /> CPV Assistant (mock)
                        </CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Deterministic suggestions, clearly labeled advisory. Never an autonomous action.
                        </CardDescription>
                      </div>
                      <Button size="sm" variant="outline" onClick={handleGetAiSuggestions}>
                        <Sparkles className="mr-1 h-3.5 w-3.5" /> Generate
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {aiSuggestions.length === 0 ? (
                      <EmptyState title="No suggestions yet" description="Click Generate to produce deterministic, mock AI suggestions." />
                    ) : (
                      <ul className="space-y-3">
                        {aiSuggestions.map((s) => (
                          <li key={s.id} className="p-3 rounded-md border border-border bg-surface-2">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="text-[10px]">{s.field}</Badge>
                              <span className="text-[10px] text-muted-foreground">confidence {s.confidence}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">Original:</p>
                            <p className="text-xs mb-2 line-clamp-2">{s.originalText || <span className="italic text-muted-foreground">—</span>}</p>
                            <p className="text-xs text-muted-foreground mb-1">Suggested:</p>
                            <p className="text-xs mb-2 text-primary">{s.suggestedText}</p>
                            <p className="text-[11px] text-muted-foreground italic">↳ {s.rationale}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="related" className="mt-4">
                {related.length === 0 ? (
                  <EmptyState title="No related proposals" description="Related proposals will be linked here when they exist." />
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {related.map((r) => (
                      <Link key={r.id} href={`/proposals/${r.id}`}>
                        <Card className="hover:border-primary/40 transition-colors h-full">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between mb-1">
                              <StatusBadge status={r.status} />
                              <span className="text-[10px] text-muted-foreground">{relativeTime(r.updatedAt)}</span>
                            </div>
                            <CardTitle className="text-sm leading-snug line-clamp-2">{r.title}</CardTitle>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Side column */}
          <div className="space-y-4">
            {/* Vote card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2"><Vote className="h-4 w-4 text-primary" /> Vote</CardTitle>
                <CardDescription className="text-xs">
                  {proposal.status === "public_vote"
                    ? "Voting is open. Cast a demo vote — clearly not binding."
                    : `Voting opens when status is "Public Vote". Current: ${STATUS_LABEL[proposal.status]}.`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <VoteBar label="Support" value={proposal.voteSummary.support} pct={supportPct} color="bg-accent" />
                  <VoteBar label="Oppose" value={proposal.voteSummary.oppose} pct={opposePct} color="bg-destructive" />
                  <VoteBar label="Abstain" value={proposal.voteSummary.abstain} pct={abstainPct} color="bg-muted-foreground" />
                </div>
                <div className="text-[10px] text-muted-foreground text-center pt-1">
                  {totalVotes} demo vote{totalVotes === 1 ? "" : "s"} recorded
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote("support")}
                    disabled={proposal.status !== "public_vote" || hasVoted || voting !== null}
                    className="border-accent/30 text-accent hover:bg-accent/10"
                  >
                    <ThumbsUp className="mr-1 h-3 w-3" /> Support
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote("oppose")}
                    disabled={proposal.status !== "public_vote" || hasVoted || voting !== null}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    <ThumbsDown className="mr-1 h-3 w-3" /> Oppose
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote("abstain")}
                    disabled={proposal.status !== "public_vote" || hasVoted || voting !== null}
                  >
                    <Minus className="mr-1 h-3 w-3" /> Abstain
                  </Button>
                </div>
                {hasVoted && (
                  <p className="text-[10px] text-accent text-center pt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> You have cast a demo vote
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                  Demo votes are simulated. Not a secure or legally binding vote.
                </p>
              </CardContent>
            </Card>

            {/* Meta */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">About this proposal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs">
                <MetaRow icon={<Users className="h-3.5 w-3.5" />} label="Author">
                  <span>{proposal.authorName}</span>
                  <Badge variant="outline" className="text-[10px]">{ROLE_LABEL[proposal.authorRole]}</Badge>
                </MetaRow>
                <MetaRow icon={<Calendar className="h-3.5 w-3.5" />} label="Created">{formatDate(proposal.createdAt)}</MetaRow>
                <MetaRow icon={<Calendar className="h-3.5 w-3.5" />} label="Updated">{formatDate(proposal.updatedAt)}</MetaRow>
                {proposal.location && <MetaRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location">{proposal.location}</MetaRow>}
                {proposal.affectedCommunity && <MetaRow icon={<Users className="h-3.5 w-3.5" />} label="Affects">{proposal.affectedCommunity}</MetaRow>}
                <MetaRow icon={<MessageSquare className="h-3.5 w-3.5" />} label="Comments">{proposal.commentCount}</MetaRow>
                <MetaRow icon={<Users className="h-3.5 w-3.5" />} label="Followers">{proposal.followerCount}</MetaRow>
                <MetaRow icon={<History className="h-3.5 w-3.5" />} label="Versions">{proposal.versionCount}</MetaRow>
              </CardContent>
            </Card>

            {/* Impact assessment */}
            {impact && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4 text-warning" /> Impact assessment</CardTitle>
                  <CardDescription className="text-xs">Simulated — illustrative only.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <MetaRow label="Beneficiaries">{impact.estimatedBeneficiaries.toLocaleString()}</MetaRow>
                  <MetaRow label="Est. cost">{impact.estimatedCost}</MetaRow>
                  <MetaRow label="Duration">{impact.estimatedDurationMonths} months</MetaRow>
                  <MetaRow label="Risk level">
                    <Badge variant={impact.riskLevel === "high" ? "destructive" : impact.riskLevel === "medium" ? "outline" : "secondary"} className="text-[10px]">
                      {impact.riskLevel}
                    </Badge>
                  </MetaRow>
                  <div className="pt-2 space-y-2">
                    <ScoreBar label="Sustainability" value={impact.sustainabilityScore} />
                    <ScoreBar label="Equity" value={impact.equityScore} />
                  </div>
                  <p className="text-[11px] text-muted-foreground italic pt-1">{impact.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Audit excerpt */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Audit excerpt</CardTitle>
                <CardDescription className="text-xs">Phase 1 logs are simulated.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-[10px] text-muted-foreground text-center py-3">
                  See the full audit trail at{" "}
                  <Link href="/audit" className="text-primary hover:underline">/audit</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 flex-shrink-0">
        <AvatarFallback className="bg-primary/15 text-primary text-[10px]">{initials(comment.authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{comment.authorName}</span>
          <Badge variant="outline" className="text-[10px]">{ROLE_LABEL[comment.authorRole]}</Badge>
          <span className="text-[10px] text-muted-foreground">{relativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

function VoteBar({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} · {pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div
          className={`h-full ${value >= 80 ? "bg-accent" : value >= 60 ? "bg-warning" : "bg-destructive"} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MetaRow({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="flex items-center gap-1.5 text-right">{children}</span>
    </div>
  );
}
