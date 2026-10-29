import type {
  AiSuggestion,
  AuditFilters,
  AuditLog,
  Comment,
  ImpactAssessment,
  NewCommentInput,
  NewProposalInput,
  Notification,
  Proposal,
  ProposalFilters,
  ProposalLifecycleEvent,
  ProposalStatus,
  ProposalUpdateInput,
  ProposalVersion,
  ServiceResult,
  VoteType,
} from "../types";

// Repository / provider contract.
// A future Supabase implementation can replace the mock provider
// without rewriting the UI layer.
export interface IDataProvider {
  listProposals(filters?: ProposalFilters): Promise<ServiceResult<{ items: Proposal[]; total: number; page: number; pageSize: number }>>;
  getProposalById(id: string): Promise<ServiceResult<Proposal>>;
  createProposal(input: NewProposalInput, authorId: string, authorName: string, authorRole: Proposal["authorRole"]): Promise<ServiceResult<Proposal>>;
  updateProposal(id: string, input: ProposalUpdateInput, actorId: string, actorName: string): Promise<ServiceResult<Proposal>>;
  transitionProposal(id: string, nextStatus: ProposalStatus, actorId: string, actorName: string): Promise<ServiceResult<Proposal>>;
  castDemoVote(proposalId: string, voteType: VoteType, voterId: string, voterName: string): Promise<ServiceResult<Proposal>>;
  addComment(input: NewCommentInput, authorId: string, authorName: string, authorRole: Comment["authorRole"]): Promise<ServiceResult<Comment>>;
  getComments(proposalId: string): Promise<ServiceResult<Comment[]>>;
  getProposalVersions(proposalId: string): Promise<ServiceResult<ProposalVersion[]>>;
  getLifecycleEvents(proposalId: string): Promise<ServiceResult<ProposalLifecycleEvent[]>>;
  getImpactAssessment(proposalId: string): Promise<ServiceResult<ImpactAssessment | undefined>>;
  getNotifications(): Promise<ServiceResult<Notification[]>>;
  markNotificationRead(id: string): Promise<ServiceResult<Notification>>;
  markAllNotificationsRead(): Promise<ServiceResult<void>>;
  getAuditLogs(filters?: AuditFilters): Promise<ServiceResult<{ items: AuditLog[]; total: number; page: number; pageSize: number }>>;
  suggestProposalImprovements(input: { title: string; description: string; tags: string[] }): Promise<ServiceResult<AiSuggestion[]>>;
  getRelatedProposals(proposalId: string): Promise<ServiceResult<Proposal[]>>;
}
