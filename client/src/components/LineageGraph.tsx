import { motion } from "framer-motion";
import { GitBranch, Clock } from "lucide-react";
import { format } from "date-fns";

interface Version {
    id: number;
    datasetId: number;
    versionNumber: number;
    parentVersion: number | null;
    fileHash: string;
    createdAt: string;
}

interface LineageGraphProps {
    versions: Version[];
}

export function LineageGraph({ versions }: LineageGraphProps) {
    if (versions.length === 0) {
        return (
            <div className="glass-panel p-10 rounded-2xl text-center border-dashed border-2 border-white/10">
                <GitBranch className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No version history found.</p>
            </div>
        );
    }

    const sorted = [...versions].sort((a, b) => a.versionNumber - b.versionNumber);

    return (
        <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-primary" />
                Version Lineage
            </h3>

            <div className="relative">
                {/* Vertical connector */}
                <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

                <div className="space-y-4 pl-14">
                    {sorted.map((version, i) => (
                        <motion.div
                            key={version.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                        >
                            {/* Node dot */}
                            <div className="absolute -left-14 flex items-center justify-center">
                                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                  ${i === sorted.length - 1
                                        ? "bg-primary/20 border-primary text-primary"
                                        : "bg-black/40 border-white/20 text-muted-foreground"
                                    }`}
                                >
                                    v{version.versionNumber}
                                </div>
                            </div>

                            <div className={`glass-panel p-4 rounded-xl border ${i === sorted.length - 1 ? "border-primary/30" : "border-white/5"}`}>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-sm">Version {version.versionNumber}</span>
                                            {i === sorted.length - 1 && (
                                                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">Latest</span>
                                            )}
                                            {version.parentVersion && (
                                                <span className="text-xs text-muted-foreground">← from v{version.parentVersion}</span>
                                            )}
                                        </div>
                                        <p className="text-xs font-mono text-muted-foreground truncate max-w-sm">
                                            {version.fileHash}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                                        <Clock className="w-3.5 h-3.5" />
                                        {format(new Date(version.createdAt), "MMM d, yyyy")}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
