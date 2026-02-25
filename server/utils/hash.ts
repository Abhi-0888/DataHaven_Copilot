import crypto from "crypto";

/**
 * Compute a SHA-256 hex hash for the given data.
 */
export function sha256(data: string | Buffer): string {
    return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate cryptographically random hex bytes.
 */
export function randomHex(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
}
