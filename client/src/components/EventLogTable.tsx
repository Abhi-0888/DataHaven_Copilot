import { format } from "date-fns";
import { motion } from "framer-motion";
import { Activity, Database, Cpu, Link2, AlertCircle } from "lucide-react";

interface SystemEvent {
    id: number;
    datasetId: number;
    eventType: string;
    actor: string;
    metadata: any;
    createdAt: string;
}

interface EventLogTableProps {
    events: SystemEvent[];
}

const typeConfig: Record<string, { color: string; icon: any }> = {
    DATASET_CREATED: { color: "text-blue-400 bg-blue-500/10", icon: Database },
    ANALYSIS_RUN: { color: "text-violet-400 bg-violet-500/10", icon: Cpu },
    BLOCKCHAIN_REGISTERED: { color: "text-emerald-400 bg-emerald-500/10", icon: Link2 },
};

export function EventLogTable({ events }: EventLogTableProps) {
    if (events.length === 0) {
        return (
            <div className="glass-panel p-10 rounded-2xl text-center border-dashed border-2 border-white/10">
                <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No system events recorded yet.</p>
            </div>
        );
    }

    const sorted = [...events].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                            <th className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Event</th>
                            <th className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Actor</th>
                            <th className="text-left px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Metadata</th>
                            <th className="text-right px-5 py-3.5 text-muted-foreground font-medium text-xs uppercase tracking-wider">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sorted.map((event, i) => {
                            const cfg = typeConfig[event.eventType] ?? {
                                color: "text-muted-foreground bg-white/5",
                                icon: AlertCircle,
                            };
                            const Icon = cfg.icon;
                            return (
                                <motion.tr
                                    key={event.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="hover:bg-white/3 transition-colors"
                                >
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                            {event.eventType.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{event.actor}</td>
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-xs truncate font-mono">
                                        {event.metadata ? JSON.stringify(event.metadata) : "—"}
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-muted-foreground text-right whitespace-nowrap">
                                        {format(new Date(event.createdAt), "MMM d, HH:mm:ss")}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
