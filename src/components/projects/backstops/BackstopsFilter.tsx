
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface BackstopsFilterProps {
  statusFilter: "all" | "reached";
  typeFilter: string;
  onStatusFilterChange: (status: "all" | "reached") => void;
  onTypeFilterChange: (type: string) => void;
  hasActiveFilters: boolean;
}

const typeFilterOptions = [
  { value: "all", label: "All Types" },
  { value: "task_due", label: "Task Due" },
  { value: "item_expense", label: "Item Cost" },
  { value: "job_profitability", label: "Profitability" },
  { value: "cashflow", label: "Cash Flow" }
];

export const BackstopsFilter = ({
  statusFilter,
  typeFilter,
  onStatusFilterChange,
  onTypeFilterChange,
  hasActiveFilters
}: BackstopsFilterProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={hasActiveFilters ? "text-yellow-600 border-yellow-300 bg-yellow-50" : ""}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
          Status
        </div>
        <DropdownMenuItem
          onClick={() => onStatusFilterChange("all")}
          className={statusFilter === "all" ? "bg-accent" : ""}
        >
          All Status
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onStatusFilterChange("reached")}
          className={statusFilter === "reached" ? "bg-accent" : ""}
        >
          Reached Only
        </DropdownMenuItem>
        <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide border-t mt-1 pt-2">
          Type
        </div>
        {typeFilterOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onTypeFilterChange(option.value)}
            className={typeFilter === option.value ? "bg-accent" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
