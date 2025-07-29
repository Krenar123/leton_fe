
import { Search, Filter, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ListHeader } from "@/components/common/ListHeader";

interface FilterState {
  client: string;
  location: string;
  start: string;
  due: string;
  value: { min: string; max: string };
  profit: { min: string; max: string };
  status: string;
}

interface ColumnVisibility {
  client: boolean;
  location: boolean;
  start: boolean;
  due: boolean;
  value: boolean;
  profit: boolean;
}

interface ProjectFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onNewProject: () => void;
  newProjectDialog: React.ReactNode;
}

const ProjectFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  hasActiveFilters,
  onClearFilters,
  onNewProject,
  newProjectDialog
}: ProjectFiltersProps) => {
  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Filters</h4>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Client</label>
          <Input
            value={filters.client}
            onChange={(e) => onFiltersChange({...filters, client: e.target.value})}
            placeholder="Filter by client..."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input
            value={filters.location}
            onChange={(e) => onFiltersChange({...filters, location: e.target.value})}
            placeholder="Filter by location..."
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Value Range</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.value.min}
              onChange={(e) => onFiltersChange({...filters, value: {...filters.value, min: e.target.value}})}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.value.max}
              onChange={(e) => onFiltersChange({...filters, value: {...filters.value, max: e.target.value}})}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Profit Range (%)</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min %"
              value={filters.profit.min}
              onChange={(e) => onFiltersChange({...filters, profit: {...filters.profit, min: e.target.value}})}
            />
            <Input
              type="number"
              placeholder="Max %"
              value={filters.profit.max}
              onChange={(e) => onFiltersChange({...filters, profit: {...filters.profit, max: e.target.value}})}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const settingsContent = (
    <div className="space-y-4">
      <h4 className="font-medium">Customize Columns</h4>
      <div className="space-y-3">
        {Object.entries(columnVisibility).map(([key, visible]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={visible}
              onCheckedChange={(checked) => 
                onColumnVisibilityChange({...columnVisibility, [key]: checked as boolean})
              }
            />
            <label htmlFor={key} className="text-sm capitalize">
              {key === 'profit' ? 'Profit %' : key}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      <ListHeader
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search projects..."
        filterContent={filterContent}
        hasActiveFilters={hasActiveFilters}
        settingsContent={settingsContent}
        createButton={{
          label: "New Project",
          onClick: onNewProject
        }}
      />
      
      <Dialog>
        <DialogTrigger asChild>
          <div style={{ display: 'none' }} />
        </DialogTrigger>
        {newProjectDialog}
      </Dialog>
    </div>
  );
};

export default ProjectFilters;
