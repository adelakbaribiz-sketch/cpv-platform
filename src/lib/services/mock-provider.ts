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
import type { IDataProvider } from "./types";
import { MOCK_AUDIT_LOGS, MOCK_COMMENTS, MOCK_NOTIFICATIONS, MOCK_PROPOSALS, MOCK_VERSIONS } from "../mock-data";
import { applyTransition, canTransition } from "../lifecycle";
import { nowIso, uid } from "../utils";
import { ROLE_LABEL } from "../constants";

// In-memory store initialized from mock data. Mutations are kept for the
// duration of the demo session (server-side).
class Store {
  proposals: Proposal[] = MOCK_PROPOSALS.map((p) => ({ ...p }));
  comments: Comment[] = MOCK_COMMENTS.map((c) => ({ ...c }));
  versions: ProposalVersion[] = MOCK_VERSIONS.map((v) => ({ ...v }));
  audit: AuditLog[] = MOCK_AUDIT_LOGS.map((a) => ({ ...a }));
  notifications: Notification[] = MOCK_NOTIFICATIONS.map((n) => ({ ...n }));
  lifecycleEvents: ProposalLifecycleEvent[] = [];
}

const store = new Store();

function ok<T>(data: T): ServiceResult<T> {
  return { data, success: true };
}
function err<T>(code: string, message: string, field?: string): ServiceResult<T> {
  return { success: false, error: { code, message, field } };
}

function logAudit(a: Omit<AuditLog, "id" | "timestamp">): void {
  store.audit.unshift({ ...a, id: uid("a"), timestamp: nowIso() });
}

export class MockDataProvider implements IDataProvider {
  async listProposals(filters: ProposalFilters = {}): Promise<ServiceResult<{ items: Proposal[]; total: number; page: number; pageSize: number }>> {
    const { search, status = "all", category = "all", sort = "recent", page = 1, pageSize = 9 } = filters;
    let items = [...store.proposals];

    if (status !== "all") items = items.filter((p) => p.status === status);
    if (category !== "all") items = items.filter((p) => p.category === category);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    switch (sort) {
      case "votes":
        items.sort((a, b) => b.voteSummary.total - a.voteSummary.total);
        break;
      case "created":
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "recent":
      default:
        items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return ok({ items: paged, total, page, pageSize });
  }

  async getProposalById(id: string): Promise<ServiceResult<Proposal>> {
    const p = store.proposals.find((x) => x.id === id);
    if (!p) return err("not_found", `Proposal ${id} not found`);
    return ok({ ...p });
  }

  async createProposal(input: NewProposalInput, authorId: string, authorName: string, authorRole: Proposal["authorRole"]): Promise<ServiceResult<Proposal>> {
    const id = uid("p");
    const ts = nowIso();
    const proposal: Proposal = {
      id,
      title: input.title,
      description: input.description,
      category: input.category,
      tags: input.tags,
      location: input.location,
      affectedCommunity: input.affectedCommunity,
      authorId,
      authorName,
      authorRole,
      status: "draft",
      createdAt: ts,
      updatedAt: ts,
      voteSummary: { support: 0, oppose: 0, abstain: 0, total: 0 },
      commentCount: 0,
      versionCount: 1,
      followerCount: 0,
    };
    store.proposals.unshift(proposal);
    store.versions.unshift({
      id: uid("v"),
      proposalId: id,
      versionNumber: 1,
      title: input.title,
      description: input.description,
      editedBy: authorId,
      editedAt: ts,
      changeSummary: "Initial draft",
    });
    logAudit({ actorId: authorId, actorName: authorName, actorRole: authorRole, action: "proposal.created", targetType: "proposal", targetId: id, metadata: { title: input.title } });
    return ok(proposal);
  }

  async updateProposal(id: string, input: ProposalUpdateInput, actorId: string, actorName: string): Promise<ServiceResult<Proposal>> {
    const idx = store.proposals.findIndex((p) => p.id === id);
    if (idx === -1) return err("not_found", `Proposal ${id} not found`);
    const prev = store.proposals[idx];
    const updated: Proposal = {
      ...prev,
      ...input,
      updatedAt: nowIso(),
      versionCount: prev.versionCount + 1,
    };
    store.proposals[idx] = updated;
    store.versions.unshift({
      id: uid("v"),
      proposalId: id,
      versionNumber: updated.versionCount,
      title: updated.title,
      description: updated.description,
      editedBy: actorId,
      editedAt: updated.updatedAt,
      changeSummary: `Revision v${updated.versionCount}`,
    });
    logAudit({ actorId: actorId, actorName, actorRole: prev.authorRole, action: "proposal.updated", targetType: "proposal", targetId: id, metadata: { fields: Object.keys(input) } });
    return ok(updated);
  }

  async transitionProposal(id: string, nextStatus: ProposalStatus, actorId: string, actorName: string): Promise<ServiceResult<Proposal>> {
    const idx = store.proposals.findIndex((p) => p.id === id);
    if (idx === -1) return err("not_found", `Proposal ${id} not found`);
    const prev = store.proposals[idx];
    if (!canTransition(prev.status, nextStatus)) {
      return err("invalid_transition", `Cannot transition ${prev.status} → ${nextStatus}`);
    }
    const updated: Proposal = { ...prev, status: applyTransition(prev.status, nextStatus), updatedAt: nowIso() };
    store.proposals[idx] = updated;
    store.lifecycleEvents.unshift({
      id: uid("e"),
      proposalId: id,
      fromStatus: prev.status,
      toStatus: nextStatus,
      actorId,
      actorName,
      occurredAt: nowIso(),
    });
    logAudit({
      actorId,
      actorName,
      actorRole: prev.authorRole,
      action: "proposal.transitioned",
      targetType: "proposal",
      targetId: id,
      metadata: { from: prev.status, to: nextStatus },
    });
    return ok(updated);
  }

  async castDemoVote(proposalId: string, voteType: VoteType, voterId: string, voterName: string): Promise<ServiceResult<Proposal>> {
    const idx = store.proposals.findIndex((p) => p.id === proposalId);
    if (idx === -1) return err("not_found", `Proposal ${proposalId} not found`);
    const prev = store.proposals[idx];
    const summary = { ...prev.voteSummary };
    summary[voteType] += 1;
    summary.total = summary.support + summary.oppose + summary.abstain;
    const updated: Proposal = { ...prev, voteSummary: summary, updatedAt: nowIso() };
    store.proposals[idx] = updated;
    logAudit({
      actorId: voterId,
      actorName: voterName,
      actorRole: "citizen",
      action: "vote.cast",
      targetType: "vote",
      targetId: proposalId,
      metadata: { voteType },
    });
    return ok(updated);
  }

  async addComment(input: NewCommentInput, authorId: string, authorName: string, authorRole: Comment["authorRole"]): Promise<ServiceResult<Comment>> {
    const proposal = store.proposals.find((p) => p.id === input.proposalId);
    if (!proposal) return err("not_found", `Proposal ${input.proposalId} not found`);
    const comment: Comment = {
      id: uid("c"),
      proposalId: input.proposalId,
      authorId,
      authorName,
      authorRole,
      content: input.content,
      createdAt: nowIso(),
      parentId: input.parentId,
    };
    store.comments.push(comment);
    const idx = store.proposals.findIndex((p) => p.id === input.proposalId);
    if (idx !== -1) {
      store.proposals[idx] = { ...store.proposals[idx], commentCount: store.proposals[idx].commentCount + 1, updatedAt: nowIso() };
    }
    logAudit({
      actorId: authorId,
      actorName: authorName,
      actorRole: authorRole,
      action: "comment.created",
      targetType: "comment",
      targetId: comment.id,
      metadata: { proposalId: input.proposalId },
    });
    return ok(comment);
  }

  async getComments(proposalId: string): Promise<ServiceResult<Comment[]>> {
    return ok(store.comments.filter((c) => c.proposalId === proposalId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
  }

  async getProposalVersions(proposalId: string): Promise<ServiceResult<ProposalVersion[]>> {
    return ok(store.versions.filter((v) => v.proposalId === proposalId).sort((a, b) => b.versionNumber - a.versionNumber));
  }

  async getLifecycleEvents(proposalId: string): Promise<ServiceResult<ProposalLifecycleEvent[]>> {
    return ok(store.lifecycleEvents.filter((e) => e.proposalId === proposalId).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()));
  }

  async getImpactAssessment(proposalId: string): Promise<ServiceResult<ImpactAssessment | undefined>> {
    const p = store.proposals.find((x) => x.id === proposalId);
    return ok(p?.impactAssessment);
  }

  async getNotifications(): Promise<ServiceResult<Notification[]>> {
    return ok([...store.notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  async markNotificationRead(id: string): Promise<ServiceResult<Notification>> {
    const idx = store.notifications.findIndex((n) => n.id === id);
    if (idx === -1) return err("not_found", `Notification ${id} not found`);
    store.notifications[idx] = { ...store.notifications[idx], read: true };
    return ok(store.notifications[idx]);
  }

  async markAllNotificationsRead(): Promise<ServiceResult<void>> {
    store.notifications = store.notifications.map((n) => ({ ...n, read: true }));
    return ok(undefined);
  }

  async getAuditLogs(filters: AuditFilters = {}): Promise<ServiceResult<{ items: AuditLog[]; total: number; page: number; pageSize: number }>> {
    const { search, actorRole = "all", targetType = "all", page = 1, pageSize = 20 } = filters;
    let items = [...store.audit];
    if (actorRole !== "all") items = items.filter((a) => a.actorRole === actorRole);
    if (targetType !== "all") items = items.filter((a) => a.targetType === targetType);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) => a.action.toLowerCase().includes(q) || a.actorName.toLowerCase().includes(q) || a.targetId.toLowerCase().includes(q),
      );
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    return ok({ items: items.slice(start, start + pageSize), total, page, pageSize });
  }

  async suggestProposalImprovements(input: { title: string; description: string; tags: string[] }): Promise<ServiceResult<AiSuggestion[]>> {
    // Deterministic mock. Clearly labeled. No real AI provider call.
    const suggestions: AiSuggestion[] = [];
    if (input.title.length < 40) {
      suggestions.push({
        id: uid("ai"),
        field: "title",
        originalText: input.title,
        suggestedText: input.title.length === 0 ? "Untitled proposal — please add a descriptive title" : `${input.title} — a community-driven proposal`,
        rationale: "Titles under ~40 characters may be too vague for search and discoverability.",
        confidence: 72,
      });
    }
    if (input.description.length < 200) {
      suggestions.push({
        id: uid("ai"),
        field: "description",
        originalText: input.description,
        suggestedText: input.description + (input.description.length === 0 ? "" : "\n\nSuggested structure to add: (1) the problem, (2) who is affected, (3) the proposed intervention, (4) expected outcomes, (5) estimated cost and timeline."),
        rationale: "Descriptions under ~200 characters often omit context, beneficiaries, or measurable outcomes.",
        confidence: 81,
      });
    }
    if (input.tags.length < 3) {
      suggestions.push({
        id: uid("ai"),
        field: "tags",
        originalText: input.tags.join(", "),
        suggestedText: input.tags.concat(["community", "pilot"]).join(", "),
        rationale: "Adding 2-4 broad tags improves proposal discoverability in the proposal explorer.",
        confidence: 65,
      });
    }
    suggestions.push({
      id: uid("ai"),
      field: "description",
      originalText: "",
      suggestedText: "Consider adding a measurable success metric (e.g., 'reduce cyclist-involved collisions by 30% within 24 months').",
      rationale: "Measurable outcomes make verification and impact assessment more concrete.",
      confidence: 78,
    });

    logAudit({
      actorId: "u_ai",
      actorName: "CPV Assistant",
      actorRole: "ai_delegate",
      action: "ai.suggestions_generated",
      targetType: "proposal",
      targetId: "draft",
      metadata: { count: suggestions.length, label: "DEMO — deterministic mock" },
    });
    return ok(suggestions);
  }

  async getRelatedProposals(proposalId: string): Promise<ServiceResult<Proposal[]>> {
    const p = store.proposals.find((x) => x.id === proposalId);
    if (!p || !p.relatedProposalIds?.length) return ok([]);
    return ok(store.proposals.filter((x) => p.relatedProposalIds!.includes(x.id)));
  }
}

// Singleton provider. UI imports `dataProvider` and calls its methods.
let _provider: IDataProvider | null = null;
export function getDataProvider(): IDataProvider {
  if (!_provider) _provider = new MockDataProvider();
  return _provider;
}
export function resetDataProvider(): void {
  _provider = new MockDataProvider();
}

// Re-export role label for convenience in services
export { ROLE_LABEL };
