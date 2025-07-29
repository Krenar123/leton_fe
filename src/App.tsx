
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import ActionPlanPage from "./pages/ActionPlanPage";
import FinancialsPage from "./pages/FinancialsPage";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import TeamMember from "./pages/TeamMember";
import Clients from "./pages/Clients";
import ClientPage from "./pages/ClientPage";
import Suppliers from "./pages/Suppliers";
import SupplierPage from "./pages/SupplierPage";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/projects/:id/action-plan" element={<ActionPlanPage />} />
            <Route path="/projects/:id/financials" element={<FinancialsPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="/team/:id" element={<TeamMember />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientPage />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/suppliers/:id" element={<SupplierPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
