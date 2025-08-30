import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type AnyActionItem = {
  task?: string;                  // camel
  title?: string;                 // snake payload often has "title"
  startDate?: string | null;
  endDate?: string | null;
  start_date?: string | null;     // snake-friendly
  end_date?: string | null;       // snake-friendly
  assignees?: string[];
  participants?: string[];        // sometimes "participants" from BE
  completed?: boolean;
  status?: string;                // "completed" | "pending" | ...
};

interface ActionPlanCardProps {
  actionItems: AnyActionItem[];
  completedObjectives: number;
  totalObjectives: number;
  onClick: () => void;
}

export const ActionPlanCard = ({
  actionItems,
  completedObjectives,
  totalObjectives,
  onClick,
}: ActionPlanCardProps) => {
  const parseDate = (s?: string | null) => (s ? new Date(s) : null);
  const fmt = (s?: string | null) => {
    const d = parseDate(s);
    return d ? d.toLocaleDateString("en-GB") : "-";
  };

  // Normalize each item to a unified shape the card uses
  const normalized = (actionItems || []).map((i) => {
    const start = i.startDate ?? i.start_date ?? null;
    const end = i.endDate ?? i.end_date ?? null;
    const name = i.task ?? i.title ?? "Untitled";
    const people = Array.isArray(i.assignees)
      ? i.assignees
      : Array.isArray(i.participants)
      ? i.participants
      : [];
    const isDone =
      (typeof i.status === "string" && i.status.toLowerCase() === "completed") ||
      i.completed === true;

    return {
      task: name,
      startDate: start,
      endDate: end,
      assignees: people,
      done: isDone,
    };
  });

  // Sort by nearest due date; missing endDate goes to bottom
  const sortedActionItems = normalized.sort((a, b) => {
    const aT = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
    const bT = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;
    return aT - bT;
  });

  const totalTasks = normalized.length;
  const completedTasks = normalized.filter((i) => i.done).length;

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
        {sortedActionItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0"
          >
            <div className="flex-1 min-w-0">
              <span className="font-medium text-sm">{item.task}</span>
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs text-slate-300 mb-1">Start: {fmt(item.startDate)}</div>
              <div className="text-xs text-slate-300">Due: {fmt(item.endDate)}</div>
            </div>
            <div className="flex-1 text-right">
              <span className="text-xs text-slate-400">{(item.assignees || []).join(", ")}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
