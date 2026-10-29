"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLOR, STATUS_LABEL } from "@/lib/constants";
import type { ProposalStatus } from "@/lib/types";

export function StatusBadge({ status, className }: { status: ProposalStatus; className?: string }) {
  const variant = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];
  // Map to actual badge variants available in shadcn
  const v: "default" | "secondary" | "destructive" | "outline" =
    variant === "destructive" ? "destructive" :
    variant === "secondary" ? "secondary" :
    variant === "outline" ? "outline" :
    "default";

  if (variant === "success") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {label}
      </span>
    );
  }
  if (variant === "warning") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/20", className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        {label}
      </span>
    );
  }
  return <Badge variant={v} className={cn("gap-1.5", className)}>{label}</Badge>;
}
