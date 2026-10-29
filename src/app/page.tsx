"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Vote,
  ShieldCheck,
  MessageSquare,
  Landmark,
  BarChart3,
  Lock,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import { AppShell, StickyFooter } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, APP_FULL_NAME, APP_TAGLINE, DEMO_DISCLAIMER } from "@/lib/constants";
import { MOCK_PROPOSALS } from "@/lib/mock-data";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDate } from "@/lib/utils";

const LIFECYCLE_STEPS = [
  { label: "Discover", description: "A community member identifies an issue.", icon: Globe2 },
  { label: "Propose", description: "An author drafts a proposal with optional AI assistance.", icon: Sparkles },
  { label: "Deliberate", description: "Community discussion surfaces improvements.", icon: MessageSquare },
  { label: "Verify", description: "Verifiers check procedural requirements.", icon: ShieldCheck },
  { label: "Vote", description: "Eligible participants cast a vote.", icon: Vote },
  { label: "Submit", description: "A submission package is prepared for an authority.", icon: Landmark },
];

const CAPABILITIES = [
  { title: "Structured proposals", description: "Title, description, tags, location, and impact assessment — not just free text.", icon: Sparkles },
  { title: "Transparent lifecycle", description: "Draft → AI review → community → verification → vote → submission.", icon: BarChart3 },
  { title: "Audit trail", description: "Every transition, vote, and comment is recorded. Phase 1 logs are simulated.", icon: ShieldCheck },
  { title: "Role-aware dashboards", description: "Citizens, proposers, verifiers, NGOs, auditors, admins, and more.", icon: Landmark },
  { title: "Advisory AI", description: "Deterministic mock AI suggestions — clearly labeled, never autonomous.", icon: Sparkles },
  { title: "Privacy-conscious", description: "No real identity documents stored. Demo session only — no production auth.", icon: Lock },
];

export default function Home() {
  const featured = MOCK_PROPOSALS.slice(0, 3);
  return (
    <AppShell>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-card pointer-events-none" aria-hidden />
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" aria-hidden />

          <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
            <Badge variant="outline" className="mb-5 gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
              Prototype · Demo Mode
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl leading-tight">
              Citizens propose.<br />
              Communities deliberate.<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Decisions get recorded.</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {APP_FULL_NAME} is a civic participation prototype for Europe, starting with Denmark as a research and
              product-design target. Discover community issues, draft proposals with optional AI assistance, deliberate,
              verify, vote, and prepare transparent submission packages for public authorities.
            </p>
            <p className="mt-3 text-xs text-muted-foreground max-w-2xl">
              {APP_TAGLINE}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/proposals">
                  Browse proposals
                  <ArrowRight className="ml-2 h-4 w-4 rtl:rotate-180" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/proposals/new">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Draft a proposal
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/dashboard">Open dashboard</Link>
              </Button>
            </div>

            <div className="mt-6 p-3 rounded-md border border-warning/30 bg-warning/5 max-w-2xl">
              <p className="text-xs text-amber-300/90 leading-relaxed">
                <strong className="font-semibold">Disclaimer:</strong> {DEMO_DISCLAIMER}
              </p>
            </div>
          </div>
        </section>

        {/* Lifecycle */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How a proposal moves through CPV</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                A structured lifecycle keeps proposals accountable. Each stage has explicit participants and rules — no
                proposal can skip verification to reach a vote.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LIFECYCLE_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Card key={step.label} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">0{i + 1}</span>
                      </div>
                      <CardTitle className="text-base mt-3">{step.label}</CardTitle>
                      <CardDescription className="text-xs mt-1">{step.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-b border-border bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Platform capabilities</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                A coherent civic technology surface, designed for clarity and auditability — not just dashboards.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CAPABILITIES.map((c) => {
                const Icon = c.icon;
                return (
                  <div key={c.title} className="p-4 rounded-lg border border-border bg-background hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center text-primary mb-3">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured proposals */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured proposals</h2>
                <p className="mt-2 text-sm text-muted-foreground">A snapshot of community-submitted proposals in the demo.</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/proposals">
                  All proposals
                  <ArrowRight className="ml-1 h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map((p) => (
                <Link key={p.id} href={`/proposals/${p.id}`} className="group">
                  <Card className="h-full hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <StatusBadge status={p.status} />
                        <span className="text-[10px] text-muted-foreground">{formatDate(p.createdAt)}</span>
                      </div>
                      <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {p.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 line-clamp-3">{p.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Vote className="h-3 w-3" /> {p.voteSummary.total}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {p.commentCount}</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {p.followerCount}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency */}
        <section className="border-b border-border bg-surface/30">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Transparency by design</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Every status transition, vote, comment, and verifier action is logged to an audit trail that anyone can
                inspect. Phase 1 audit logs are simulated and clearly labeled — they are not yet tamper-proof. A future
                decentralized verification layer is planned but not deployed in this prototype.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Public audit trail with actor, action, target, and timestamp",
                  "Version history for every proposal revision",
                  "Simulated vote totals with explicit demo labeling",
                  "No real identity documents stored in Phase 1",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" size="sm" className="mt-6">
                <Link href="/audit">View the audit trail</Link>
              </Button>
            </div>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-sm">Audit event (sample)</CardTitle>
                <CardDescription className="text-xs">Simulated log entry from the demo store</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-[11px] font-mono text-muted-foreground bg-surface-2 p-3 rounded-md overflow-x-auto scroll-thin">
{`{
  "id": "a_014",
  "actor": "Henrik Lind",
  "role": "verifier",
  "action": "proposal.transitioned",
  "target": "p_004",
  "metadata": { "from": "public_vote", "to": "approved" },
  "timestamp": "2026-10-07T09:00:00Z"
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        <StickyFooter />
      </div>
    </AppShell>
  );
}
