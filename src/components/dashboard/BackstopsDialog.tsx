
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ListHeader } from "@/components/common/ListHeader";
import { BackstopsTable } from "./backstops/BackstopsTable";
import { useBackstopsData } from "./backstops/useBackstopsData";
import { BackstopsDialogProps } from "./backstops/types";

export const BackstopsDialog = ({ isOpen, onClose }: BackstopsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "reached">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  const { filteredBackstops, uniqueProjects } = useBackstopsData();

  const filteredData = filteredBackstops(searchTerm, statusFilter, typeFilter, projectFilter);
  
  console.log("filtered data");
  console.log(filteredData);
  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all" || projectFilter !== "all";

  const handleClearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setProjectFilter("all");
  };

  const typeFilterOptions = [
    { value: "all", label: "All Types" },
    { value: "task_due", label: "Task Due" },
    { value: "item_expense", label: "Item Cost" },
    { value: "job_profitability", label: "Profitability" },
    { value: "cashflow", label: "Cash Flow" }
  ];

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Filter Backstops</h4>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} type="button">
            Clear
          </Button>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value as "all" | "reached")}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="reached">Reached Only</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          {typeFilterOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Project</label>
        <select 
          value={projectFilter} 
          onChange={(e) => setProjectFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Projects</option>
          {uniqueProjects.map(project => (
            <option key={project} value={project}>{project}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>All Backstops</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <ListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search backstops, projects..."
            filterContent={filterContent}
            hasActiveFilters={hasActiveFilters}
          />

          <BackstopsTable
            backstops={filteredData}
            onClose={onClose}
          />

          {filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No backstops found</div>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
