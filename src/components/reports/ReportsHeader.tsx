
import { Button } from "@/components/ui/button";
import { ListHeader } from "@/components/common/ListHeader";
import { ReportFilters, ReportColumnVisibility } from "./types";

interface ReportsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  columnVisibility: ReportColumnVisibility;
  onColumnVisibilityChange: (visibility: ReportColumnVisibility) => void;
  onGenerateReport: () => void;
  filterContent: React.ReactNode;
  settingsContent: React.ReactNode;
}

export const ReportsHeader = ({
  searchTerm,
  onSearchChange,
  hasActiveFilters,
  onGenerateReport,
  filterContent,
  settingsContent
}: ReportsHeaderProps) => {
  const handleCreateEmployeeReport = () => {
    console.log('Creating employee report...');
    // This would open a different dialog for employee reports
  };

  return (
    <ListHeader
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search reports..."
      filterContent={filterContent}
      hasActiveFilters={hasActiveFilters}
      settingsContent={settingsContent}
      createButtons={[
        {
          label: "Create Financial Report",
          onClick: onGenerateReport
        },
        {
          label: "Create Employee Report", 
          onClick: handleCreateEmployeeReport
        }
      ]}
    />
  );
};
