import type { Role } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  FileText,
  LayoutDashboard,
  Bell,
  ShieldCheck,
  Settings,
  Users,
  Vote,
  Building2,
  HeartHandshake,
  Bot,
  Landmark,
  UserCog,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/audit", label: "Audit Trail", icon: ShieldCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const DASHBOARD_NAV: { role: Role; href: string; label: string; icon: LucideIcon; description: string }[] = [
  { role: "citizen", href: "/dashboard/citizen", label: "Citizen", icon: Users, description: "Follow proposals, vote, and stay informed." },
  { role: "proposer", href: "/dashboard/proposer", label: "Proposer", icon: FileText, description: "Author and shepherd proposals." },
  { role: "verifier", href: "/dashboard/verifier", label: "Verifier", icon: ShieldCheck, description: "Verify eligibility and procedures." },
  { role: "government", href: "/dashboard/government", label: "Government", icon: Building2, description: "Observe approved proposals and submissions." },
  { role: "ngo", href: "/dashboard/ngo", label: "NGO", icon: HeartHandshake, description: "Amplify community topics." },
  { role: "auditor", href: "/dashboard/auditor", label: "Auditor", icon: UserCog, description: "Inspect the audit trail." },
  { role: "admin", href: "/dashboard/admin", label: "Admin", icon: Vote, description: "Moderate and configure the platform." },
  { role: "ai_delegate", href: "/dashboard/ai-delegate", label: "AI Delegate", icon: Bot, description: "Advisory AI summaries (simulated)." },
  { role: "governance_council", href: "/dashboard/governance", label: "Governance Council", icon: Landmark, description: "Governance and procedural decisions." },
];
