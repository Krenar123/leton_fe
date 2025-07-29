
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Activity, CheckCircle, Menu } from "lucide-react";
import { JobProfitabilityDialog } from "./JobProfitabilityDialog";
import { ActiveTasksDialog } from "./ActiveTasksDialog";

export const DashboardOverviewCards = () => {
  const navigate = useNavigate();
  const [isProfitabilityDialogOpen, setIsProfitabilityDialogOpen] = useState(false);
  const [isActiveTasksDialogOpen, setIsActiveTasksDialogOpen] = useState(false);

  // Mock data - in a real app, this would come from your data source
  const overviewData = {
    activeProjects: 4,
    overallProfitability: 17.3,
    profitabilityTrend: "up",
    activeTasks: 23
  };
  const handleProjectsClick = () => {
    navigate('/projects');
  };
  const handleProfitabilityClick = () => {
    setIsProfitabilityDialogOpen(true);
  };
  const handleActiveTasksClick = () => {
    setIsActiveTasksDialogOpen(true);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Projects */}
        <Card onClick={handleProjectsClick} className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer my-0 py-[8px] relative">
          <CardContent className="p-6 text-center py-0">
            <div className="flex items-center justify-center mb-3">
              <Activity className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Active Projects</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{overviewData.activeProjects}</div>
          </CardContent>
          <Menu 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer" 
            style={{ color: '#0a1f44' }}
          />
        </Card>

        {/* Overall Job Profitability */}
        <Card onClick={handleProfitabilityClick} className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer px-0 my-0 py-[8px] relative">
          <CardContent className="p-6 text-center py-0">
            <div className="flex items-center justify-center mb-3">
              {overviewData.profitabilityTrend === "up" ? <TrendingUp className="w-5 h-5 mr-2 text-muted-foreground" /> : <TrendingDown className="w-5 h-5 mr-2 text-muted-foreground" />}
              <span className="text-sm font-medium text-muted-foreground">Job Profitability</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{overviewData.overallProfitability}%</div>
          </CardContent>
          <Menu 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer" 
            style={{ color: '#0a1f44' }}
          />
        </Card>

        {/* Active Tasks */}
        <Card onClick={handleActiveTasksClick} className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer my-0 py-[8px] relative">
          <CardContent className="p-6 text-center py-0">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Active Tasks</span>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">{overviewData.activeTasks}</div>
          </CardContent>
          <Menu 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer" 
            style={{ color: '#0a1f44' }}
          />
        </Card>
      </div>

      {/* Dialogs */}
      <JobProfitabilityDialog isOpen={isProfitabilityDialogOpen} onClose={() => setIsProfitabilityDialogOpen(false)} />
      <ActiveTasksDialog isOpen={isActiveTasksDialogOpen} onClose={() => setIsActiveTasksDialogOpen(false)} />
    </>
  );
};
