
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ListHeader } from "@/components/common/ListHeader";
import { useActiveTasksData } from "./active-tasks/useActiveTasksData";
import { ActiveTasksFilter } from "./active-tasks/ActiveTasksFilter";
import { ActiveTasksTable } from "./active-tasks/ActiveTasksTable";

interface ActiveTasksDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActiveTasksDialog = ({ isOpen, onClose }: ActiveTasksDialogProps) => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    filteredTasks,
    handleClearFilters,
    hasActiveFilters,
    uniqueProjects
  } = useActiveTasksData();

  const handleTaskClick = (projectId: number, taskId: number) => {
    navigate(`/projects/${projectId}/action-plan?tab=strategy&taskId=${taskId}`);
    onClose();
  };

  const filterContent = (
    <ActiveTasksFilter
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      projectFilter={projectFilter}
      setProjectFilter={setProjectFilter}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={handleClearFilters}
      uniqueProjects={uniqueProjects}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Active Tasks Overview</DialogTitle>
        </DialogHeader>

        <ListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search tasks, projects, or assignees..."
          filterContent={filterContent}
          hasActiveFilters={hasActiveFilters}
        />
        
        <ActiveTasksTable
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
        />
      </DialogContent>
    </Dialog>
  );
};
