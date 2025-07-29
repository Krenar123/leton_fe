import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, Plus, X } from "lucide-react";
interface TeamFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onAddMember: () => void;
}
export const TeamFilters = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  onClearFilters,
  hasActiveFilters,
  onAddMember
}: TeamFiltersProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  return <Card className="p-4 px-[8px] py-[8px] mx-[16px] my-0">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search team members..." value={searchTerm} onChange={e => onSearchChange(e.target.value)} className="pl-9" />
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={`${hasActiveFilters ? 'bg-blue-50 border-blue-200' : ''}`}>
                <Filter className="h-4 w-4" />
                {hasActiveFilters && <span className="ml-1 text-xs">•</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filter Team Members</h4>
                  {hasActiveFilters && <Button variant="ghost" size="sm" onClick={() => {
                  onClearFilters();
                  setIsFilterOpen(false);
                }} className="h-auto p-1">
                      <X className="h-3 w-3" />
                    </Button>}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select value={departmentFilter} onValueChange={onDepartmentChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={onAddMember} className="bg-slate-800 hover:bg-slate-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>
    </Card>;
};