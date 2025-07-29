
import { ListHeader } from "@/components/common/ListHeader";
import { ClientFilterState, ClientColumnVisibility } from "@/types/client";
import FilterFields from "./FilterFields";
import ColumnVisibilitySettings from "./ColumnVisibilitySettings";

interface ClientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: ClientFilterState;
  onFiltersChange: (filters: ClientFilterState) => void;
  columnVisibility: ClientColumnVisibility;
  onColumnVisibilityChange: (visibility: ClientColumnVisibility) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const ClientFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  columnVisibility,
  onColumnVisibilityChange,
  hasActiveFilters,
  onClearFilters
}: ClientFiltersProps) => {
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
      searchPlaceholder="Search clients..."
      filterContent={filterContent}
      hasActiveFilters={hasActiveFilters}
      settingsContent={settingsContent}
    />
  );
};

export default ClientFilters;
