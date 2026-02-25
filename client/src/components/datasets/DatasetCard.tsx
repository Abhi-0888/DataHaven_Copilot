import { Link } from "wouter";
import { format } from "date-fns";
import { Database, ShieldCheck, Activity, ChevronRight } from "lucide-react";
import type { Dataset } from "@shared/schema";

interface DatasetCardProps {
  dataset: Dataset;
}

export function DatasetCard({ dataset }: DatasetCardProps) {
  const trustColor = dataset.trustScore > 0.8 ? "text-success" : dataset.trustScore > 0.5 ? "text-yellow-400" : "text-destructive";

  return (
    <div className="glass-panel rounded-2xl p-6 hover-glow flex flex-col h-full group transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/5">
          <Database className="w-6 h-6 text-primary" />
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5">
          <ShieldCheck className={`w-4 h-4 ${trustColor}`} />
          <span className="text-xs font-mono font-medium">{(dataset.trustScore * 100).toFixed(0)}% Trust</span>
        </div>
      </div>

      <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {dataset.name}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
        {dataset.description || "No description provided."}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs font-mono bg-black/20 rounded-lg px-3 py-2 border border-white/5">
          <span className="text-muted-foreground">HASH</span>
          <span className="text-foreground truncate w-32 text-right">{dataset.fileHash.substring(0, 12)}...</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3" /> Updated
          </span>
          <span className="text-foreground">{format(new Date(dataset.updatedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <Link 
        href={`/datasets/${dataset.id}`}
        className="w-full bg-white/5 hover:bg-primary text-foreground hover:text-white border border-white/10 hover:border-primary py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
      >
        View Details <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
