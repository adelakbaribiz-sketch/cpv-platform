"use client";

import { User, Globe, Palette, Shield, Bell, Info, AlertCircle } from "lucide-react";
import { AppShell, PageHeader } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRole } from "@/contexts/role-context";
import { useLocale } from "@/contexts/locale-context";
import { ROLE_LABEL, ROLE_LIST, LOCALE_LABEL, DEMO_DISCLAIMER } from "@/lib/constants";
import { initials } from "@/lib/utils";
import type { Locale, Role } from "@/lib/types";

export default function SettingsPage() {
  const { role, setRole, user } = useRole();
  const { locale, setLocale } = useLocale();

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
        <PageHeader
          title="Settings"
          description="Demo preferences. Demo session data is stored locally in your browser only — no account or auth in Phase 1."
        />

        <Card className="mb-4 border-warning/30 bg-warning/5">
          <CardContent className="py-3 text-xs text-amber-300/90 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>{DEMO_DISCLAIMER}</div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Profile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Demo profile</CardTitle>
              <CardDescription className="text-xs">Visible only to you in this demo session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/15 text-primary">{initials(user.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Demo role</Label>
                  <Select value={role} onValueChange={(v) => { setRole(v as Role); toast.success(`Switched to ${ROLE_LABEL[v as Role]}`); }}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLE_LIST.map((r) => (
                        <SelectItem key={r} value={r} className="text-xs">{ROLE_LABEL[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Display name (local only)</Label>
                  <input
                    type="text"
                    defaultValue={user.displayName}
                    onChange={(e) => toast.info("Display name changes are not persisted in the demo.")}
                    className="w-full h-9 px-3 rounded-md bg-surface border border-border text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Language &amp; direction</CardTitle>
              <CardDescription className="text-xs">Persian (RTL) is a future direction. Phase 1 ships English as the default.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Interface language</Label>
                <Select value={locale} onValueChange={(v) => { setLocale(v as Locale); toast.success(`Language: ${LOCALE_LABEL[v as Locale]}`); }}>
                  <SelectTrigger className="h-9 text-xs w-full sm:w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en" className="text-xs">{LOCALE_LABEL.en}</SelectItem>
                    <SelectItem value="fa" className="text-xs">{LOCALE_LABEL.fa} (partial)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Direction: <Badge variant="outline" className="text-[10px]">{locale === "fa" ? "RTL" : "LTR"}</Badge>
                {" · "}Persian translation is partial in Phase 1 — full localization is planned.
              </p>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> Theme</CardTitle>
              <CardDescription className="text-xs">Dark theme is the CPV default. Light theme is reserved for future use.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-xs">Dark theme</p>
                <p className="text-[10px] text-muted-foreground">Currently active and recommended.</p>
              </div>
              <Switch defaultChecked disabled aria-label="Dark theme (locked on for now)" />
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SettingSwitch label="Proposal updates" description="When a followed proposal changes status." defaultChecked />
              <SettingSwitch label="Comment replies" description="When someone replies to your comment." defaultChecked />
              <SettingSwitch label="Vote openings" description="When a proposal you follow opens for voting." defaultChecked />
              <SettingSwitch label="Mentions" description="When someone @-mentions you." defaultChecked />
              <SettingSwitch label="Marketing & product updates" description="Occasional platform news." />
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Privacy &amp; data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                CPV is a non-official prototype. In Phase 1, no real identity documents are stored. Demo preferences
                (role, language, demo votes) are kept in your browser's local storage only. No tracking, no analytics, no
                third-party advertising.
              </p>
              <Button variant="outline" size="sm" onClick={() => {
                try {
                  window.localStorage.removeItem("cpv:demoRole");
                  window.localStorage.removeItem("cpv:locale");
                  window.localStorage.removeItem("cpv:demoVotes");
                  window.localStorage.removeItem("cpv:demoFollows");
                  toast.success("Local demo data cleared");
                } catch {
                  toast.error("Could not clear local data");
                }
              }}>
                Clear local demo data
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> About</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1 text-muted-foreground">
              <p>CPV — Citizens' Proposed Vote · v0.1.0-mvp</p>
              <p>Civic participation prototype for Europe, starting with Denmark.</p>
              <p>Not affiliated with any government. Not legally binding.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function SettingSwitch({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} aria-label={label} />
    </div>
  );
}
