// CPV — Citizens' Proposed Vote
// Centralized domain type definitions.
// All timestamps use ISO 8601 strings.

export type Role =
  | "citizen"
  | "proposer"
  | "verifier"
  | "government"
  | "ngo"
  | "auditor"
  | "admin"
  | "ai_delegate"
  | "governance_council";

export type ProposalStatus =
  | "draft"
  | "ai_review"
  | "community_review"
  | "verification"
  | "public_vote"
  | "approved"
  | "submitted"
  | "rejected";

export type Category =
  | "transportation"
  | "housing"
  | "environment"
  | "accessibility"
  | "education"
  | "public_services"
  | "infrastructure"
  | "culture";

export type VoteType = "support" | "oppose" | "abstain";

export type NotificationType =
  | "proposal_update"
  | "comment"
  | "vote"
  | "verification"
  | "system"
  | "mention";

export type Locale = "en" | "fa";

export interface ProposalVersion {
  id: string;
  proposalId: string;
  versionNumber: number;
  title: string;
  description: string;
  editedBy: string;
  editedAt: string;
  changeSummary?: string;
}

export interface Comment {
  id: string;
  proposalId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  content: string;
  createdAt: string;
  parentId?: string;
  endorsedBy?: string[];
}

export interface Vote {
  id: string;
  proposalId: string;
  voterId: string;
  voterName: string;
  voteType: VoteType;
  votedAt: string;
}

export interface VoteSummary {
  support: number;
  oppose: number;
  abstain: number;
  total: number;
}

export interface ProposalLifecycleEvent {
  id: string;
  proposalId: string;
  fromStatus: ProposalStatus | null;
  toStatus: ProposalStatus;
  actorId: string;
  actorName: string;
  occurredAt: string;
  note?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  action: string;
  targetType: "proposal" | "comment" | "vote" | "notification" | "user" | "system";
  targetId: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  link?: string;
  targetProposalId?: string;
}

export interface TokenBalance {
  userId: string;
  reputation: number;
  participation: number;
  // Illustrative only — never a real token contract.
  illustrativeUnits: number;
}

export interface ImpactAssessment {
  proposalId: string;
  estimatedBeneficiaries: number;
  estimatedCost: string;
  estimatedDurationMonths: number;
  riskLevel: "low" | "medium" | "high";
  sustainabilityScore: number; // 0-100
  equityScore: number; // 0-100
  notes: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  location?: string;
  affectedCommunity?: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
  voteSummary: VoteSummary;
  commentCount: number;
  versionCount: number;
  followerCount: number;
  impactAssessment?: ImpactAssessment;
  aiSuggestions?: AiSuggestion[];
  relatedProposalIds?: string[];
}

export interface AiSuggestion {
  id: string;
  field: "title" | "description" | "tags";
  originalText: string;
  suggestedText: string;
  rationale: string;
  confidence: number; // 0-100
  accepted?: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  role: Role;
  bio?: string;
  location?: string;
  joinedAt: string;
  tokenBalance: TokenBalance;
}

export interface ServiceError {
  code: string;
  message: string;
  field?: string;
}

export interface ServiceResult<T> {
  data?: T;
  error?: ServiceError;
  success: boolean;
}

export interface ProposalFilters {
  search?: string;
  status?: ProposalStatus | "all";
  category?: Category | "all";
  sort?: "recent" | "votes" | "created";
  page?: number;
  pageSize?: number;
}

export interface AuditFilters {
  search?: string;
  actorRole?: Role | "all";
  targetType?: AuditLog["targetType"] | "all";
  page?: number;
  pageSize?: number;
}

export interface NewProposalInput {
  title: string;
  description: string;
  category: Category;
  tags: string[];
  location?: string;
  affectedCommunity?: string;
}

export interface ProposalUpdateInput {
  title?: string;
  description?: string;
  category?: Category;
  tags?: string[];
  location?: string;
  affectedCommunity?: string;
}

export interface NewCommentInput {
  proposalId: string;
  content: string;
  parentId?: string;
}
