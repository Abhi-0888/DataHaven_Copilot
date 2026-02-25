import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { sha256, randomHex } from "../utils/hash";
import { computeTrustScore } from "../utils/scoring";
import { datasetRepo } from "../repositories/dataset.repo";
import { eventRepo } from "../repositories/event.repo";
import { versionRepo } from "../repositories/version.repo";
import type { InsertDataset, Dataset } from "@shared/schema";

export const datasetService = {
    async getAll(): Promise<Dataset[]> {
        return datasetRepo.getAll();
    },

    async getById(id: number): Promise<Dataset | undefined> {
        return datasetRepo.getById(id);
    },

    async create(params: {
        name: string;
        description?: string;
        ownerWallet: string;
        fileBuffer: Buffer;
        originalname: string;
    }): Promise<Dataset> {
        const fileHash = sha256(params.fileBuffer);
        const metadataHash = randomHex(32);

        const completenessScore = 80;
        const freshnessScore = 70;
        const consistencyScore = 75;
        const schemaScore = 85;
        const verificationScore = 0;
        const trustScore = computeTrustScore({
            completenessScore,
            freshnessScore,
            consistencyScore,
            schemaScore,
            verificationScore,
        });

        const dataset = await datasetRepo.create({
            name: params.name,
            description: params.description ?? "",
            ownerWallet: params.ownerWallet,
            storageId: `datahaven://${randomHex(16)}`,
            fileHash,
            metadataHash,
            aiReportHash: "pending",
            trustScore,
            completenessScore,
            freshnessScore,
            consistencyScore,
            schemaScore,
            verificationScore,
            version: 1,
        });

        // Log upload verification event
        await eventRepo.createVerificationEvent({
            datasetId: dataset.id,
            eventType: "UPLOAD",
            metadata: { filename: params.originalname },
        });

        // Log system event
        await eventRepo.createSystemEvent({
            datasetId: dataset.id,
            eventType: "DATASET_CREATED",
            actor: params.ownerWallet,
            metadata: { filename: params.originalname, fileHash },
        });

        // Create initial version record
        await versionRepo.create({
            datasetId: dataset.id,
            versionNumber: 1,
            fileHash,
        });

        return dataset;
    },
};
