/**
 * Typed API client for the InsightDash backend.
 * Automatically attaches the access token, handles 401
 * by attempting a silent token refresh, and exposes
 * typed helper functions for every endpoint.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1";

// ─── Token Storage ────────────────────────────────────────────────────────────
const ACCESS_KEY = "id_access";
const REFRESH_KEY = "id_refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// ─── Core Fetch ───────────────────────────────────────────────────────────────
type RequestOptions = RequestInit & { _retry?: boolean };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const access = tokenStore.getAccess();
  if (access) headers.set("Authorization", `Bearer ${access}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !options._retry) {
    // Try silent refresh
    const refresh = tokenStore.getRefresh();
    if (refresh) {
      const refreshed = await silentRefresh(refresh);
      if (refreshed) {
        headers.set("Authorization", `Bearer ${tokenStore.getAccess()!}`);
        const retry = await fetch(`${BASE_URL}${path}`, { ...options, headers });
        if (retry.ok) return retry.json() as Promise<T>;
      }
    }
    tokenStore.clear();
    window.dispatchEvent(new Event("auth:logout"));
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message ?? "Request failed");
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

async function silentRefresh(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const { data } = await res.json();
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ─── Convenience helpers ──────────────────────────────────────────────────────
const get = <T>(path: string) => request<T>(path, { method: "GET" });
const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body) });
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: "PATCH", body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: "DELETE" });

// ─── Shared Response Types ────────────────────────────────────────────────────
export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
}

export interface PaginatedData<K extends string, T> {
  [key: string]: T[] | number;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  role: string;
}

export const authApi = {
  register: (email: string, password: string, name: string) =>
    post<ApiResponse<{ user: { id: string; email: string; name: string; role: string } }>>(
      "/auth/register",
      { email, password, name }
    ),
  login: (email: string, password: string) =>
    post<ApiResponse<AuthTokens>>("/auth/login", { email, password }),
  refresh: (refreshToken: string) =>
    post<ApiResponse<AuthTokens>>("/auth/refresh", { refreshToken }),
  logout: (refreshToken: string) =>
    post<ApiResponse<null>>("/auth/logout", { refreshToken }),
  me: () => get<ApiResponse<{ user: CurrentUser }>>("/auth/me"),
};

// ─── Donors ───────────────────────────────────────────────────────────────────
export interface Donor {
  id: string;
  name: string;
  amount: string; // BigInt is serialised as string
  party: string;
  date: string;
  linkedCompany?: string;
  entityId?: string;
}

export const donorsApi = {
  list: (params?: { page?: number; limit?: number; party?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return get<ApiResponse<{ donors: Donor[]; total: number; page: number; limit: number; totalPages: number }>>(`/donors${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => get<ApiResponse<{ donor: Donor }>>(`/donors/${id}`),
  create: (body: Omit<Donor, "id">) => post<ApiResponse<{ donor: Donor }>>("/donors", body),
  update: (id: string, body: Partial<Omit<Donor, "id">>) =>
    patch<ApiResponse<{ donor: Donor }>>(`/donors/${id}`, body),
  delete: (id: string) => del<void>(`/donors/${id}`),
};

// ─── Tenders ──────────────────────────────────────────────────────────────────
export interface Tender {
  id: string;
  companyName: string;
  amount: string;
  ministry: string;
  awardDate: string;
  reference: string;
  entityId?: string;
}

export const tendersApi = {
  list: (params?: { page?: number; limit?: number; ministry?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return get<ApiResponse<{ tenders: Tender[]; total: number; page: number; limit: number; totalPages: number }>>(`/tenders${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => get<ApiResponse<{ tender: Tender }>>(`/tenders/${id}`),
  create: (body: Omit<Tender, "id">) => post<ApiResponse<{ tender: Tender }>>("/tenders", body),
  update: (id: string, body: Partial<Omit<Tender, "id">>) =>
    patch<ApiResponse<{ tender: Tender }>>(`/tenders/${id}`, body),
  delete: (id: string) => del<void>(`/tenders/${id}`),
};

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface Entity {
  id: string;
  name: string;
  type: "Company" | "Individual";
  riskScore: number;
  totalDonations: string;
  totalContracts: string;
  matchCount: number;
  party?: string;
  ministry?: string;
}

export const entitiesApi = {
  list: (params?: { page?: number; limit?: number; type?: string; minRisk?: number; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return get<ApiResponse<{ entities: Entity[]; total: number; page: number; limit: number; totalPages: number }>>(`/entities${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => get<ApiResponse<{ entity: Entity }>>(`/entities/${id}`),
  create: (body: Omit<Entity, "id" | "totalDonations" | "totalContracts" | "matchCount">) =>
    post<ApiResponse<{ entity: Entity }>>("/entities", body),
  update: (id: string, body: Partial<Omit<Entity, "id" | "totalDonations" | "totalContracts" | "matchCount">>) =>
    patch<ApiResponse<{ entity: Entity }>>(`/entities/${id}`, body),
  delete: (id: string) => del<void>(`/entities/${id}`),
};

// ─── Red Flags ────────────────────────────────────────────────────────────────
export interface RedFlag {
  id: string;
  entityAId: string;
  entityBId: string;
  entityA?: Entity;
  entityB?: Entity;
  matchConfidence: number;
  riskScore: number;
  donationAmount: string;
  tenderAmount: string;
  donationDate: string;
  awardDate: string;
  ministry: string;
  party: string;
}

export interface DashboardStats {
  totalRedFlags: number;
  highRiskRedFlags: number;
  highRiskEntities: number;
  totalDonations: string;
  totalContracts: string;
  averageROI: number;
}

export const redFlagsApi = {
  list: (params?: { page?: number; limit?: number; minRisk?: number; ministry?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return get<ApiResponse<{ redFlags: RedFlag[]; total: number; page: number; totalPages: number }>>(`/red-flags${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => get<ApiResponse<{ flag: RedFlag }>>(`/red-flags/${id}`),
  stats: () => get<ApiResponse<DashboardStats>>("/red-flags/stats"),
};

// ─── Appointments ─────────────────────────────────────────────────────────────
export interface Appointment {
  id: string;
  name: string;
  role: string;
  gazetteRef: string;
  date: string;
  ministry: string;
}

export const appointmentsApi = {
  list: (params?: { page?: number; limit?: number; ministry?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return get<ApiResponse<{ appointments: Appointment[]; total: number; page: number; totalPages: number }>>(`/appointments${qs ? `?${qs}` : ""}`);
  },
  getById: (id: string) => get<ApiResponse<{ appointment: Appointment }>>(`/appointments/${id}`),
  create: (body: Omit<Appointment, "id">) =>
    post<ApiResponse<{ appointment: Appointment }>>("/appointments", body),
  delete: (id: string) => del<void>(`/appointments/${id}`),
};
