import type { Category, ProposalStatus, Role, Locale } from "./types";

// App metadata
export const APP_NAME = "CPV";
export const APP_FULL_NAME = "Citizens' Proposed Vote";
export const APP_TAGLINE = "Civic participation. Deliberation. Transparent governance.";
export const APP_VERSION = "0.1.0-mvp";
export const DEMO_DISCLAIMER =
  "DEMO MODE — This is a non-official prototype. Roles, votes, and metrics are simulated and not legally binding.";

// Lifecycle transitions — explicit, testable rules.
export const LIFECYCLE_TRANSITIONS: Record<ProposalStatus, ProposalStatus[]> = {
  draft: ["ai_review", "community_review"],
  ai_review: ["community_review", "draft", "rejected"],
  community_review: ["verification", "draft", "rejected"],
  verification: ["public_vote", "community_review", "rejected"],
  public_vote: ["approved", "rejected"],
  approved: ["submitted"],
  submitted: [],
  rejected: ["draft"],
};

export const STATUS_ORDER: ProposalStatus[] = [
  "draft",
  "ai_review",
  "community_review",
  "verification",
  "public_vote",
  "approved",
  "submitted",
];

export const STATUS_LABEL: Record<ProposalStatus, string> = {
  draft: "Draft",
  ai_review: "AI Review",
  community_review: "Community Review",
  verification: "Verification",
  public_vote: "Public Vote",
  approved: "Approved",
  submitted: "Submitted",
  rejected: "Rejected",
};

export const STATUS_DESCRIPTION: Record<ProposalStatus, string> = {
  draft: "Author is still shaping the proposal. Not yet open to the community.",
  ai_review: "AI assistant is generating clarity, structure, and impact suggestions.",
  community_review: "Open for community discussion, comments, and early feedback.",
  verification: "Eligibility and procedural requirements are being checked by verifiers.",
  public_vote: "Open for eligible participants to cast a vote.",
  approved: "Proposal has cleared voting and procedural gates.",
  submitted: "Submission package has been prepared for a public authority.",
  rejected: "Proposal was not advanced. Author may revise and resubmit.",
};

export const STATUS_COLOR: Record<
  ProposalStatus,
  "default" | "secondary" | "destructive" | "outline" | "warning" | "success"
> = {
  draft: "secondary",
  ai_review: "outline",
  community_review: "default",
  verification: "warning",
  public_vote: "default",
  approved: "success",
  submitted: "success",
  rejected: "destructive",
};

export const CATEGORY_LABEL: Record<Category, string> = {
  transportation: "Transportation",
  housing: "Housing",
  environment: "Environment",
  accessibility: "Accessibility",
  education: "Education",
  public_services: "Public Services",
  infrastructure: "Infrastructure",
  culture: "Culture & Arts",
};

export const CATEGORY_LIST: Category[] = [
  "transportation",
  "housing",
  "environment",
  "accessibility",
  "education",
  "public_services",
  "infrastructure",
  "culture",
];

export const ROLE_LABEL: Record<Role, string> = {
  citizen: "Citizen",
  proposer: "Proposer",
  verifier: "Verifier",
  government: "Government Observer",
  ngo: "NGO / Civic Org",
  auditor: "Auditor",
  admin: "Platform Admin",
  ai_delegate: "AI Delegate",
  governance_council: "Governance Council",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  citizen: "Follow proposals, comment, and vote in the public review stage.",
  proposer: "Author proposals, refine with AI assistance, and shepherd them through review.",
  verifier: "Verify eligibility and procedural completeness before a proposal enters voting.",
  government: "Observe approved proposals and track submission packages to authorities.",
  ngo: "Amplify community topics and organize civic engagement.",
  auditor: "Inspect the audit trail and integrity indicators (simulated).",
  admin: "Oversee users, content moderation, and platform configuration.",
  ai_delegate: "Preview AI-assisted summaries and human-review queues (advisory only).",
  governance_council: "Oversee governance proposals and procedural decisions.",
};

export const ROLE_LIST: Role[] = [
  "citizen",
  "proposer",
  "verifier",
  "government",
  "ngo",
  "auditor",
  "admin",
  "ai_delegate",
  "governance_council",
];

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
};

// Localized strings (minimal Phase 1 — full dictionary deferred).
export const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.proposals": "Proposals",
    "nav.notifications": "Notifications",
    "nav.audit": "Audit Trail",
    "nav.settings": "Settings",
    "nav.login": "Sign in",
    "action.newProposal": "New Proposal",
    "action.search": "Search proposals...",
    "role.switcher.label": "DEMO MODE — SIMULATED ROLE",
  },
  fa: {
    "nav.dashboard": "داشبورد",
    "nav.proposals": "پیشنهادها",
    "nav.notifications": "اعلان‌ها",
    "nav.audit": "رد ممیزی",
    "nav.settings": "تنظیمات",
    "nav.login": "ورود",
    "action.newProposal": "پیشنهاد جدید",
    "action.search": "جست‌وجوی پیشنهادها...",
    "role.switcher.label": "حالت نمایشی — نقش شبیه‌سازی‌شده",
  },
};

export const STORAGE_KEYS = {
  role: "cpv:demoRole",
  locale: "cpv:locale",
  theme: "cpv:theme",
  voted: "cpv:demoVotes",
  followed: "cpv:demoFollows",
  notificationsRead: "cpv:notifRead",
} as const;
