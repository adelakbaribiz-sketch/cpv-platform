"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PRIMARY_NAV } from "./nav-config";
import { useRole } from "@/contexts/role-context";
import { useLocale } from "@/contexts/locale-context";
import { ROLE_LABEL, ROLE_LIST, DEMO_DISCLAIMER, APP_NAME, APP_FULL_NAME } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { initials } from "@/lib/utils";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { relativeTime } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-background text-sm shadow-md shadow-primary/20">
        {APP_NAME[0]}
      </div>
      <div className="hidden md:flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-wide">{APP_NAME}</span>
        <span className="text-[10px] text-muted-foreground -mt-0.5">Citizens' Proposed Vote</span>
      </div>
    </Link>
  );
}

function RoleSwitcher() {
  const { role, setRole, user } = useRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs hover:bg-surface-2 transition-colors"
          aria-label="Switch demo role"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" aria-hidden />
          <span className="hidden sm:inline text-muted-foreground">DEMO</span>
          <span className="font-medium">{ROLE_LABEL[role]}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal uppercase tracking-wider">
          DEMO MODE — SIMULATED ROLE
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ROLE_LIST.map((r) => (
          <DropdownMenuItem
            key={r}
            onClick={() => setRole(r as Role)}
            className={cn("cursor-pointer", r === role && "bg-secondary")}
          >
            <span className="flex-1">{ROLE_LABEL[r as Role]}</span>
            {r === role && <span className="text-xs text-muted-foreground">●</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] text-muted-foreground leading-relaxed">
          {DEMO_DISCLAIMER}
        </div>
        <div className="px-2 pb-2 text-[10px] text-muted-foreground">
          Active demo user: <span className="font-medium text-foreground">{user.displayName}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell() {
  const items = MOCK_NOTIFICATIONS.slice(0, 5);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-sm font-semibold">Notifications</span>
          <Link href="/notifications" className="text-xs text-primary hover:underline">View all</Link>
        </div>
        <div className="max-h-80 overflow-y-auto scroll-thin">
          {items.map((n) => (
            <Link
              key={n.id}
              href={n.link ?? "#"}
              className="block px-3 py-2.5 hover:bg-surface-2 border-b border-border last:border-0"
            >
              <div className="flex items-start gap-2">
                {!n.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{relativeTime(n.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProfileMenu() {
  const { user, role } = useRole();
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-2 gap-2" aria-label="Profile menu">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/15 text-primary text-[10px] font-semibold">
              {initials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-xs font-medium">{user.displayName}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs">
          <div className="font-medium">{user.displayName}</div>
          <div className="text-muted-foreground font-normal mt-0.5">{ROLE_LABEL[role]}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings"><SettingsIcon className="mr-2 h-3.5 w-3.5" /> {t("nav.settings")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/login"><User className="mr-2 h-3.5 w-3.5" /> Sign in (demo)</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-muted-foreground text-xs">
          <ShieldAlert className="mr-2 h-3.5 w-3.5" />
          Demo session only
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SearchBox() {
  return (
    <form action="/proposals" className="relative hidden lg:block">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      <input
        type="search"
        name="q"
        placeholder="Search proposals..."
        aria-label="Search proposals"
        className="w-72 h-9 pl-8 pr-3 rounded-md bg-surface border border-border text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </form>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Primary navigation">
      {PRIMARY_NAV.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {active && <ChevronRight className="h-3 w-3 text-muted-foreground rtl:rotate-180" />}
          </Link>
        );
      })}
      <div className="mt-2 px-3 pt-3 pb-2 border-t border-border">
        <Link
          href="/proposals/new"
          onClick={onNavigate}
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-primary/10 text-primary hover:bg-primary/15 transition-colors font-medium"
        >
          <Sparkles className="h-4 w-4" />
          New Proposal
        </Link>
      </div>
    </nav>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function AppShell({ children, breadcrumb }: { children: React.ReactNode; breadcrumb?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
        <div className="flex h-14 items-center gap-2 px-3 md:px-5">
          <MobileNav />
          <Logo />
          <div className="flex-1 flex items-center justify-end gap-2">
            <SearchBox />
            <NotificationBell />
            <RoleSwitcher />
            <ProfileMenu />
          </div>
        </div>
        {breadcrumb && (
          <div className="px-3 md:px-5 pb-2 -mt-1">{breadcrumb}</div>
        )}
      </header>

      <div className="flex-1 flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-60 flex-shrink-0 border-r border-border bg-surface/40 flex-col">
          <div className="flex-1 overflow-y-auto scroll-thin">
            <SidebarContent />
          </div>
          <div className="p-3 border-t border-border text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              <span className="font-medium uppercase tracking-wider">Demo Mode</span>
            </div>
            <p className="leading-relaxed">{DEMO_DISCLAIMER}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function StickyFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40 px-4 py-4 text-[11px] text-muted-foreground">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">DEMO</Badge>
          <span>{APP_FULL_NAME} — non-official prototype. Not affiliated with any government.</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/audit" className="hover:text-foreground">Audit</Link>
          <Link href="/settings" className="hover:text-foreground">Privacy</Link>
          <span>v0.1.0-mvp</span>
        </div>
      </div>
      {children}
    </footer>
  );
}
