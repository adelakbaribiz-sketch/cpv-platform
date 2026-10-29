import { LIFECYCLE_TRANSITIONS } from "./constants";
import type { ProposalStatus } from "./types";

/**
 * Validates whether a status transition is permitted by domain rules.
 * Returns true if allowed.
 */
export function canTransition(from: ProposalStatus, to: ProposalStatus): boolean {
  if (from === to) return false;
  const allowed = LIFECYCLE_TRANSITIONS[from] ?? [];
  return allowed.includes(to);
}

/**
 * Returns the ordered list of statuses that a proposal can transition to.
 */
export function nextStatuses(from: ProposalStatus): ProposalStatus[] {
  return LIFECYCLE_TRANSITIONS[from] ?? [];
}

/**
 * Pure reducer that performs the transition or throws.
 * Used by tests and the service layer.
 */
export function applyTransition(from: ProposalStatus, to: ProposalStatus): ProposalStatus {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid lifecycle transition: ${from} → ${to}`);
  }
  return to;
}
