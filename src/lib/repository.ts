import { getDataProvider } from "./services/mock-provider";
import type { IDataProvider } from "./services/types";

// Single entry point for the UI to access the active provider.
// In a future Supabase implementation, swap this for the real provider.
export function getProvider(): IDataProvider {
  return getDataProvider();
}
