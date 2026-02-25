import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Dashboard from "./pages/Dashboard";
import DatasetDetails from "./pages/DatasetDetails";
import Verification from "./pages/Verification";
import Ledger from "./pages/Ledger";
import Lineage from "./pages/Lineage";
import Audit from "./pages/Audit";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/datasets/:id" component={DatasetDetails} />
      <Route path="/verification" component={Verification} />
      <Route path="/ledger" component={Ledger} />
      <Route path="/lineage" component={Lineage} />
      <Route path="/audit" component={Audit} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
