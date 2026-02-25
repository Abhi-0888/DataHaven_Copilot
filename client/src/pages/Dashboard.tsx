import { useState } from "react";
import { Plus, Search, Layers, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { DatasetCard } from "@/components/datasets/DatasetCard";
import { UploadDialog } from "@/components/datasets/UploadDialog";
import { useDatasets } from "@/hooks/use-datasets";

export default function Dashboard() {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { data: datasets, isLoading, isError, refetch } = useDatasets();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2 text-gradient inline-block">Data Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage and analyze your verified datasets.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => refetch()}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Upload Dataset
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-panel h-[320px] rounded-2xl animate-pulse bg-white/5" />
          ))}
        </div>
      ) : isError ? (
        <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-destructive/20 text-destructive rounded-full flex items-center justify-center mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to load datasets</h2>
          <p className="text-muted-foreground mb-6">There was an error communicating with the network.</p>
          <button 
            onClick={() => refetch()}
            className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : datasets?.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-white/10 bg-black/20">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Database className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">No Datasets Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven't uploaded any datasets yet. Upload your first dataset to start generating insights and analyzing data with Copilot.
          </p>
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-foreground px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload Your First Dataset
          </button>
        </div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {datasets?.map((dataset) => (
            <motion.div key={dataset.id} variants={item}>
              <DatasetCard dataset={dataset} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <UploadDialog isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </AppLayout>
  );
}
