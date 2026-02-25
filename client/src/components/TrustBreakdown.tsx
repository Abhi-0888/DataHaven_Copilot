import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface TrustBreakdownProps {
    completeness: number;
    freshness: number;
    consistency: number;
    schema: number;
    verification: number;
    total: number;
}

const metrics = [
    { key: "completeness", label: "Completeness", weight: "30%", color: "from-violet-500 to-purple-600" },
    { key: "freshness", label: "Freshness", weight: "25%", color: "from-blue-500 to-cyan-500" },
    { key: "consistency", label: "Consistency", weight: "20%", color: "from-emerald-500 to-teal-500" },
    { key: "schema", label: "Schema Validity", weight: "15%", color: "from-amber-500 to-orange-500" },
    { key: "verification", label: "Verification", weight: "10%", color: "from-pink-500 to-rose-500" },
] as const;

export function TrustBreakdown({ completeness, freshness, consistency, schema, verification, total }: TrustBreakdownProps) {
    const values: Record<string, number> = { completeness, freshness, consistency, schema, verification };

    const getColor = (score: number) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-amber-400";
        return "text-rose-400";
    };

    return (
        <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Trust Score Breakdown
                </h3>
                <div className={`text-3xl font-display font-bold ${getColor(total)}`}>
                    {total.toFixed(1)}
                    <span className="text-base text-muted-foreground font-normal ml-1">/ 100</span>
                </div>
            </div>

            <div className="space-y-4">
                {metrics.map((metric) => {
                    const score = values[metric.key] ?? 0;
                    return (
                        <div key={metric.key}>
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{metric.label}</span>
                                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                        Weight: {metric.weight}
                                    </span>
                                </div>
                                <span className={`text-sm font-bold font-mono ${getColor(score)}`}>{score.toFixed(1)}</span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(score, 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${metric.color} shadow-lg`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Weighted formula note */}
            <div className="pt-3 border-t border-white/5 text-xs text-muted-foreground font-mono">
                Trust = 0.3×C + 0.25×F + 0.2×Co + 0.15×S + 0.1×V
            </div>
        </div>
    );
}
