
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientFilterState } from "@/types/client";

interface FilterFieldsProps {
  filters: ClientFilterState;
  onFiltersChange: (filters: ClientFilterState) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const FilterFields = ({
  filters,
  onFiltersChange,
  hasActiveFilters,
  onClearFilters
}: FilterFieldsProps) => {
  const handleFilterChange = (key: keyof ClientFilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Filter Clients</div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="company-filter" className="text-xs text-gray-600 uppercase tracking-wide">Company</Label>
          <Input
            id="company-filter"
            value={filters.company}
            onChange={(e) => handleFilterChange("company", e.target.value)}
            placeholder="Filter by company"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-600 uppercase tracking-wide">Total Value Range</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={filters.totalValue.min}
              onChange={(e) => handleFilterChange("totalValue", { ...filters.totalValue, min: e.target.value })}
              placeholder="Min"
              type="number"
            />
            <Input
              value={filters.totalValue.max}
              onChange={(e) => handleFilterChange("totalValue", { ...filters.totalValue, max: e.target.value })}
              placeholder="Max"
              type="number"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-600 uppercase tracking-wide">Projects Range</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={filters.totalProjects.min}
              onChange={(e) => handleFilterChange("totalProjects", { ...filters.totalProjects, min: e.target.value })}
              placeholder="Min"
              type="number"
            />
            <Input
              value={filters.totalProjects.max}
              onChange={(e) => handleFilterChange("totalProjects", { ...filters.totalProjects, max: e.target.value })}
              placeholder="Max"
              type="number"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-600 uppercase tracking-wide">Profitability Range (%)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={filters.profitability.min}
              onChange={(e) => handleFilterChange("profitability", { ...filters.profitability, min: e.target.value })}
              placeholder="Min"
              type="number"
            />
            <Input
              value={filters.profitability.max}
              onChange={(e) => handleFilterChange("profitability", { ...filters.profitability, max: e.target.value })}
              placeholder="Max"
              type="number"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="pt-3 border-t">
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterFields;
