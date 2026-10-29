"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Activity, AlertTriangle, FileSearch } from "lucide-react";
import { RoleDashboard, StatCard, DashboardGrid } from "@/components/dashboards/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_LABEL, ROLE_LIST } from "@/lib/constants";
import { getProvider } from "@/lib/repository";
import type { AuditLog, Role } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function AuditorDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [actorRole, setActorRole] = useState<Role | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getProvider().getAuditLogs({ search, actorRole, pageSize: 25 });
      if (!cancelled && res.success && res.data) setLogs(res.data.items);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, actorRole]);

  return (
    <RoleDashboard role="auditor">
      <DashboardGrid>
        <StatCard label="Audit events (24h)" value={logs.length} icon={<Activity className="h-4 w-4" />} hint="Demo" />
        <StatCard label="Active actors" value={new Set(logs.map((l) => l.actorId)).size} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Integrity flags" value={0} icon={<AlertTriangle className="h-4 w-4" />} hint="No anomalies detected" />
        <StatCard label="Tamper-proof?" value="No" icon={<FileSearch className="h-4 w-4" />} hint="Phase 1 logs are simulated" />
      </DashboardGrid>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle className="text-sm">Audit log</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 w-44 text-xs" />
              <Select value={actorRole} onValueChange={(v) => setActorRole(v as Role | "all")}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">All roles</SelectItem>
                  {ROLE_LIST.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">{ROLE_LABEL[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[480px] overflow-y-auto scroll-thin">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-2 pr-3 font-medium">When</th>
                  <th className="py-2 pr-3 font-medium">Actor</th>
                  <th className="py-2 pr-3 font-medium">Role</th>
                  <th className="py-2 pr-3 font-medium">Action</th>
                  <th className="py-2 pr-3 font-medium">Target</th>
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
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No matching events.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </RoleDashboard>
  );
}
