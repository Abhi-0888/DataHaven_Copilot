import { useState } from "react";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { 
  Database, ShieldCheck, Activity, FileText, Send, 
  Sparkles, Link2, Download, BarChart2, Bot, Info, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

import { AppLayout } from "@/components/layout/AppLayout";
import { useDataset, useDatasetReport, useAnalyzeDataset } from "@/hooks/use-datasets";
import { useCopilotQuery } from "@/hooks/use-copilot";
import { useRegisterBlockchain, useVerifyBlockchain } from "@/hooks/use-blockchain";
import { useToast } from "@/hooks/use-toast";

type Tab = "overview" | "analysis" | "copilot";

export default function DatasetDetails() {
  const [, params] = useRoute("/datasets/:id");
  const datasetId = Number(params?.id);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'copilot', content: string}[]>([]);
  
  const { data: dataset, isLoading } = useDataset(datasetId);
  const { data: report, isLoading: isReportLoading } = useDatasetReport(datasetId);
  
  const analyzeMutation = useAnalyzeDataset();
  const copilotMutation = useCopilotQuery();
  const registerMutation = useRegisterBlockchain();
  const { toast } = useToast();

  const handleAnalyze = () => {
    analyzeMutation.mutate(datasetId, {
      onSuccess: () => {
        toast({ title: "Analysis Complete", description: "Copilot has finished analyzing the dataset." });
        setActiveTab("analysis");
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Analysis Failed", description: err.message });
      }
    });
  };

  const handleRegister = () => {
    registerMutation.mutate(datasetId, {
      onSuccess: (data) => {
        toast({ 
          title: "Registered on Blockchain", 
          description: `Tx Hash: ${data.txHash.substring(0, 16)}...` 
        });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Registration Failed", description: err.message });
      }
    });
  };

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || copilotMutation.isPending) return;

    const userQuery = query;
    setChatHistory(prev => [...prev, { role: 'user', content: userQuery }]);
    setQuery("");

    copilotMutation.mutate({ datasetId, query: userQuery }, {
      onSuccess: (data) => {
        setChatHistory(prev => [...prev, { role: 'copilot', content: data.answer }]);
      },
      onError: (err) => {
        setChatHistory(prev => [...prev, { role: 'copilot', content: `Error: ${err.message}` }]);
      }
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!dataset) {
    return (
      <AppLayout>
        <div className="glass-panel p-12 text-center rounded-2xl">
          <h2 className="text-2xl font-bold mb-2">Dataset Not Found</h2>
          <p className="text-muted-foreground">The dataset you are looking for does not exist or has been removed.</p>
        </div>
      </AppLayout>
    );
  }

  const isVerified = dataset.trustScore > 0.8;
  const mockChartData = [
    { name: 'Row 1', value: 400 }, { name: 'Row 2', value: 300 },
    { name: 'Row 3', value: 550 }, { name: 'Row 4', value: 200 },
    { name: 'Row 5', value: 700 }, { name: 'Row 6', value: 450 },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 shadow-lg shadow-primary/10">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">{dataset.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5 text-foreground">
                  {isVerified ? (
                    <ShieldCheck className="w-4 h-4 text-success" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-yellow-500" />
                  )}
                  {(dataset.trustScore * 100).toFixed(0)}% Trust Score
                </span>
                <span className="font-mono bg-white/5 px-2 py-1 rounded-md">ID: {dataset.id}</span>
                <span>Created {format(new Date(dataset.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleRegister}
              disabled={registerMutation.isPending}
              className="bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-foreground px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {registerMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Link2 className="w-4 h-4" />}
              Register on Chain
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {analyzeMutation.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles className="w-4 h-4" />}
              Analyze with AI
            </button>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-px">
          {(["overview", "analysis", "copilot"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-3 font-medium text-sm capitalize transition-colors relative
                ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}
              `}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> About Dataset
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {dataset.description || "No detailed description was provided for this dataset. Run an AI analysis to automatically generate metadata and summaries."}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-6 rounded-2xl">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Blockchain Verification</h4>
                    <div className="space-y-4 font-mono text-sm">
                      <div>
                        <div className="text-muted-foreground/70 mb-1">Owner Wallet</div>
                        <div className="truncate text-primary">{dataset.ownerWallet}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground/70 mb-1">File Hash (SHA-256)</div>
                        <div className="truncate bg-black/40 px-2 py-1 rounded border border-white/5">{dataset.fileHash}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground/70 mb-1">Metadata Hash</div>
                        <div className="truncate bg-black/40 px-2 py-1 rounded border border-white/5">{dataset.metadataHash}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-2xl flex flex-col">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">System Stats</h4>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Storage ID</span>
                        <span className="font-mono">{dataset.storageId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Version</span>
                        <span className="bg-white/10 px-2 py-1 rounded-md text-xs font-bold">v{dataset.version}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">AI Report Hash</span>
                        <span className="font-mono text-xs truncate w-24">{dataset.aiReportHash}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-primary">
                  <h3 className="text-lg font-bold mb-6">Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <span className="flex items-center gap-3 font-medium"><Download className="w-5 h-5 text-muted-foreground group-hover:text-primary" /> Download Source</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <span className="flex items-center gap-3 font-medium"><FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary" /> View Raw Metadata</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-card to-primary/5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">Copilot Ready</h3>
                  <p className="text-sm text-muted-foreground mb-4">Chat with your data using our advanced LLM models specifically tuned for data science.</p>
                  <button onClick={() => setActiveTab("copilot")} className="w-full py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-colors">
                    Start Chatting
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="space-y-6">
              {isReportLoading ? (
                 <div className="glass-panel h-64 rounded-2xl animate-pulse bg-white/5 flex items-center justify-center text-muted-foreground">Loading Analysis...</div>
              ) : !report ? (
                 <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-2 border-white/10">
                   <BarChart2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                   <h3 className="text-xl font-bold mb-2">No Analysis Available</h3>
                   <p className="text-muted-foreground mb-6">Run AI analysis to generate statistics and insights.</p>
                   <button onClick={handleAnalyze} className="px-6 py-2 bg-primary text-white rounded-xl">Run Analysis Now</button>
                 </div>
              ) : (
                <>
                  <div className="glass-panel p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> AI Summary
                    </h3>
                    <p className="text-foreground text-lg leading-relaxed border-l-2 border-primary pl-4 py-1 bg-gradient-to-r from-primary/5 to-transparent">
                      {report.analysis?.summary || "Analysis summary will appear here."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="font-bold mb-6">Data Distribution (Sample)</h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={mockChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                            <XAxis dataKey="name" stroke="#ffffff50" />
                            <YAxis stroke="#ffffff50" />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10' }} />
                            <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl">
                      <h3 className="font-bold mb-6">Key Insights</h3>
                      <div className="space-y-4">
                        {report.insights.length > 0 ? report.insights.map((insight) => (
                          <div key={insight.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                              <Sparkles className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <p className="text-foreground font-medium mb-1">{insight.text}</p>
                              <div className="text-xs font-mono text-muted-foreground">Confidence: {(insight.confidence * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                        )) : (
                          <div className="p-4 rounded-xl bg-black/40 text-muted-foreground text-center">No deep insights generated yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "copilot" && (
            <div className="glass-panel rounded-2xl flex flex-col h-[600px] border border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">DataHeaven Copilot</h3>
                    <p className="text-xs text-success">Online & Ready</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-black/20">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-50">
                    <Bot className="w-16 h-16 mb-4 text-primary" />
                    <h4 className="text-xl font-display font-bold mb-2">How can I help you analyze this data?</h4>
                    <p className="text-sm">Ask questions about trends, anomalies, or request specific aggregations based on the indexed dataset.</p>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white/10' : 'bg-primary'}`}>
                        {msg.role === 'user' ? <span className="font-bold text-xs">U</span> : <Bot className="w-5 h-5 text-white" />}
                      </div>
                      <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary/20 text-primary-foreground rounded-tr-sm' : 'bg-white/10 text-foreground rounded-tl-sm'}`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))
                )}
                {copilotMutation.isPending && (
                  <div className="flex gap-4 max-w-[80%]">
                     <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white/10 rounded-tl-sm flex items-center gap-2">
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-200" />
                      </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-black/40 border-t border-white/5">
                <form onSubmit={handleQuery} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Copilot about this dataset..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!query.trim() || copilotMutation.isPending}
                    className="absolute right-2 top-2 bottom-2 w-10 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
}

// Dummy ChevronRight for component file
function ChevronRight({ className }: { className?: string }) {
  return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
