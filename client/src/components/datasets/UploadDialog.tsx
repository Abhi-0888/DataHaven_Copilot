import { useState, useRef } from "react";
import { X, UploadCloud, FileType, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadDataset } from "@/hooks/use-datasets";
import { useToast } from "@/hooks/use-toast";

interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadDialog({ isOpen, onClose }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadMutation = useUploadDataset();
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !name) return;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("description", description);
    
    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Dataset Uploaded",
          description: "Your dataset has been securely uploaded and indexed.",
        });
        setFile(null);
        setName("");
        setDescription("");
        onClose();
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: err.message,
        });
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl glass-panel rounded-3xl p-8 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display font-bold mb-2">Upload Dataset</h2>
            <p className="text-muted-foreground mb-8">Securely upload and index your data for Copilot analysis.</p>

            <div className="space-y-6">
              {!file ? (
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    accept=".csv,.json,.txt"
                  />
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Click or drag file to upload</h3>
                  <p className="text-sm text-muted-foreground">Supports CSV, JSON, TXT up to 50MB</p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <FileType className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-medium">{file.name}</h4>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Dataset Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g., Q3 Customer Behavior Analytics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-24"
                    placeholder="Describe the contents of this dataset..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleUpload}
                  disabled={!file || !name || uploadMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {uploadMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Index Dataset
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
