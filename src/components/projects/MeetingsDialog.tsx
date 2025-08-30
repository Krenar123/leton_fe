// src/components/projects/MeetingsDialog.tsx
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
import { useProjectMeetings } from "@/hooks/useProjectMeetings";

type Meeting = {
  id: string | number;
  title: string;
  withWho: string;
  ourPerson: string;
  day: string;   // YYYY-MM-DD
  time: string;  // HH:mm
  location: string;
};

interface MeetingsDialogProps {
  projectRef: string;      // <- add this
  projectName: string;
  onClose: () => void;
}

export const MeetingsDialog = ({ projectRef, projectName }: MeetingsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "finished">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: meetings = [], isLoading, createMeeting } = useProjectMeetings(projectRef);

  const isPast = (m: Meeting) => new Date(`${m.day}T${m.time}:00`) < new Date();

  const filteredMeetings = useMemo(() => {
    const now = new Date();
    const matches = (meetings as Meeting[]).filter(m => {
      const matchesSearch =
        !searchTerm ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.withWho.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.ourPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.location ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const past = new Date(`${m.day}T${m.time}:00`) < now;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "planned" && !past) ||
        (statusFilter === "finished" && past);

      return matchesSearch && matchesStatus;
    });

    // upcoming first asc; past last desc
    return matches.sort((a, b) => {
      const da = new Date(`${a.day}T${a.time}:00`);
      const db = new Date(`${b.day}T${b.time}:00`);
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
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  };

  // Create -> call API (normalize FE -> BE payload)
  const handleCreateMeeting = async (data: any) => {
    // FE form gives separate day/time; combine to ISO for BE if your BE uses `meeting_at`
    const meetingAt =
      data.meeting_date ??
      (data.day && data.time ? new Date(`${data.day}T${data.time}:00`).toISOString() : null);

    const payload = {
      title: data.title ?? data.topic,
      with_who: data.withWho ?? data.clientName,
      our_person: data.ourCompanyPerson ?? data.ourPerson,
      location: data.location ?? data.link,
      meeting_at: meetingAt,     // preferred in BE
      // If BE uses separate columns, also send:
      day: data.day || undefined,
      time: data.time || undefined,
      description: data.description || undefined,
    };

    await createMeeting(payload);
    setIsCreateDialogOpen(false);
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
                {isLoading ? (
                  <TableRow><TableCell colSpan={6}>Loading…</TableCell></TableRow>
                ) : (
                  filteredMeetings.map((m) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && filteredMeetings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No meetings found for the selected filter.
            </div>
          )}
        </div>
      </DialogContent>
    </div>
  );
};
