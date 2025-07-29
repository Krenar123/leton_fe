
import { ListHeader } from "@/components/common/ListHeader";
import { SupplierFilterState, SupplierColumnVisibility } from "@/types/supplier";
import FilterFields from "./FilterFields";
import ColumnVisibilitySettings from "./ColumnVisibilitySettings";

interface SupplierFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: SupplierFilterState;
  onFiltersChange: (filters: SupplierFilterState) => void;
  columnVisibility: SupplierColumnVisibility;
  onColumnVisibilityChange: (visibility: SupplierColumnVisibility) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const SupplierFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  hasActiveFilters,
  onClearFilters
}: SupplierFiltersProps) => {
  const filterContent = (
    <FilterFields
      filters={filters}
      onFiltersChange={onFiltersChange}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={onClearFilters}
    />
  );

  const settingsContent = (
    <ColumnVisibilitySettings
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={onColumnVisibilityChange}
    />
  );

  return (
    <ListHeader
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Search vendors..."
      filterContent={filterContent}
      hasActiveFilters={hasActiveFilters}
      settingsContent={settingsContent}
    />
  );
};

export default SupplierFilters;
