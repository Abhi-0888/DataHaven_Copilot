import { randomHex, sha256 } from "../utils/hash";
import { datasetRepo } from "../repositories/dataset.repo";
import { eventRepo } from "../repositories/event.repo";

export interface StorageProof {
    proofId: string;
    datasetId: number;
    storageNodes: string[];
    merkleRoot: string;
    timestamp: string;
    network: "DataHaven Testnet";
    verified: boolean;
}

export const verificationService = {
    /**
     * Simulate registering a dataset on the DataHaven Testnet.
     * Generates a fake tx hash and records a VERIFIED event.
     */
    async register(datasetId: number): Promise<{ txHash: string; status: string }> {
        const txHash = `0x${randomHex(32)}`;

        await eventRepo.createVerificationEvent({
            datasetId,
            eventType: "VERIFIED",
            metadata: { txHash, network: "DataHaven Testnet" },
        });

        await eventRepo.createSystemEvent({
            datasetId,
            eventType: "BLOCKCHAIN_REGISTERED",
            actor: "system",
            metadata: { txHash },
        });

        // Bump verification score on the dataset
        const dataset = await datasetRepo.getById(datasetId);
        if (dataset) {
            const newVerification = Math.min(100, dataset.verificationScore + 50);
            await datasetRepo.update(datasetId, {
                verificationScore: newVerification,
                trustScore:
                    dataset.completenessScore * 0.3 +
                    dataset.freshnessScore * 0.25 +
                    dataset.consistencyScore * 0.2 +
                    dataset.schemaScore * 0.15 +
                    newVerification * 0.1,
            });
        }

        return { txHash, status: "success" };
    },

    /**
     * Simulate a DataHaven storage proof verification check.
     */
    generateStorageProof(datasetId: number, fileHash: string): StorageProof {
        const nodeSeeds = ["node-alpha", "node-beta", "node-gamma", "node-delta"];
        const storageNodes = nodeSeeds.map(
            (n) => `dh://${n}-${randomHex(4)}.testnet`
        );
        const merkleRoot = sha256(fileHash + storageNodes.join(""));

        return {
            proofId: randomHex(16),
            datasetId,
            storageNodes,
            merkleRoot,
            timestamp: new Date().toISOString(),
            network: "DataHaven Testnet",
            verified: true,
        };
    },

    async verify(hash: string): Promise<{ verified: boolean; timestamp: string }> {
        return { verified: true, timestamp: new Date().toISOString() };
    },
};
