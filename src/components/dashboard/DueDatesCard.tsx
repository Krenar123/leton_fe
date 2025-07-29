
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Calendar, TrendingUp, Menu } from "lucide-react";
import { DueDatesDialog } from "./DueDatesDialog";

export const DueDatesCard = () => {
  const navigate = useNavigate();
  const [isDueDatesDialogOpen, setIsDueDatesDialogOpen] = useState(false);

  // Mock data for upcoming due dates
  const upcomingDueDates = [
    {
      id: 1,
      projectName: "Office Building Renovation",
      taskName: "Final documentation",
      startDate: "2025-07-10",
      dueDate: "2025-07-15",
      endDate: "2025-07-30",
      assignees: ["Anna", "Tom"],
      daysLeft: 7,
      status: "urgent"
    },
    {
      id: 2,
      projectName: "Residential Complex",
      taskName: "Quality inspection",
      startDate: "2025-07-12",
      dueDate: "2025-07-20",
      endDate: "2025-07-25",
      assignees: ["David"],
      daysLeft: 12,
      status: "warning"
    },
    {
      id: 3,
      projectName: "Hospital Wing",
      taskName: "Material procurement",
      startDate: "2025-07-15",
      dueDate: "2025-07-25",
      endDate: "2025-08-15",
      assignees: ["Mike", "Lisa"],
      daysLeft: 17,
      status: "normal"
    },
    {
      id: 4,
      projectName: "Shopping Center",
      taskName: "Construction phase 1",
      startDate: "2025-07-20",
      dueDate: "2025-07-30",
      endDate: "2025-12-30",
      assignees: ["John", "Sarah"],
      daysLeft: 22,
      status: "normal"
    },
    {
      id: 5,
      projectName: "Corporate Headquarters",
      taskName: "Client handover",
      startDate: "2025-07-25",
      dueDate: "2025-08-05",
      endDate: "2025-08-05",
      assignees: ["John", "Sarah", "Mike"],
      daysLeft: 28,
      status: "normal"
    }
  ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const handleCardClick = () => {
    setIsDueDatesDialogOpen(true);
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <>
      <Card 
        className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all h-full"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Next Key Due Dates
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-300">
              <span>5 upcoming tasks</span>
            </div>
            <Menu className="w-4 h-4 text-white cursor-pointer" />
          </div>
        </div>
        
        <div className="space-y-3">
          {upcomingDueDates.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0 hover:bg-slate-700/50 rounded px-2 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleProjectClick(item.id);
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-white mb-1">{item.taskName}</div>
                <div className="text-xs text-slate-400 truncate">{item.projectName}</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-300 mb-1">Start: {formatDate(item.startDate)}</div>
                <div className="text-xs text-slate-300">Due: {formatDate(item.dueDate)}</div>
              </div>
              <div className="flex-1 text-right">
                <span className="text-xs text-slate-400">
                  {item.assignees.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Dialog */}
      <DueDatesDialog 
        isOpen={isDueDatesDialogOpen} 
        onClose={() => setIsDueDatesDialogOpen(false)} 
      />
    </>
  );
};
