import { describe, it, expect } from "vitest";
import { canTransition, nextStatuses, applyTransition } from "@/lib/lifecycle";
import type { ProposalStatus } from "@/lib/types";

describe("lifecycle transitions", () => {
  it("permits the canonical forward path", () => {
    expect(canTransition("draft", "ai_review")).toBe(true);
    expect(canTransition("ai_review", "community_review")).toBe(true);
    expect(canTransition("community_review", "verification")).toBe(true);
    expect(canTransition("verification", "public_vote")).toBe(true);
    expect(canTransition("public_vote", "approved")).toBe(true);
    expect(canTransition("approved", "submitted")).toBe(true);
  });

  it("permits rejection paths at review stages", () => {
    expect(canTransition("ai_review", "rejected")).toBe(true);
    expect(canTransition("community_review", "rejected")).toBe(true);
    expect(canTransition("verification", "rejected")).toBe(true);
    expect(canTransition("public_vote", "rejected")).toBe(true);
  });

  it("permits draft rewind from review stages", () => {
    expect(canTransition("ai_review", "draft")).toBe(true);
    expect(canTransition("community_review", "draft")).toBe(true);
    expect(canTransition("verification", "community_review")).toBe(true);
  });

  it("permits revision after rejection", () => {
    expect(canTransition("rejected", "draft")).toBe(true);
  });

  it("forbids skipping stages", () => {
    expect(canTransition("draft", "public_vote")).toBe(false);
    expect(canTransition("draft", "approved")).toBe(false);
    expect(canTransition("ai_review", "public_vote")).toBe(false);
    expect(canTransition("community_review", "approved")).toBe(false);
  });

  it("forbids transition from terminal state (submitted)", () => {
    const next = nextStatuses("submitted");
    expect(next).toEqual([]);
    expect(canTransition("submitted", "draft" as ProposalStatus)).toBe(false);
  });

  it("forbids self-transitions", () => {
    const statuses: ProposalStatus[] = ["draft", "ai_review", "community_review", "verification", "public_vote", "approved", "submitted", "rejected"];
    for (const s of statuses) {
      expect(canTransition(s, s)).toBe(false);
    }
  });

  it("applyTransition returns the next status on success", () => {
    expect(applyTransition("draft", "ai_review")).toBe("ai_review");
    expect(applyTransition("public_vote", "approved")).toBe("approved");
  });

  it("applyTransition throws on invalid transitions", () => {
    expect(() => applyTransition("draft", "public_vote")).toThrow();
    expect(() => applyTransition("submitted", "draft")).toThrow();
  });

  it("nextStatuses returns the allowed forward set", () => {
    expect(nextStatuses("draft")).toEqual(expect.arrayContaining(["ai_review", "community_review"]));
    expect(nextStatuses("public_vote")).toEqual(expect.arrayContaining(["approved", "rejected"]));
    expect(nextStatuses("submitted")).toEqual([]);
  });
});
