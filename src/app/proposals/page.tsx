"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Vote,
  MessageSquare,
  Users,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/data-display/status-badge";
import { EmptyState, LoadingState } from "@/components/feedback/states";
import { CATEGORY_LABEL, CATEGORY_LIST, STATUS_LABEL } from "@/lib/constants";
import type { Category, Proposal, ProposalStatus } from "@/lib/types";
import { getProvider } from "@/lib/repository";
import { relativeTime } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const STATUS_OPTIONS: (ProposalStatus | "all")[] = [
  "all", "draft", "ai_review", "community_review", "verification", "public_vote", "approved", "submitted", "rejected",
];

const PAGE_SIZE = 9;

export default function ProposalsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState<ProposalStatus | "all">((searchParams.get("status") as ProposalStatus) ?? "all");
  const [category, setCategory] = useState<Category | "all">((searchParams.get("category") as Category) ?? "all");
  const [sort, setSort] = useState<"recent" | "votes" | "created">((searchParams.get("sort") as "recent" | "votes" | "created") ?? "recent");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const res = await getProvider().listProposals({ search, status, category, sort, page, pageSize: PAGE_SIZE });
      if (cancelled) return;
      if (res.success && res.data) {
        setProposals(res.data.items);
        setTotal(res.data.total);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, status, category, sort, page]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (status !== "all") params.set("status", status);
      if (category !== "all") params.set("category", category);
      if (sort !== "recent") params.set("sort", sort);
      if (page !== 1) params.set("page", String(page));
      router.replace(`/proposals${params.toString() ? `?${params.toString()}` : ""}`);
    }, 250);
    return () => clearTimeout(t);
  }, [search, status, category, sort, page, router]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = search !== "" || status !== "all" || category !== "all" || sort !== "recent";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setSort("recent");
    router.replace("/proposals");
  };

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status !== "all") params.set("status", status);
    if (category !== "all") params.set("category", category);
    if (sort !== "recent") params.set("sort", sort);
    params.set("page", String(p));
    return `/proposals?${params.toString()}`;
  };

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="flex-1 px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto w-full">
          <PageHeader
            title="Proposals"
            description="Browse community proposals. Search, filter by status and category, sort by activity or votes."
            actions={
              <Button asChild>
                <Link href="/proposals/new"><Plus className="mr-1 h-4 w-4" /> New Proposal</Link>
              </Button>
            }
          />

          <div className="mb-6 space-y-3">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by title, description, or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10"
                  aria-label="Search proposals"
                />
              </div>
              <Select value={sort} onValueChange={(v) => setSort(v as "recent" | "votes" | "created")}>
                <SelectTrigger className="md:w-44 h-10" aria-label="Sort by">
                  <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently updated</SelectItem>
                  <SelectItem value="votes">Most votes</SelectItem>
                  <SelectItem value="created">Newest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Select value={status} onValueChange={(v) => setStatus(v as ProposalStatus | "all")}>
                <SelectTrigger className="h-8 w-40 text-xs" aria-label="Filter by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s === "all" ? "All statuses" : STATUS_LABEL[s as ProposalStatus]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={(v) => setCategory(v as Category | "all")}>
                <SelectTrigger className="h-8 w-40 text-xs" aria-label="Filter by category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All categories</SelectItem>
                  {CATEGORY_LIST.map((c) => (
                    <SelectItem key={c} value={c} className="text-xs">{CATEGORY_LABEL[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                  <X className="mr-1 h-3 w-3" /> Clear
                </Button>
              )}
              <div className="ml-auto text-xs text-muted-foreground">
                {loading ? "…" : `${total} ${total === 1 ? "proposal" : "proposals"}`}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingState label="Loading proposals..." />
          ) : proposals.length === 0 ? (
            <EmptyState
              title="No proposals found"
              description="Try adjusting your search or filters, or be the first to draft a proposal."
              action={<Button asChild><Link href="/proposals/new"><Plus className="mr-1 h-4 w-4" /> New Proposal</Link></Button>}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((p) => (
                <ProposalCard key={p.id} proposal={p} />
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href={page > 1 ? pageHref(page - 1) : "#"} aria-disabled={page <= 1} className={page <= 1 ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                  <PaginationItem className="px-3 text-xs text-muted-foreground">
                    Page {page} of {totalPages}
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href={page < totalPages ? pageHref(page + 1) : "#"} aria-disabled={page >= totalPages} className={page >= totalPages ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ProposalCard({ proposal: p }: { proposal: Proposal }) {
  return (
    <Link href={`/proposals/${p.id}`} className="group block h-full">
      <Card className="h-full hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2 gap-2">
            <StatusBadge status={p.status} />
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{relativeTime(p.updatedAt)}</span>
          </div>
          <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {p.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed">{p.description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            <Badge variant="outline" className="text-[10px]">{CATEGORY_LABEL[p.category]}</Badge>
            {p.tags.slice(0, 2).map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">#{t}</Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 mt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1" title="Total votes"><Vote className="h-3 w-3" /> {p.voteSummary.total}</span>
              <span className="flex items-center gap-1" title="Comments"><MessageSquare className="h-3 w-3" /> {p.commentCount}</span>
              <span className="flex items-center gap-1" title="Followers"><Users className="h-3 w-3" /> {p.followerCount}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity rtl:rotate-180" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
