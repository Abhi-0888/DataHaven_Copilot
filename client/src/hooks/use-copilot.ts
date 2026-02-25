import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCopilotQuery() {
  return useMutation({
    mutationFn: async (data: { datasetId: number; query: string }) => {
      const validated = api.copilot.query.input.parse(data);
      const res = await fetch(api.copilot.query.path, {
        method: api.copilot.query.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          const err = api.copilot.query.responses[404].parse(await res.json());
          throw new Error(err.message);
        }
        throw new Error("Failed to query Copilot");
      }
      return api.copilot.query.responses[200].parse(await res.json());
    },
  });
}
