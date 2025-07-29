
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, X } from "lucide-react";

interface TasksFilterProps {
  onFilterChange: (filters: {
    task?: string;
    status?: string;
    participant?: string;
  }) => void;
}

export const TasksFilter = ({ onFilterChange }: TasksFilterProps) => {
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [participant, setParticipant] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      task: task || undefined,
      status: status || undefined,
      participant: participant || undefined,
    });
    setIsOpen(false);
  };

  const handleClearFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTask("");
    setStatus("");
    setParticipant("");
    onFilterChange({});
  };

  const hasActiveFilters = task || status || participant;

  return (
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
            <h4 className="font-medium text-gray-900">Filter Tasks</h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} type="button">
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div>
            <Label htmlFor="task-filter" className="text-gray-700">Task</Label>
            <Input
              id="task-filter"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Search by task..."
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
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
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
  );
};
