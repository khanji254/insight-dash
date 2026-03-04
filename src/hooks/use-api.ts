/**
 * TanStack Query hooks for the Dashboard / Red Flags data.
 * Usage:
 *   const { data, isLoading, error } = useDashboardStats();
 */
import { useQuery } from "@tanstack/react-query";
import { redFlagsApi, donorsApi, tendersApi, entitiesApi, appointmentsApi } from "@/lib/api";

// ─── Dashboard ────────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => redFlagsApi.stats().then((r) => r.data),
  });
}

// ─── Red Flags ────────────────────────────────────────────────────────────────
export function useRedFlags(params?: { page?: number; limit?: number; minRisk?: number; ministry?: string }) {
  return useQuery({
    queryKey: ["redFlags", params],
    queryFn: () => redFlagsApi.list(params).then((r) => r.data),
  });
}

export function useRedFlag(id: string) {
  return useQuery({
    queryKey: ["redFlags", id],
    queryFn: () => redFlagsApi.getById(id).then((r) => r.data.flag),
    enabled: Boolean(id),
  });
}

// ─── Entities ────────────────────────────────────────────────────────────────
export function useEntities(params?: { page?: number; limit?: number; type?: string; minRisk?: number; search?: string }) {
  return useQuery({
    queryKey: ["entities", params],
    queryFn: () => entitiesApi.list(params).then((r) => r.data),
  });
}

export function useEntity(id: string) {
  return useQuery({
    queryKey: ["entities", id],
    queryFn: () => entitiesApi.getById(id).then((r) => r.data.entity),
    enabled: Boolean(id),
  });
}

// ─── Donors ──────────────────────────────────────────────────────────────────
export function useDonors(params?: { page?: number; limit?: number; party?: string }) {
  return useQuery({
    queryKey: ["donors", params],
    queryFn: () => donorsApi.list(params).then((r) => r.data),
  });
}

export function useDonor(id: string) {
  return useQuery({
    queryKey: ["donors", id],
    queryFn: () => donorsApi.getById(id).then((r) => r.data.donor),
    enabled: Boolean(id),
  });
}

// ─── Tenders ─────────────────────────────────────────────────────────────────
export function useTenders(params?: { page?: number; limit?: number; ministry?: string }) {
  return useQuery({
    queryKey: ["tenders", params],
    queryFn: () => tendersApi.list(params).then((r) => r.data),
  });
}

export function useTender(id: string) {
  return useQuery({
    queryKey: ["tenders", id],
    queryFn: () => tendersApi.getById(id).then((r) => r.data.tender),
    enabled: Boolean(id),
  });
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useAppointments(params?: { page?: number; limit?: number; ministry?: string }) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => appointmentsApi.list(params).then((r) => r.data),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => appointmentsApi.getById(id).then((r) => r.data.appointment),
    enabled: Boolean(id),
  });
}
