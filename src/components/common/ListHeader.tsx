
import { useState } from "react";
import { Search, Filter, Settings2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterContent?: React.ReactNode;
  hasActiveFilters?: boolean;
  settingsContent?: React.ReactNode;
  hasActiveSettings?: boolean;
  createButton?: {
    label: string;
    onClick: () => void;
  };
  createButtons?: {
    label: string;
    onClick: () => void;
  }[];
}

export const ListHeader = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search bills...",
  filterContent,
  hasActiveFilters = false,
  settingsContent,
  hasActiveSettings = false,
  createButton,
  createButtons
}: ListHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg px-0 py-0 my-[16px] bg-inherit">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          value={searchTerm} 
          onChange={e => onSearchChange(e.target.value)} 
          placeholder={searchPlaceholder} 
          className="pl-10 bg-white border-gray-300" 
        />
      </div>
      
      {filterContent && (
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hover:bg-gray-100 ${hasActiveFilters ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-600 hover:text-gray-700'}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white z-50" align="end">
            {filterContent}
          </PopoverContent>
        </Popover>
      )}

      {settingsContent && (
        <Popover open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hover:bg-gray-100 ${hasActiveSettings ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-600 hover:text-gray-700'}`}
            >
              <Settings2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-white z-50" align="end">
            {settingsContent}
          </PopoverContent>
        </Popover>
      )}

      {createButtons && createButtons.map((button, index) => (
        <Button key={index} onClick={button.onClick} className="bg-[#0a1f44] hover:bg-[#081a3a]">
          <Plus className="h-4 w-4 mr-2" />
          {button.label}
        </Button>
      ))}

      {!createButtons && createButton && (
        <Button onClick={createButton.onClick} className="bg-[#0a1f44] hover:bg-[#081a3a]">
          <Plus className="h-4 w-4 mr-2" />
          {createButton.label}
        </Button>
      )}
    </div>
  );
};
