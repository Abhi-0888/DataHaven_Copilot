import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useRegisterBlockchain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (datasetId: number) => {
      const validated = api.blockchain.register.input.parse({ datasetId });
      const res = await fetch(api.blockchain.register.path, {
        method: api.blockchain.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to register on blockchain");
      return api.blockchain.register.responses[200].parse(await res.json());
    },
    onSuccess: (_, datasetId) => {
      // Invalidate the dataset to reflect any new trust score or verification status changes
      queryClient.invalidateQueries({ queryKey: [api.datasets.get.path, datasetId] });
      queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] });
    }
  });
}

export function useVerifyBlockchain(hash: string | undefined) {
  return useQuery({
    queryKey: [api.blockchain.verify.path, hash],
    queryFn: async () => {
      if (!hash) return null;
      const url = buildUrl(api.blockchain.verify.path, { hash });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to verify on blockchain");
      return api.blockchain.verify.responses[200].parse(await res.json());
    },
    enabled: !!hash,
  });
}
