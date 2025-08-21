import { useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateMeetingDialog } from "./CreateMeetingDialog";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Meeting = {
  id: number | string;
  title: string;          // unified
  withWho: string;
  ourPerson: string;      // unified
  day: string;            // YYYY-MM-DD
  time: string;           // HH:mm (24h)
  location: string;
};

interface MeetingsDialogProps {
  projectName: string;
  onClose: () => void;
}

// unified mock data
const initialMockMeetings: Meeting[] = [
  { id: 1, title: "Client Review",       withWho: "ABC Corp - John Smith",   ourPerson: "Sarah Johnson", day: "2024-07-07", time: "14:00", location: "Conference Room A" },
  { id: 2, title: "Team Standup",        withWho: "Internal Team",           ourPerson: "Mike Davis",    day: "2024-07-08", time: "09:00", location: "Teams Meeting" },
  { id: 3, title: "Budget Review",       withWho: "ABC Corp - Finance Team", ourPerson: "Anna Wilson",   day: "2024-07-10", time: "15:30", location: "Client Office" },
  { id: 4, title: "Project Kickoff",     withWho: "ABC Corp - Project Team", ourPerson: "Tom Brown",     day: "2024-01-15", time: "10:00", location: "Conference Room B" },
  { id: 5, title: "Design Presentation", withWho: "ABC Corp - Design Team",  ourPerson: "Lisa Green",    day: "2024-03-20", time: "13:00", location: "Zoom Meeting" },
];

export const MeetingsDialog = ({ projectName }: MeetingsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "finished">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMockMeetings);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const isPast = (m: Meeting) => new Date(`${m.day} ${m.time}`) < new Date();

  const filteredMeetings = useMemo(() => {
    const now = new Date();
    const matches = meetings.filter(m => {
      const matchesSearch =
        !searchTerm ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.withWho.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.ourPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.location.toLowerCase().includes(searchTerm.toLowerCase());

      const past = new Date(`${m.day} ${m.time}`) < now;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "planned" && !past) ||
        (statusFilter === "finished" && past);

      return matchesSearch && matchesStatus;
    });

    // sort: upcoming first (earliest first), then past (latest first)
    return matches.sort((a, b) => {
      const da = new Date(`${a.day} ${a.time}`);
      const db = new Date(`${b.day} ${b.time}`);
      const aUpcoming = da >= now;
      const bUpcoming = db >= now;
      if (aUpcoming && !bUpcoming) return -1;
      if (!aUpcoming && bUpcoming) return 1;
      return aUpcoming ? da.getTime() - db.getTime() : db.getTime() - da.getTime();
    });
  }, [meetings, searchTerm, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  // Always normalize created data into our Meeting shape
  const handleCreateMeeting = (data: any) => {
    // Accept flexible inputs from CreateMeetingDialog and normalize:
    const normalized: Meeting = {
      id: Date.now(),
      title: data.title ?? data.topic ?? "Untitled",
      withWho: data.withWho ?? data.clientName ?? "—",
      ourPerson: data.ourPerson ?? data.ourCompanyPerson ?? "—",
      // prefer “meeting_date” ISO or separate day/time
      day: data.day ?? (data.meeting_date ? new Date(data.meeting_date).toISOString().slice(0, 10) : ""),
      time:
        data.time ??
        (data.meeting_date
          ? new Date(data.meeting_date).toISOString().slice(11, 16) // HH:mm
          : ""),
      location: data.location ?? data.link ?? "—",
    };

    setMeetings(prev => [...prev, normalized]);
    setIsCreateDialogOpen(false);
    console.log("New meeting (normalized):", normalized);
  };

  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filter by Status</Label>
        <RadioGroup value={statusFilter} onValueChange={(v: "all" | "planned" | "finished") => setStatusFilter(v)}>
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
    </div>
  );

  const hasActiveFilters = statusFilter !== "all";

  return (
    <div>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Meetings - {projectName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search meetings..."
                className="pl-10"
              />
            </div>

            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className={`text-gray-600 hover:bg-gray-100 ${hasActiveFilters ? "text-blue-600" : ""}`}>
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
              <CreateMeetingDialog
                onCreateMeeting={handleCreateMeeting}
                onClose={() => setIsCreateDialogOpen(false)}
              />
            </Dialog>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>With Who</TableHead>
                  <TableHead>Our Person</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Location/Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.title}</TableCell>
                    <TableCell>{m.withWho}</TableCell>
                    <TableCell>{m.ourPerson}</TableCell>
                    <TableCell>
                      <Badge variant={isPast(m) ? "secondary" : "default"}>
                        {m.day ? formatDate(m.day) : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.time || "—"}</TableCell>
                    <TableCell>{m.location || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No meetings found for the selected filter.
            </div>
          )}
        </div>
      </DialogContent>
    </div>
  );
};
