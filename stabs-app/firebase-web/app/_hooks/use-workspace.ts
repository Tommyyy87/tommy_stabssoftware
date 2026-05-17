"use client";

import { useWorkspaceContext } from "../_providers/workspace-provider";

export function useWorkspace() {
  return useWorkspaceContext();
}
