
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { ListHeader } from "@/components/common/ListHeader";
import { useDueDatesData } from "./due-dates/useDueDatesData";
import { DueDatesFilter } from "./due-dates/DueDatesFilter";
import { DueDatesColumnSettings } from "./due-dates/DueDatesColumnSettings";
import { ObjectivesTable } from "./due-dates/ObjectivesTable";

interface DueDatesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DueDatesDialog = ({ isOpen, onClose }: DueDatesDialogProps) => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    columnVisibility,
    setColumnVisibility,
    filteredObjectives,
    handleClearFilters,
    hasActiveFilters,
    uniqueProjects
  } = useDueDatesData();

  const handleObjectiveClick = (projectId: number) => {
    navigate(`/projects/${projectId}/action-plan`);
    onClose();
  };

  const filterContent = (
    <DueDatesFilter
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      projectFilter={projectFilter}
      setProjectFilter={setProjectFilter}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={handleClearFilters}
      uniqueProjects={uniqueProjects}
    />
  );

  const settingsContent = (
    <DueDatesColumnSettings
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Active Objectives Overview</DialogTitle>
        </DialogHeader>

        <ListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search objectives..."
          filterContent={filterContent}
          hasActiveFilters={hasActiveFilters}
          settingsContent={settingsContent}
        />
        
        <ObjectivesTable
          objectives={filteredObjectives}
          columnVisibility={columnVisibility}
          onObjectiveClick={handleObjectiveClick}
        />
      </DialogContent>
    </Dialog>
  );
};
