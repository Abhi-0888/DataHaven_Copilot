import { apiFetch } from "./api";

export const verificationApi = {
    register: (datasetId: number) =>
        apiFetch<{ txHash: string; status: string }>("/api/blockchain/register", {
            method: "POST",
            body: JSON.stringify({ datasetId }),
        }),

    verify: (hash: string) =>
        apiFetch<{ verified: boolean; timestamp?: string }>(`/api/blockchain/verify/${hash}`),

    getProof: (datasetId: number) =>
        apiFetch<any>(`/api/datasets/${datasetId}/proof`),
};
