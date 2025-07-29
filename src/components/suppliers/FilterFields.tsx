
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { SupplierFilterState } from "@/types/supplier";

interface FilterFieldsProps {
  filters: SupplierFilterState;
  onFiltersChange: (filters: SupplierFilterState) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const FilterFields = ({ 
  filters, 
  onFiltersChange, 
  hasActiveFilters, 
  onClearFilters 
}: FilterFieldsProps) => {
  const handleFilterChange = (key: keyof SupplierFilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Filters</div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="h-auto p-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="company" className="text-xs">Company</Label>
          <Input
            id="company"
            placeholder="Filter by company"
            value={filters.company}
            onChange={(e) => handleFilterChange('company', e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Total Value Range</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.totalValue.min}
              onChange={(e) => handleFilterChange('totalValue', { ...filters.totalValue, min: e.target.value })}
              className="h-8 text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.totalValue.max}
              onChange={(e) => handleFilterChange('totalValue', { ...filters.totalValue, max: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Total Projects Range</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.totalProjects.min}
              onChange={(e) => handleFilterChange('totalProjects', { ...filters.totalProjects, min: e.target.value })}
              className="h-8 text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.totalProjects.max}
              onChange={(e) => handleFilterChange('totalProjects', { ...filters.totalProjects, max: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Profitability Range (%)</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Min"
              type="number"
              value={filters.profitability.min}
              onChange={(e) => handleFilterChange('profitability', { ...filters.profitability, min: e.target.value })}
              className="h-8 text-sm"
            />
            <Input
              placeholder="Max"
              type="number"
              value={filters.profitability.max}
              onChange={(e) => handleFilterChange('profitability', { ...filters.profitability, max: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterFields;
