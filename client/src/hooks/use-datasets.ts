import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDatasets() {
  return useQuery({
    queryKey: [api.datasets.list.path],
    queryFn: async () => {
      const res = await fetch(api.datasets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch datasets");
      return res.json();
    },
  });
}

export function useDataset(id: number) {
  return useQuery({
    queryKey: [api.datasets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.datasets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dataset");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(api.datasets.upload.path, {
        method: api.datasets.upload.method,
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(err.message || "Upload failed");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] }),
  });
}

export function useAnalyzeDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.datasets.analyze.path, { id });
      const res = await fetch(url, {
        method: api.datasets.analyze.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to analyze dataset");
      return res.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.report.path, id] });
      queryClient.invalidateQueries({ queryKey: ["ledger", id] });
      queryClient.invalidateQueries({ queryKey: ["timeline", id] });
    },
  });
}

export function useDatasetReport(id: number) {
  return useQuery({
    queryKey: [api.datasets.report.path, id],
    queryFn: async () => {
      const url = buildUrl(api.datasets.report.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch report");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useTimeline(id: number) {
  return useQuery({
    queryKey: ["timeline", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/timeline`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch timeline");
      return res.json() as Promise<any[]>;
    },
    enabled: !!id,
  });
}

export function useLedger(id: number) {
  return useQuery({
    queryKey: ["ledger", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/ledger`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch ledger");
      return res.json() as Promise<any[]>;
    },
    enabled: !!id,
  });
}

export function useTrustBreakdown(id: number) {
  return useQuery({
    queryKey: ["trust", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/trust`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch trust breakdown");
      return res.json() as Promise<{
        completeness: number;
        freshness: number;
        consistency: number;
        schema: number;
        verification: number;
        total: number;
        weights: Record<string, number>;
      }>;
    },
    enabled: !!id,
  });
}

export function useVersions(id: number) {
  return useQuery({
    queryKey: ["versions", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/versions`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch versions");
      return res.json() as Promise<any[]>;
    },
    enabled: !!id,
  });
}

export function useSystemEvents(id: number) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/events`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json() as Promise<any[]>;
    },
    enabled: !!id,
  });
}

export function useStorageProof(id: number) {
  return useQuery({
    queryKey: ["proof", id],
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${id}/proof`, { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!id,
  });
}
