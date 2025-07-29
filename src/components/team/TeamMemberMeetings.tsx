
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ListHeader } from "@/components/common/ListHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Meeting {
  id: string;
  company: string;
  person: string;
  ourPersons: string[];
  description: string;
  project: string;
  location: string;
  date: string;
  time: string;
}

interface TeamMemberMeetingsProps {
  meetings: Meeting[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

interface ColumnVisibility {
  person: boolean;
  ourPersons: boolean;
  description: boolean;
  project: boolean;
  location: boolean;
  date: boolean;
  time: boolean;
}

export const TeamMemberMeetings = ({
  meetings,
  searchTerm,
  onSearchChange
}: TeamMemberMeetingsProps) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    person: true,
    ourPersons: true,
    description: true,
    project: true,
    location: true,
    date: true,
    time: true,
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const settingsContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Columns</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="person"
              checked={columnVisibility.person}
              onCheckedChange={() => toggleColumn('person')}
            />
            <Label htmlFor="person" className="text-sm">Person</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ourPersons"
              checked={columnVisibility.ourPersons}
              onCheckedChange={() => toggleColumn('ourPersons')}
            />
            <Label htmlFor="ourPersons" className="text-sm">Our Persons</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="description"
              checked={columnVisibility.description}
              onCheckedChange={() => toggleColumn('description')}
            />
            <Label htmlFor="description" className="text-sm">Description</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="project"
              checked={columnVisibility.project}
              onCheckedChange={() => toggleColumn('project')}
            />
            <Label htmlFor="project" className="text-sm">Project</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="location"
              checked={columnVisibility.location}
              onCheckedChange={() => toggleColumn('location')}
            />
            <Label htmlFor="location" className="text-sm">Location</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="date"
              checked={columnVisibility.date}
              onCheckedChange={() => toggleColumn('date')}
            />
            <Label htmlFor="date" className="text-sm">Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="time"
              checked={columnVisibility.time}
              onCheckedChange={() => toggleColumn('time')}
            />
            <Label htmlFor="time" className="text-sm">Time</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filter by Project</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="office-building" />
            <Label htmlFor="office-building" className="text-sm">Office Building Renovation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="residential-complex" />
            <Label htmlFor="residential-complex" className="text-sm">Residential Complex</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const filteredMeetings = meetings.filter(meeting => 
    searchTerm === "" ||
    meeting.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <ListHeader
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search meetings..."
          filterContent={filterContent}
          settingsContent={settingsContent}
        />
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Company</TableHead>
                {columnVisibility.person && <TableHead className="font-semibold">Person</TableHead>}
                {columnVisibility.ourPersons && <TableHead className="font-semibold">Our Persons</TableHead>}
                {columnVisibility.description && <TableHead className="font-semibold">Description</TableHead>}
                {columnVisibility.project && <TableHead className="font-semibold">Project</TableHead>}
                {columnVisibility.location && <TableHead className="font-semibold">Location</TableHead>}
                {columnVisibility.date && <TableHead className="font-semibold">Date</TableHead>}
                {columnVisibility.time && <TableHead className="font-semibold">Time</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow key={meeting.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <TableCell className="font-medium">{meeting.company}</TableCell>
                  {columnVisibility.person && <TableCell>{meeting.person}</TableCell>}
                  {columnVisibility.ourPersons && (
                    <TableCell>{meeting.ourPersons.join(", ")}</TableCell>
                  )}
                  {columnVisibility.description && <TableCell>{meeting.description}</TableCell>}
                  {columnVisibility.project && <TableCell>{meeting.project}</TableCell>}
                  {columnVisibility.location && <TableCell>{meeting.location}</TableCell>}
                  {columnVisibility.date && (
                    <TableCell>{format(new Date(meeting.date), 'dd/MM/yyyy')}</TableCell>
                  )}
                  {columnVisibility.time && <TableCell>{meeting.time}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
