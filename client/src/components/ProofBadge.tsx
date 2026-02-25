import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

interface ProofBadgeProps {
    network?: string;
    verified?: boolean;
    size?: "sm" | "lg";
}

export function ProofBadge({ network = "DataHaven Testnet", verified = true, size = "sm" }: ProofBadgeProps) {
    if (!verified) {
        return (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                Unverified
            </span>
        );
    }

    if (size === "lg") {
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-3 overflow-hidden"
            >
                {/* Shimmer */}
                <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 3 }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent skew-x-12"
                />
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        Proof Verified
                    </div>
                    <div className="text-xs text-emerald-400/70">{network}</div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full overflow-hidden"
        >
            <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 4 }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent skew-x-12"
            />
            <ShieldCheck className="w-3.5 h-3.5" />
            {network}
        </motion.span>
    );
}
