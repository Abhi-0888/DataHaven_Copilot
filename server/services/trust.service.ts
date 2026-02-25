import { datasetRepo } from "../repositories/dataset.repo";
import { computeTrustScore } from "../utils/scoring";

export const trustService = {
    async getBreakdown(datasetId: number) {
        const dataset = await datasetRepo.getById(datasetId);
        if (!dataset) return null;

        const components = {
            completenessScore: dataset.completenessScore,
            freshnessScore: dataset.freshnessScore,
            consistencyScore: dataset.consistencyScore,
            schemaScore: dataset.schemaScore,
            verificationScore: dataset.verificationScore,
        };

        return {
            completeness: components.completenessScore,
            freshness: components.freshnessScore,
            consistency: components.consistencyScore,
            schema: components.schemaScore,
            verification: components.verificationScore,
            total: dataset.trustScore,
            weights: {
                completeness: 0.3,
                freshness: 0.25,
                consistency: 0.2,
                schema: 0.15,
                verification: 0.1,
            },
        };
    },

    async recompute(datasetId: number) {
        const dataset = await datasetRepo.getById(datasetId);
        if (!dataset) return null;

        const trustScore = computeTrustScore({
            completenessScore: dataset.completenessScore,
            freshnessScore: dataset.freshnessScore,
            consistencyScore: dataset.consistencyScore,
            schemaScore: dataset.schemaScore,
            verificationScore: dataset.verificationScore,
        });

        return datasetRepo.update(datasetId, { trustScore });
    },
};
