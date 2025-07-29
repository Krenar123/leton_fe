import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateMeetingDialog } from "../projects/CreateMeetingDialog";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
interface Meeting {
  id: number;
  topic: string;
  withWho: string;
  ourPerson: string;
  day: string;
  time: string;
  location: string;
  status: "planned" | "finished";
}
interface SupplierMeetingsDialogProps {
  supplierName: string;
  onClose: () => void;
}
const initialMockMeetings: Meeting[] = [{
  id: 1,
  topic: "Client Review",
  withWho: "ABC Corp - John Smith",
  ourPerson: "Sarah Johnson",
  day: "2024-07-07",
  time: "14:00",
  location: "Conference Room A",
  status: "planned"
}, {
  id: 2,
  topic: "Team Standup",
  withWho: "Internal Team",
  ourPerson: "Mike Davis",
  day: "2024-07-08",
  time: "09:00",
  location: "Teams Meeting",
  status: "planned"
}, {
  id: 3,
  topic: "Budget Review",
  withWho: "ABC Corp - Finance Team",
  ourPerson: "Anna Wilson",
  day: "2024-07-10",
  time: "15:30",
  location: "Client Office",
  status: "planned"
}, {
  id: 4,
  topic: "Project Kickoff",
  withWho: "ABC Corp - Project Team",
  ourPerson: "Tom Brown",
  day: "2024-01-15",
  time: "10:00",
  location: "Conference Room B",
  status: "finished"
}, {
  id: 5,
  topic: "Design Presentation",
  withWho: "ABC Corp - Design Team",
  ourPerson: "Lisa Green",
  day: "2024-03-20",
  time: "13:00",
  location: "Zoom Meeting",
  status: "finished"
}];
export const SupplierMeetingsDialog = ({
  supplierName,
  onClose
}: SupplierMeetingsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "finished">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMockMeetings);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filteredMeetings = meetings.filter(meeting => {
    // Apply search filter
    const matchesSearch = searchTerm === "" || meeting.topic.toLowerCase().includes(searchTerm.toLowerCase()) || meeting.withWho.toLowerCase().includes(searchTerm.toLowerCase()) || meeting.ourPerson.toLowerCase().includes(searchTerm.toLowerCase()) || meeting.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Apply status filter
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort by date and time with upcoming meetings on top
    const dateA = new Date(a.day + " " + a.time);
    const dateB = new Date(b.day + " " + b.time);
    const now = new Date();
    const isAUpcoming = dateA >= now;
    const isBUpcoming = dateB >= now;

    // Upcoming meetings first, then sort by date
    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    if (isAUpcoming && isBUpcoming) {
      return dateA.getTime() - dateB.getTime(); // Earliest upcoming first
    } else {
      return dateB.getTime() - dateA.getTime(); // Latest finished first
    }
  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  const handleCreateMeeting = (meetingData: any) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now(),
      status: "planned" as const
    };
    setMeetings(prev => [...prev, newMeeting]);
    setIsCreateDialogOpen(false);
    console.log('New meeting created and added to list:', newMeeting);
  };
  const filterContent = <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filter by Status</Label>
        <RadioGroup value={statusFilter} onValueChange={(value: "all" | "planned" | "finished") => setStatusFilter(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="text-sm">All meetings</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="planned" id="planned" />
            <Label htmlFor="planned" className="text-sm">Planned meetings</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="finished" id="finished" />
            <Label htmlFor="finished" className="text-sm">Finished meetings</Label>
          </div>
        </RadioGroup>
      </div>
    </div>;
  const hasActiveFilters = statusFilter !== "all";
  return <div>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Meetings - {supplierName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search meetings..." className="pl-10" />
            </div>
            
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className={`text-gray-600 hover:bg-gray-100 ${hasActiveFilters ? 'text-blue-600' : ''}`}>
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white z-50" align="end">
                {filterContent}
              </PopoverContent>
            </Popover>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#0a1f44]">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Meeting
                </Button>
              </DialogTrigger>
              <CreateMeetingDialog onCreateMeeting={handleCreateMeeting} onClose={() => setIsCreateDialogOpen(false)} />
            </Dialog>
          </div>

          {/* Meetings Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>With Who</TableHead>
                  <TableHead>Our Person</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location/Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map(meeting => <TableRow key={meeting.id}>
                    <TableCell className="font-medium">
                      {meeting.topic}
                    </TableCell>
                    <TableCell>{meeting.withWho}</TableCell>
                    <TableCell>{meeting.ourPerson}</TableCell>
                    <TableCell>
                      <Badge variant={meeting.status === "finished" ? "secondary" : "default"}>
                        {formatDate(meeting.day)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{meeting.time}</TableCell>
                    <TableCell>{meeting.location}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </div>

          {filteredMeetings.length === 0 && <div className="text-center py-8 text-gray-500">
              No meetings found for the selected filter.
            </div>}
        </div>
      </DialogContent>
    </div>;
};