"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "@/lib/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { safeLocalGet, safeLocalSet } from "@/lib/utils";

interface DemoUser {
  id: string;
  displayName: string;
  role: Role;
}

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
  user: DemoUser;
  isDemo: true; // always demo in Phase 1
}

const RoleContext = createContext<RoleContextValue | null>(null);

const DEMO_USERS: Record<Role, DemoUser> = {
  citizen: { id: "u_demo_citizen", displayName: "Demo Citizen", role: "citizen" },
  proposer: { id: "u_demo_proposer", displayName: "Demo Proposer", role: "proposer" },
  verifier: { id: "u_demo_verifier", displayName: "Demo Verifier", role: "verifier" },
  government: { id: "u_demo_gov", displayName: "Demo Observer", role: "government" },
  ngo: { id: "u_demo_ngo", displayName: "Demo NGO", role: "ngo" },
  auditor: { id: "u_demo_auditor", displayName: "Demo Auditor", role: "auditor" },
  admin: { id: "u_demo_admin", displayName: "Demo Admin", role: "admin" },
  ai_delegate: { id: "u_demo_ai", displayName: "Demo AI Delegate", role: "ai_delegate" },
  governance_council: { id: "u_demo_council", displayName: "Demo Council", role: "governance_council" },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("citizen");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = safeLocalGet(STORAGE_KEYS.role) as Role | null;
    if (saved && saved in DEMO_USERS) setRoleState(saved);
    setMounted(true);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    safeLocalSet(STORAGE_KEYS.role, r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, user: DEMO_USERS[role], isDemo: true }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
