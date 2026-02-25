import { useState } from "react";
import { useDatasets, useSystemEvents } from "@/hooks/use-datasets";
import { AppLayout } from "@/components/layout/AppLayout";
import { EventLogTable } from "@/components/EventLogTable";
import { ScrollText, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Audit() {
    const { data: datasets } = useDatasets();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);

    const activeId = selectedId ?? datasets?.[0]?.id ?? null;
    const { data: events, isLoading } = useSystemEvents(activeId ?? 0);
    const activeDataset = datasets?.find((d: any) => d.id === activeId);

    return (
        <AppLayout>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold mb-1 text-gradient inline-block">
                        Audit Log
                    </h1>
                    <p className="text-muted-foreground">Complete system event history for compliance and traceability.</p>
                </div>
                {datasets && datasets.length > 0 && (
                    <div className="relative">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                        >
                            <ScrollText className="w-4 h-4 text-primary" />
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

            {events && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display">{events.length}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total Events</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display text-blue-400">
                            {new Set(events.map((e: any) => e.eventType)).size}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Event Types</div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold font-display text-violet-400">
                            {new Set(events.map((e: any) => e.actor)).size}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Actors</div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white/5" />
            ) : (
                <EventLogTable events={events ?? []} />
            )}
        </AppLayout>
    );
}
