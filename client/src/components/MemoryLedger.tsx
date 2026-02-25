import { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Copy, Check, Brain, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LedgerEntry {
    id: number;
    datasetId: number;
    insightText: string;
    insightHash: string;
    datasetVersion: number;
    verified: boolean;
    createdAt: string;
}

interface MemoryLedgerProps {
    entries: LedgerEntry[];
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast({ title: "Copied!", description: "Hash copied to clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            title="Copy hash"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}

export function MemoryLedger({ entries }: MemoryLedgerProps) {
    if (entries.length === 0) {
        return (
            <div className="glass-panel p-10 rounded-2xl text-center border-dashed border-2 border-white/10">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-1">No Memory Entries</h3>
                <p className="text-muted-foreground text-sm">Run an AI analysis to populate the ledger.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, i) => (
                <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-colors"
                >
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Brain className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                                v{entry.datasetVersion} · {format(new Date(entry.createdAt), "MMM d, yyyy HH:mm")}
                            </span>
                        </div>
                        {entry.verified && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                        )}
                    </div>

                    <p className="text-foreground text-sm leading-relaxed mb-3 border-l-2 border-primary/30 pl-3">
                        {entry.insightText}
                    </p>

                    <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 border border-white/5">
                        <span className="text-xs text-muted-foreground font-mono truncate flex-1">
                            SHA-256: {entry.insightHash}
                        </span>
                        <CopyButton value={entry.insightHash} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
