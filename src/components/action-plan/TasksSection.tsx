
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Task } from "@/types/task";
import { Objective } from "@/types/objective";
import { TasksTable } from "./TasksTable";
import { TasksFilter } from "./TasksFilter";

interface TasksSectionProps {
  tasks: Task[];
  selectedObjective: Objective | undefined;
  selectedObjectiveId: string | null;
  completedTasks: number;
  totalTasks: number;
  searchValue: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onFilterChange: (filters: {
    title?: string;
    status?: string;
    participant?: string;
  }) => void;
  onSearchChange: (search: string) => void;
  onAddTask: () => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TasksSection = ({
  tasks,
  selectedObjective,
  selectedObjectiveId,
  completedTasks,
  totalTasks,
  searchValue,
  onEditTask,
  onDeleteTask,
  onFilterChange,
  onSearchChange,
  onAddTask,
  onStatusChange
}: TasksSectionProps) => {
  return (
    <Card className="p-6 bg-white border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {completedTasks}/{totalTasks}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10 w-48"
            />
          </div>
          <TasksFilter onFilterChange={onFilterChange} />
          <Button
            size="sm"
            disabled={!selectedObjectiveId}
            onClick={onAddTask}
            className="text-white rounded-full bg-[#0a1f44]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {selectedObjective && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#d9a44d]"></div>
            <div>
              <p className="font-medium text-gray-800 mb-1">{selectedObjective.title}</p>
              {selectedObjective.description && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedObjective.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <TasksTable
        tasks={tasks}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onStatusChange={onStatusChange}
      />
    </Card>
  );
};
