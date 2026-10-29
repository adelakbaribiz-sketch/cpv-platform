"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Search, AlertCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LoadingState, EmptyState } from "@/components/feedback/states";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ROLE_LABEL, ROLE_LIST } from "@/lib/constants";
import { getProvider } from "@/lib/repository";
import type { AuditLog, Role } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const TARGET_TYPES = ["all", "proposal", "comment", "vote", "notification", "user", "system"] as const;
const PAGE_SIZE = 20;

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actorRole, setActorRole] = useState<Role | "all">("all");
  const [targetType, setTargetType] = useState<(typeof TARGET_TYPES)[number]>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getProvider().getAuditLogs({ search, actorRole, targetType, page, pageSize: PAGE_SIZE });
      if (!cancelled && res.success && res.data) {
        setLogs(res.data.items);
        setTotal(res.data.total);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, actorRole, targetType, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-6xl mx-auto">
        <PageHeader
          title="Audit trail"
          description="Every status transition, vote, comment, and verifier action is recorded. Phase 1 logs are simulated — not tamper-proof."
          actions={<Badge variant="outline" className="gap-1.5"><AlertCircle className="h-3 w-3 text-warning" /> Simulated</Badge>}
        />

        <Card className="mb-4 border-warning/30 bg-warning/5">
          <CardContent className="py-3 text-xs text-amber-300/90 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Phase 1 audit logs are simulated.</strong> They are stored in memory and are not tamper-proof.
              A future decentralized verification layer is planned but not deployed in this prototype.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Audit events</CardTitle>
              <CardDescription className="text-xs">{total} event{total === 1 ? "" : "s"} · page {page} of {totalPages}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="relative flex-1 min-w-44">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search actions, actors, targets..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-8 h-8 text-xs" />
              </div>
              <Select value={actorRole} onValueChange={(v) => { setActorRole(v as Role | "all"); setPage(1); }}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All roles</SelectItem>
                  {ROLE_LIST.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">{ROLE_LABEL[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={targetType} onValueChange={(v) => { setTargetType(v as typeof TARGET_TYPES[number]); setPage(1); }}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TARGET_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs capitalize">{t === "all" ? "All targets" : t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingState />
            ) : logs.length === 0 ? (
              <EmptyState title="No matching events" description="Try adjusting filters." />
            ) : (
              <div className="max-h-[600px] overflow-y-auto scroll-thin">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card">
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="py-2 pr-3 font-medium">Timestamp</th>
                      <th className="py-2 pr-3 font-medium">Actor</th>
                      <th className="py-2 pr-3 font-medium">Role</th>
                      <th className="py-2 pr-3 font-medium">Action</th>
                      <th className="py-2 pr-3 font-medium">Target</th>
                      <th className="py-2 pr-3 font-medium">Metadata</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((l) => (
                      <tr key={l.id} className="border-b border-border/50 hover:bg-surface-2">
                        <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{formatDateTime(l.timestamp)}</td>
                        <td className="py-2 pr-3">{l.actorName}</td>
                        <td className="py-2 pr-3"><Badge variant="outline" className="text-[10px]">{ROLE_LABEL[l.actorRole]}</Badge></td>
                        <td className="py-2 pr-3 font-mono text-[11px]">{l.action}</td>
                        <td className="py-2 pr-3 font-mono text-[11px] text-muted-foreground">{l.targetType}:{l.targetId}</td>
                        <td className="py-2 pr-3 font-mono text-[10px] text-muted-foreground max-w-xs truncate">{l.metadata ? JSON.stringify(l.metadata) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} aria-disabled={page <= 1} className={page <= 1 ? "pointer-events-none opacity-50" : ""} />
                    </PaginationItem>
                    <PaginationItem className="px-3 text-xs text-muted-foreground">Page {page} of {totalPages}</PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} aria-disabled={page >= totalPages} className={page >= totalPages ? "pointer-events-none opacity-50" : ""} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
