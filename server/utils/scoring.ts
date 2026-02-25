export interface TrustComponents {
    completenessScore: number;
    freshnessScore: number;
    consistencyScore: number;
    schemaScore: number;
    verificationScore: number;
}

/**
 * Weighted trust score formula:
 * 30% completeness + 25% freshness + 20% consistency + 15% schema + 10% verification
 */
export function computeTrustScore(components: TrustComponents): number {
    const {
        completenessScore,
        freshnessScore,
        consistencyScore,
        schemaScore,
        verificationScore,
    } = components;

    return (
        completenessScore * 0.3 +
        freshnessScore * 0.25 +
        consistencyScore * 0.2 +
        schemaScore * 0.15 +
        verificationScore * 0.1
    );
}
