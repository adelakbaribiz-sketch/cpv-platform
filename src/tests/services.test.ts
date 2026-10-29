import { describe, it, expect, beforeEach } from "vitest";
import { resetDataProvider, getDataProvider } from "@/lib/services/mock-provider";
import type { Category } from "@/lib/types";

const newProposal = {
  title: "Test proposal — improve local library hours",
  description: "We propose extending the local library's weekend hours to 8 PM, with a 6-month pilot and quarterly review of footfall data.",
  category: "education" as Category,
  tags: ["libraries", "community", "pilot"],
  location: "Copenhagen, DK",
  affectedCommunity: "Students, remote workers, families",
};

describe("MockDataProvider", () => {
  beforeEach(() => {
    resetDataProvider();
  });

  it("lists proposals with default filters", async () => {
    const res = await getDataProvider().listProposals({});
    expect(res.success).toBe(true);
    expect(res.data?.items.length).toBeGreaterThan(0);
    expect(res.data?.total).toBeGreaterThan(0);
  });

  it("filters by status", async () => {
    const res = await getDataProvider().listProposals({ status: "approved" });
    expect(res.success).toBe(true);
    expect(res.data?.items.every((p) => p.status === "approved")).toBe(true);
  });

  it("filters by category", async () => {
    const res = await getDataProvider().listProposals({ category: "transportation" });
    expect(res.success).toBe(true);
    expect(res.data?.items.every((p) => p.category === "transportation")).toBe(true);
  });

  it("searches by title", async () => {
    const res = await getDataProvider().listProposals({ search: "bike" });
    expect(res.success).toBe(true);
    expect(res.data?.items.length).toBeGreaterThan(0);
    expect(res.data?.items.every((p) =>
      p.title.toLowerCase().includes("bike") ||
      p.description.toLowerCase().includes("bike") ||
      p.tags.some((t) => t.toLowerCase().includes("bike"))
    )).toBe(true);
  });

  it("paginates results", async () => {
    const all = await getDataProvider().listProposals({ pageSize: 5 });
    expect(all.data?.items.length).toBeLessThanOrEqual(5);
    const page2 = await getDataProvider().listProposals({ pageSize: 5, page: 2 });
    expect(page2.data?.items.length).toBeGreaterThan(0);
    // Page 2 items should not overlap page 1
    const ids1 = new Set(all.data!.items.map((p) => p.id));
    const overlap = page2.data!.items.filter((p) => ids1.has(p.id));
    expect(overlap.length).toBe(0);
  });

  it("returns not_found for missing proposal", async () => {
    const res = await getDataProvider().getProposalById("does-not-exist");
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe("not_found");
  });

  it("creates a proposal and persists it", async () => {
    const res = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    expect(res.success).toBe(true);
    expect(res.data?.id).toBeTruthy();
    expect(res.data?.status).toBe("draft");

    const found = await getDataProvider().getProposalById(res.data!.id);
    expect(found.success).toBe(true);
    expect(found.data?.title).toBe(newProposal.title);
  });

  it("rejects invalid lifecycle transitions", async () => {
    const created = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    // draft → public_vote is forbidden (skipping)
    const res = await getDataProvider().transitionProposal(created.data!.id, "public_vote", "u_test", "Test Author");
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe("invalid_transition");
  });

  it("applies valid transitions and records lifecycle events", async () => {
    const created = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    const t1 = await getDataProvider().transitionProposal(created.data!.id, "ai_review", "u_test", "Test Author");
    expect(t1.success).toBe(true);
    expect(t1.data?.status).toBe("ai_review");
    const t2 = await getDataProvider().transitionProposal(created.data!.id, "community_review", "u_test", "Test Author");
    expect(t2.data?.status).toBe("community_review");

    const events = await getDataProvider().getLifecycleEvents(created.data!.id);
    expect(events.data?.length).toBe(2);
    expect(events.data?.[0].toStatus).toBe("community_review");
  });

  it("records a demo vote and updates totals", async () => {
    const created = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    const before = created.data!.voteSummary.total;
    const res = await getDataProvider().castDemoVote(created.data!.id, "support", "u_voter", "Voter");
    expect(res.success).toBe(true);
    expect(res.data?.voteSummary.support).toBe(before + 1);
    expect(res.data?.voteSummary.total).toBe(before + 1);
  });

  it("adds a comment and updates count", async () => {
    const created = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    const before = created.data!.commentCount;
    const res = await getDataProvider().addComment({ proposalId: created.data!.id, content: "Great proposal!" }, "u_commenter", "Commenter", "citizen");
    expect(res.success).toBe(true);
    const after = await getDataProvider().getProposalById(created.data!.id);
    expect(after.data?.commentCount).toBe(before + 1);
  });

  it("generates deterministic AI suggestions", async () => {
    const res = await getDataProvider().suggestProposalImprovements({
      title: "Short",
      description: "Too short.",
      tags: ["one"],
    });
    expect(res.success).toBe(true);
    expect(res.data?.length).toBeGreaterThan(0);
    // Each suggestion has a confidence and rationale
    for (const s of res.data!) {
      expect(typeof s.confidence).toBe("number");
      expect(s.rationale.length).toBeGreaterThan(0);
    }
  });

  it("records audit logs for key actions", async () => {
    const created = await getDataProvider().createProposal(newProposal, "u_test", "Test Author", "proposer");
    const logs = await getDataProvider().getAuditLogs({});
    const hasCreate = logs.data?.items.some((l) => l.action === "proposal.created" && l.targetId === created.data!.id);
    expect(hasCreate).toBe(true);
  });

  it("marks a notification as read", async () => {
    const notifs = await getDataProvider().getNotifications();
    const unread = notifs.data?.find((n) => !n.read);
    if (unread) {
      const res = await getDataProvider().markNotificationRead(unread.id);
      expect(res.success).toBe(true);
      expect(res.data?.read).toBe(true);
    }
  });
});
