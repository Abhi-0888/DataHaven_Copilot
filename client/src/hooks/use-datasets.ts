import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDatasets() {
  return useQuery({
    queryKey: [api.datasets.list.path],
    queryFn: async () => {
      const res = await fetch(api.datasets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch datasets");
      const data = await res.json();
      return api.datasets.list.responses[200].parse(data);
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
      const data = await res.json();
      return api.datasets.get.responses[200].parse(data);
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
        if (res.status === 400) {
          const error = api.datasets.upload.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to upload dataset");
      }
      return api.datasets.upload.responses[201].parse(await res.json());
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
      return api.datasets.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.report.path, id] });
    },
  });
}

export function useDatasetReport(id: number) {
  return useQuery({
    queryKey: [api.datasets.report.path, id],
    queryFn: async () => {
      const url = buildUrl(api.datasets.report.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch dataset report");
      return api.datasets.report.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
