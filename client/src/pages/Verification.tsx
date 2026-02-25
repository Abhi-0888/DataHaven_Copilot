import { useDatasets, useTimeline, useTrustBreakdown, useStorageProof } from "@/hooks/use-datasets";
import { AppLayout } from "@/components/layout/AppLayout";
import { VerificationTimeline } from "@/components/VerificationTimeline";
import { ProofBadge } from "@/components/ProofBadge";
import { TrustBreakdown } from "@/components/TrustBreakdown";
import { useState } from "react";
import { Shield, RefreshCw, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Verification() {
    const { data: datasets, isLoading } = useDatasets();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const activeId = selectedId ?? datasets?.[0]?.id ?? null;
    const { data: timeline, isLoading: tlLoading } = useTimeline(activeId ?? 0);
    const { data: trust } = useTrustBreakdown(activeId ?? 0);
    const { data: proof } = useStorageProof(activeId ?? 0);
    const activeDataset = datasets?.find((d: any) => d.id === activeId);

    return (
        <AppLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1 text-gradient inline-block">
                        Verification
                    </h1>
                    <p className="text-muted-foreground">DataHaven Testnet lifecycle & proof verification.</p>
                </div>
                {datasets && datasets.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                        >
                            <Shield className="w-4 h-4 text-primary" />
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

            {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="glass-panel h-64 rounded-2xl animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : !activeId ? (
                <div className="glass-panel p-16 rounded-2xl text-center border-dashed border-2 border-white/10">
                    <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No Datasets</h2>
                    <p className="text-muted-foreground">Upload a dataset to see verification data.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Storage Proof Panel */}
                        {proof && (
                            <div className="glass-panel p-6 rounded-2xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">Storage Proof</h3>
                                    <ProofBadge size="lg" network={proof.network} verified={proof.verified} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">MERKLE ROOT</div>
                                        <div className="font-mono text-xs truncate">{proof.merkleRoot}</div>
                                    </div>
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                        <div className="text-xs text-muted-foreground mb-1 font-mono">PROOF ID</div>
                                        <div className="font-mono text-xs truncate">{proof.proofId}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground mb-2 font-mono">STORAGE NODES</div>
                                    <div className="flex flex-wrap gap-2">
                                        {proof.storageNodes?.map((node: string, i: number) => (
                                            <span key={i} className="text-xs font-mono bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
                                                {node}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 text-primary" />
                                Verification Timeline
                            </h3>
                            {tlLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-16 rounded-xl animate-pulse bg-white/5" />
                                    ))}
                                </div>
                            ) : (
                                <VerificationTimeline events={timeline ?? []} />
                            )}
                        </div>
                    </div>

                    {/* Trust Breakdown */}
                    <div>
                        {trust ? (
                            <TrustBreakdown
                                completeness={trust.completeness}
                                freshness={trust.freshness}
                                consistency={trust.consistency}
                                schema={trust.schema}
                                verification={trust.verification}
                                total={trust.total}
                            />
                        ) : (
                            <div className="glass-panel p-6 rounded-2xl animate-pulse bg-white/5 h-64" />
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
