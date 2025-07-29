
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface DueDatesFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  projectFilter: string;
  setProjectFilter: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  uniqueProjects: string[];
}

export const DueDatesFilter = ({
  statusFilter,
  setStatusFilter,
  projectFilter,
  setProjectFilter,
  hasActiveFilters,
  onClearFilters,
  uniqueProjects
}: DueDatesFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Filter Objectives</h4>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} type="button">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div>
        <Label htmlFor="status-filter" className="text-gray-700">Status</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Finished">Finished</SelectItem>
            <SelectItem value="Already Due">Already Due</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="project-filter" className="text-gray-700">Project</Label>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>{project}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
