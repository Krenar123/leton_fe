import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X, Search } from "lucide-react";

interface ObjectivesFilterProps {
  onFilterChange: (filters: {
    title?: string;
    status?: string;
    participant?: string;
  }) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

export const ObjectivesFilter = ({
  onFilterChange,
  onSearchChange,
  searchValue
}: ObjectivesFilterProps) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [participant, setParticipant] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      title: title || undefined,
      status: status || undefined,
      participant: participant || undefined
    });
    setIsOpen(false);
  };

  const handleClearFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTitle("");
    setStatus("");
    setParticipant("");
    onFilterChange({});
  };

  const hasActiveFilters = title || status || participant;

  return (
    <div className="flex gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search objectives..."
          className="pl-10 w-48 bg-white border-gray-300"
        />
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-gray-600 hover:bg-gray-100 ${hasActiveFilters ? 'text-yellow-600' : ''}`}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white z-50" align="end">
          <form onSubmit={handleApplyFilters} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Filter Objectives</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} type="button">
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            <div>
              <Label htmlFor="title-filter" className="text-gray-700">Objective Field</Label>
              <Input
                id="title-filter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Search by field..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status-filter" className="text-gray-700">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem> {/* ✅ fix value */}
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="participant-filter" className="text-gray-700">Participant</Label>
              <Input
                id="participant-filter"
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                placeholder="Search by participant..."
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full">
              Apply Filters
            </Button>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};
