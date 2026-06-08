/**
 * api-client.ts  —  local replacement for @workspace/api-client-react
 * Talks to the Express backend at http://localhost:3001/api
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE = "http://localhost:3001/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type Severity = "mild" | "moderate" | "severe";
export type NewAdrReportInputSeverity = Severity;

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: string;
  activeIngredients: string[];
  indications: string[];
  contraindications: string[];
  sideEffects: string[];
  description: string;
  manufacturer?: string;
}

export interface AdrReport {
  id: string;
  drugName: string;
  reaction: string;
  severity: Severity;
  patientAge?: number;
  description: string;
  outcome?: string;
  reportedAt: string;
  status: "pending" | "reviewed" | "resolved";
}

export interface DashboardStats {
  totalDrugs: number;
  totalReports: number;
  reportsThisMonth: number;
  severeReports: number;
  dangerousInteractionsChecked: number;
  symptomsAnalyzed: number;
  severityBreakdown: { mild: number; moderate: number; severe: number };
  topReportedDrugs: { name: string; count: number }[];
}

export interface Interaction {
  drug1: string;
  drug2: string;
  severity: "safe" | "moderate" | "dangerous";
  explanation: string;
  alternatives: string[];
}

export interface InteractionResult {
  interactions: Interaction[];
  warnings: string[];
  recommendations: string[];
  overallSeverity: "safe" | "moderate" | "dangerous";
}

export interface DiseasePrediction {
  disease: string;
  confidence: number;
  description: string;
  recommendedAction: string;
  urgencyLevel: "low" | "medium" | "high" | "emergency";
  medicationConflicts?: string[];
}

export interface PredictionResult {
  predictions: DiseasePrediction[];
  analysisNotes?: string;
}

export interface ChatQueryInputConversationHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  disclaimer?: string;
}

// ─── Query key helpers ────────────────────────────────────────────────────────

export function getGetDrugQueryKey(id: string) {
  return ["/api/drugs", id] as const;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => apiFetch("/dashboard/stats"),
  });
}

export function useGetRecentReports() {
  return useQuery<AdrReport[]>({
    queryKey: ["/api/dashboard/recent-reports"],
    queryFn: () => apiFetch("/dashboard/recent-reports"),
  });
}

export function useListDrugs(
  params?: { search?: string; limit?: number },
  options?: { query?: { enabled?: boolean; queryKey?: unknown[] } }
) {
  const search = params?.search ?? "";
  const limit = params?.limit ?? 50;
  return useQuery<Drug[]>({
    queryKey: options?.query?.queryKey ?? ["/api/drugs", { search, limit }],
    queryFn: () => {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      qs.set("limit", String(limit));
      return apiFetch(`/drugs?${qs}`);
    },
    enabled: options?.query?.enabled ?? true,
  });
}

export function useGetDrug(
  id: string,
  options?: { query?: { enabled?: boolean; queryKey?: unknown[] } }
) {
  return useQuery<Drug>({
    queryKey: options?.query?.queryKey ?? getGetDrugQueryKey(id),
    queryFn: () => apiFetch(`/drugs/${id}`),
    enabled: options?.query?.enabled ?? !!id,
  });
}

export function useCheckInteractions() {
  return useMutation<
    InteractionResult,
    Error,
    { data: { drugs: string[]; patientAge?: number; conditions?: string[] } }
  >({
    mutationFn: ({ data }) =>
      apiFetch("/interactions/check", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function usePredictDisease() {
  return useMutation<
    PredictionResult,
    Error,
    { data: { symptoms: string[]; currentMedications?: string[]; patientAge?: number } }
  >({
    mutationFn: ({ data }) =>
      apiFetch("/symptoms/predict", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function useCreateAdrReport() {
  const queryClient = useQueryClient();
  return useMutation<
    AdrReport,
    Error,
    {
      data: {
        drugName: string;
        reaction: string;
        severity: Severity;
        patientAge?: number;
        description: string;
        outcome?: string;
      };
    }
  >({
    mutationFn: ({ data }) =>
      apiFetch("/adr-reports", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/recent-reports"] });
    },
  });
}

export function useSendChatMessage() {
  return useMutation<
    ChatResponse,
    Error,
    { data: { message: string; conversationHistory?: ChatQueryInputConversationHistoryItem[] } }
  >({
    mutationFn: ({ data }) =>
      apiFetch("/chatbot/message", { method: "POST", body: JSON.stringify(data) }),
  });
}
