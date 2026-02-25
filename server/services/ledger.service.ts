import { ledgerRepo, type LedgerEntry } from "../repositories/ledger.repo";
import { sha256 } from "../utils/hash";

export const ledgerService = {
    async getLedger(datasetId: number): Promise<LedgerEntry[]> {
        return ledgerRepo.getByDataset(datasetId);
    },

    async createEntry(params: {
        datasetId: number;
        insightText: string;
        datasetVersion: number;
    }): Promise<LedgerEntry> {
        const insightHash = sha256(params.insightText);
        return ledgerRepo.create({
            datasetId: params.datasetId,
            insightText: params.insightText,
            insightHash,
            datasetVersion: params.datasetVersion,
            verified: true,
        });
    },
};
