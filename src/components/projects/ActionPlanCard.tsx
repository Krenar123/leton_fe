
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ActionItem {
  task: string;
  startDate: string;
  endDate: string;
  assignees: string[];
  completed: boolean;
}

interface ActionPlanCardProps {
  actionItems: ActionItem[];
  completedObjectives: number;
  totalObjectives: number;
  onClick: () => void;
}

export const ActionPlanCard = ({ 
  actionItems, 
  completedObjectives, 
  totalObjectives, 
  onClick 
}: ActionPlanCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Sort action items by due date (nearest first)
  const sortedActionItems = [...actionItems].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  // Calculate completed tasks
  const completedTasks = actionItems.filter(item => item.completed).length;
  const totalTasks = actionItems.length;

  return (
    <Card 
      className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Action Plan
        </h3>
        <div className="flex space-x-4 text-sm text-slate-300">
          <span>Objectives {completedObjectives}/{totalObjectives}</span>
          <span>Tasks {completedTasks}/{totalTasks}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {sortedActionItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0">
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm">{item.task}</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs text-slate-300 mb-1">Start: {formatDate(item.startDate)}</div>
              <div className="text-xs text-slate-300">Due: {formatDate(item.endDate)}</div>
            </div>
            <div className="flex-1 text-right">
              <span className="text-xs text-slate-400">
                {(item.assignees || []).join(", ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
