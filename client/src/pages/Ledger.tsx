import { useState } from "react";
import { useDatasets, useLedger } from "@/hooks/use-datasets";
import { AppLayout } from "@/components/layout/AppLayout";
import { MemoryLedger } from "@/components/MemoryLedger";
import { Brain, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Ledger() {
    const { data: datasets, isLoading: dsLoading } = useDatasets();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const activeId = selectedId ?? datasets?.[0]?.id ?? null;
    const { data: ledger, isLoading } = useLedger(activeId ?? 0);
    const activeDataset = datasets?.find((d: any) => d.id === activeId);

    return (
        <AppLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1 text-gradient inline-block">
                        AI Memory Ledger
                    </h1>
                    <p className="text-muted-foreground">Immutable record of AI-generated insights with cryptographic proofs.</p>
                </div>
                {datasets && datasets.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                        >
                            <Brain className="w-4 h-4 text-primary" />
                            {activeDataset?.name ?? "Select dataset"}
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute right-0 top-full mt-2 w-64 glass-panel rounded-xl border border-white/10 z-50 overflow-hidden"
                                >
                                    {datasets.map((d: any) => (
                                        <button
                                            key={d.id}
                                            onClick={() => { setSelectedId(d.id); setOpen(false); }}
                                            className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors"
                                        >
                                            {d.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Stats bar */}
            {ledger && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display">{ledger.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Entries</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display text-emerald-400">
                            {ledger.filter((e: any) => e.verified).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Verified</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display text-primary">
                            {new Set(ledger.map((e: any) => e.datasetVersion)).size}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Versions Covered</div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-panel h-32 rounded-2xl animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : (
                <MemoryLedger entries={ledger ?? []} />
            )}
        </AppLayout>
    );
}
