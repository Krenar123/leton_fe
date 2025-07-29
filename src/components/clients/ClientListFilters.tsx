import { useState } from "react";
import { Search, Filter, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ClientListFilterContent } from "./ClientListFilterContent";
import { ClientListSettingsContent } from "./ClientListSettingsContent";
interface ClientListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  currentColumns: any;
  onColumnVisibilityChange: (column: string, value: boolean) => void;
}
export const ClientListFilters = ({
  searchTerm,
  onSearchChange,
  activeTab,
  currentColumns,
  onColumnVisibilityChange
}: ClientListFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return <div className="flex items-center gap-4 rounded-lg bg-white py-0">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={searchTerm} onChange={e => onSearchChange(e.target.value)} placeholder="Search..." className="pl-10 bg-white" />
      </div>
      
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
            <Filter className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white z-50" align="end">
          <ClientListFilterContent activeTab={activeTab} />
        </PopoverContent>
      </Popover>

      <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
            <Settings2 className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-white z-50" align="end">
          <ClientListSettingsContent activeTab={activeTab} currentColumns={currentColumns} onColumnVisibilityChange={onColumnVisibilityChange} />
        </PopoverContent>
      </Popover>
    </div>;
};