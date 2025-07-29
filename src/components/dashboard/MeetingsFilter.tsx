
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface MeetingsFilterProps {
  personFilter: string;
  setPersonFilter: (value: string) => void;
  ourPersonsFilter: string;
  setOurPersonsFilter: (value: string) => void;
  projectFilter: string;
  setProjectFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  uniquePersons: string[];
  uniqueOurPersons: string[];
  uniqueProjects: string[];
  onReset: () => void;
}

export const MeetingsFilter = ({
  personFilter,
  setPersonFilter,
  ourPersonsFilter,
  setOurPersonsFilter,
  projectFilter,
  setProjectFilter,
  dateFilter,
  setDateFilter,
  uniquePersons,
  uniqueOurPersons,
  uniqueProjects,
  onReset
}: MeetingsFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Person</label>
        <Select value={personFilter} onValueChange={setPersonFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select person" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Persons</SelectItem>
            {uniquePersons.map((person) => (
              <SelectItem key={person} value={person}>
                {person}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Our Persons</label>
        <Select value={ourPersonsFilter} onValueChange={setOurPersonsFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select our person" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Our Persons</SelectItem>
            {uniqueOurPersons.map((person) => (
              <SelectItem key={person} value={person}>
                {person}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Project</label>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <Button 
        variant="outline" 
        onClick={onReset}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  );
};
