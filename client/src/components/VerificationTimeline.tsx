import { format } from "date-fns";
import { motion } from "framer-motion";
import {
    Upload, CheckCircle2, BarChart2, Link2, Database, AlertCircle
} from "lucide-react";

interface TimelineEvent {
    id: number;
    datasetId: number;
    eventType: string;
    metadata: any;
    createdAt: string;
}

interface VerificationTimelineProps {
    events: TimelineEvent[];
}

const eventConfig: Record<string, { icon: any; color: string; label: string }> = {
    UPLOAD: { icon: Upload, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", label: "Dataset Uploaded" },
    ANALYZED: { icon: BarChart2, color: "text-violet-400 bg-violet-500/10 border-violet-500/20", label: "AI Analysis Complete" },
    VERIFIED: { icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Verified on Chain" },
    BLOCKCHAIN_REGISTERED: { icon: Link2, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", label: "Registered on Blockchain" },
    DATASET_CREATED: { icon: Database, color: "text-primary bg-primary/10 border-primary/20", label: "Dataset Created" },
};

export function VerificationTimeline({ events }: VerificationTimelineProps) {
    if (events.length === 0) {
        return (
            <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-white/10">
                <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No timeline events yet.</p>
            </div>
        );
    }

    const sorted = [...events].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return (
        <div className="relative pl-6">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent" />

            <div className="space-y-6">
                {sorted.map((event, i) => {
                    const cfg = eventConfig[event.eventType] ?? {
                        icon: AlertCircle,
                        color: "text-muted-foreground bg-white/5 border-white/10",
                        label: event.eventType,
                    };
                    const Icon = cfg.icon;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="relative flex gap-4 items-start"
                        >
                            {/* Dot */}
                            <div className={`absolute -left-6 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${cfg.color}`}>
                                <Icon className="w-3.5 h-3.5" />
                            </div>

                            {/* Card */}
                            <div className="flex-1 glass-panel p-4 rounded-xl ml-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-sm">{cfg.label}</p>
                                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                                            <p className="text-xs text-muted-foreground font-mono mt-1 truncate max-w-xs">
                                                {Object.entries(event.metadata)
                                                    .map(([k, v]) => `${k}: ${v}`)
                                                    .join(" · ")}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {format(new Date(event.createdAt), "MMM d, HH:mm")}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
