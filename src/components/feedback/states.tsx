"use client";

import { cn } from "@/lib/utils";
import { Inbox, Loader2, AlertTriangle } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-border rounded-lg", className)}>
      <div className="h-12 w-12 rounded-full bg-surface-2 flex items-center justify-center mb-3 text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <h3 className="text-sm font-medium">{title}</h3>
      {description && <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading...", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-12 text-muted-foreground text-sm", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry, className }: { message: string; onRetry?: () => void; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-12 px-4 border border-destructive/30 bg-destructive/5 rounded-lg", className)}>
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-medium text-destructive">Something went wrong</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 text-xs text-primary hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}
