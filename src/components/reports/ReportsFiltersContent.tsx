
import { Button } from "@/components/ui/button";
import { ReportFiltersComponent } from "./ReportFilters";
import { ReportFilters, Report } from "./types";

interface ReportsFiltersContentProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onClearFilters: () => void;
  reports: Report[];
}

export const ReportsFiltersContent = ({
  filters,
  onFiltersChange,
  onClearFilters,
  reports
}: ReportsFiltersContentProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filters</h4>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>
      <ReportFiltersComponent 
        filters={filters} 
        onFiltersChange={onFiltersChange} 
        reports={reports} 
      />
    </div>
  );
};
