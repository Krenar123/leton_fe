import { ReactNode, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Bot, PlayCircle, Plus } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoButton } from "./common/LogoButton";
import { useProjectData } from "@/hooks/useProjectData";
import { useClientData } from "@/hooks/useClientData";
import { useSupplierData } from "@/hooks/useSupplierData";
import { AIChatDialog } from "./common/AIChatDialog";
import { TutorialVideosDialog } from "./common/TutorialVideosDialog";
import { QuickActionsDialog } from "./common/QuickActionsDialog";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({
  children
}: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Get current page context
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/projects/') && params.id) {
      const {
        project
      } = useProjectData(params.id);
      return project ? `Project: ${project.name}` : 'Project';
    }
    if (path.startsWith('/clients/') && params.id) {
      const {
        client
      } = useClientData(params.id);
      return client ? `Client: ${client.company}` : 'Client';
    }
    if (path.startsWith('/suppliers/') && params.id) {
      const {
        supplier
      } = useSupplierData(params.id);
      return supplier ? `Supplier: ${supplier.company}` : 'Supplier';
    }
    if (path === '/') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path === '/clients') return 'Clients';
    if (path === '/suppliers') return 'Suppliers';
    if (path === '/calendar') return 'Calendar';
    if (path === '/team') return 'Team';
    if (path === '/reports') return 'Reports';
    if (path === '/settings') return 'Profile';
    if (path.startsWith('/projects/') && path.includes('/financials')) return 'Project Financials';
    if (path.startsWith('/projects/') && path.includes('/action-plan')) return 'Action Plan';
    if (path.startsWith('/team/')) return 'Team Member';
    return 'Leton';
  };

  return <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          {/* Header */}
          <header className="h-14 border-b bg-background flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <SidebarTrigger />
              <Button variant="ghost" size="icon" onClick={handleBackClick} className="hover:bg-accent">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="text-sm font-medium text-foreground">
                {getCurrentPageTitle()}
              </div>
            </div>
            
            {/* Center - Quick Actions Button */}
            <div className="flex-1 flex justify-center">
              <Button onClick={() => setIsQuickActionsOpen(true)} className="bg-[#d9a44d] hover:bg-[#c7933e] text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-3 h-3 text-[#d9a44d] font-bold" />
                </div>
                <span className="font-medium">Quick Actions</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-3 px-0 py-0 mx-0 my-0">
              <Button onClick={() => setIsAIChatOpen(true)} className="bg-[#d9a44d] hover:bg-[#c7933e] text-white px-3 py-2 rounded-md flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <span className="font-medium">AI</span>
              </Button>
              
              <Button size="icon" onClick={() => setIsTutorialOpen(true)} className="bg-[#d9a44d] hover:bg-[#c7933e] text-white rounded-md">
                <PlayCircle className="w-5 h-5" />
              </Button>
              
              <LogoButton />
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Dialogs */}
      <AIChatDialog isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      
      <TutorialVideosDialog isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
      
      <QuickActionsDialog isOpen={isQuickActionsOpen} onClose={() => setIsQuickActionsOpen(false)} />
    </SidebarProvider>;
};
