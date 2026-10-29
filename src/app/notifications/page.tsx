"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox, ArrowLeft } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState, LoadingState } from "@/components/feedback/states";
import { toast } from "sonner";
import { getProvider } from "@/lib/repository";
import type { Notification } from "@/lib/types";
import { relativeTime, formatDateTime } from "@/lib/utils";

const TYPE_LABEL: Record<Notification["type"], string> = {
  proposal_update: "Proposal update",
  comment: "Comment",
  vote: "Vote",
  verification: "Verification",
  system: "System",
  mention: "Mention",
};

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await getProvider().getNotifications();
      if (!cancelled && res.success && res.data) setItems(res.data);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const markRead = async (id: string) => {
    const res = await getProvider().markNotificationRead(id);
    if (res.success && res.data) {
      setItems((arr) => arr.map((n) => n.id === id ? res.data! : n));
    }
  };
  const markAll = async () => {
    await getProvider().markAllNotificationsRead();
    setItems((arr) => arr.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const unread = items.filter((n) => !n.read).length;

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
        <PageHeader
          title="Notifications"
          description={`${items.length} notification${items.length === 1 ? "" : "s"} · ${unread} unread`}
          actions={
            <Button variant="outline" size="sm" onClick={markAll} disabled={unread === 0}>
              <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark all read
            </Button>
          }
        />
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." icon={<Inbox className="h-5 w-5" />} />
        ) : (
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {items.map((n) => (
                  <li key={n.id} className={`p-4 flex items-start gap-3 ${n.read ? "" : "bg-primary/5"}`}>
                    <div className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[n.type]}</Badge>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        <span className="text-[10px] text-muted-foreground" title={formatDateTime(n.createdAt)}>{relativeTime(n.createdAt)}</span>
                      </div>
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                      <div className="mt-2 flex items-center gap-3">
                        {n.link && <Link href={n.link} className="text-xs text-primary hover:underline">View</Link>}
                        {!n.read && (
                          <button onClick={() => markRead(n.id)} className="text-xs text-muted-foreground hover:text-foreground">
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        <div className="mt-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/"><ArrowLeft className="mr-1 h-3.5 w-3.5 rtl:rotate-180" /> Back home</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
