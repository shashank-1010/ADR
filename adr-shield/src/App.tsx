import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import DrugsList from "@/pages/drugs";
import DrugDetail from "@/pages/drug-detail";
import Interactions from "@/pages/interactions";
import SymptomsPredictor from "@/pages/symptoms";
import AdrReportForm from "@/pages/adr-report";
import Chatbot from "@/pages/chatbot";
import DoctorMode from "@/pages/doctor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/drugs" component={DrugsList} />
        <Route path="/drugs/:id" component={DrugDetail} />
        <Route path="/interactions" component={Interactions} />
        <Route path="/symptoms" component={SymptomsPredictor} />
        <Route path="/adr-report" component={AdrReportForm} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/doctor" component={DoctorMode} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
