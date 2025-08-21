// src/components/clients/ClientMeetingsDialog.tsx
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { fetchClientMeetings, createClientMeeting } from "@/services/api";

interface ClientMeetingsDialogProps {
  clientRef: string;   // client's ref
  clientName: string;  // client's display name
  onClose: () => void;
}

type MeetingRow = {
  id: string | number;
  title: string;
  withWho: string;
  ourPerson: string;
  day: string;     // YYYY-MM-DD
  time: string;    // HH:MM (local)
  location: string;
  status: "planned" | "finished";
};

function splitDayTime(iso?: string) {
  if (!iso) return { day: "", time: "" };
  const d = new Date(iso);
  const day = d.toISOString().slice(0, 10); // stable for sorting
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // display-friendly
  return { day, time };
}

export const ClientMeetingsDialog = ({ clientRef, clientName }: ClientMeetingsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "finished">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- fetch raw JSON:API from BE
  const { data: meetingsRaw, isLoading, error } = useQuery({
    queryKey: ["clientMeetings", clientRef],
    queryFn: () => fetchClientMeetings(clientRef),
    enabled: !!clientRef,
  });

  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (payload: Parameters<typeof createClientMeeting>[1]) =>
      createClientMeeting(clientRef, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientMeetings", clientRef] });
      setIsCreateDialogOpen(false);
    },
  });

  // --- map JSON:API -> rows for the table
  const meetings: MeetingRow[] = useMemo(() => {
    const arr = Array.isArray(meetingsRaw?.data) ? meetingsRaw.data : [];

    return arr.map((entry: any) => {
      const a = entry.attributes || {};
      const meetingDateIso = a.meetingDate ?? a.meeting_date;
      const { day, time } = splitDayTime(meetingDateIso);

      // participants: [{ userName?, clientName?, supplierName?, response }]
      const participants: any[] = Array.isArray(a.participants) ? a.participants : [];
      const ourPerson =
        participants.find(p => p.userName)?.userName ||
        participants.find(p => p.supplierName)?.supplierName ||
        "";

      const uiStatus: "planned" | "finished" =
        a.status === "completed" ? "finished" :
        a.status === "scheduled" ? "planned"  :
        "planned";

      return {
        id: entry.id,
        title: a.title || "",
        withWho: clientName, // You can swap to the first client/supplier participant if you prefer
        ourPerson,
        day,
        time,
        location: a.location || "",
        status: uiStatus,
      };
    });
  }, [meetingsRaw, clientName]);

  // --- create meeting
  const handleCreateMeeting = async (formData: any) => {
    // Form is expected to send: { title|topic, description, date|day, time, durationMinutes, location, projectRef }
    const title = formData.title || formData.topic || "";
    const day = formData.day || formData.date; // support either
    const time = formData.time || "09:00";
    const meetingDateIso = day ? new Date(`${day}T${time}:00`).toISOString() : undefined;

    await createMut.mutateAsync({
      title,
      description: formData.description || "",
      meeting_date: meetingDateIso,                         // snake_case for BE
      duration_minutes: formData.durationMinutes || 60,
      location: formData.location || "",
      meeting_type: "client",
      status: "scheduled",
      project_ref: formData.projectRef,                     // required by BE (Meeting belongs_to :project)
    });
  };

  const filteredMeetings = useMemo(() => {
    const now = new Date();
    return meetings
      .filter(m => {
        const matchesSearch =
          !searchTerm ||
          m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.withWho.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.ourPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || m.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.day} ${a.time}`);
        const dateB = new Date(`${b.day} ${b.time}`);
        const isAUpcoming = dateA >= now;
        const isBUpcoming = dateB >= now;

        if (isAUpcoming && !isBUpcoming) return -1;
        if (!isAUpcoming && isBUpcoming) return 1;
        if (isAUpcoming && isBUpcoming) return dateA.getTime() - dateB.getTime();
        return dateB.getTime() - dateA.getTime();
      });
  }, [meetings, searchTerm, statusFilter]);

  const hasActiveFilters = statusFilter !== "all";

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
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

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader><DialogTitle>Meetings – {clientName}</DialogTitle></DialogHeader>
        <div className="py-10 text-center text-gray-500">Loading meetings…</div>
      </DialogContent>
    );
  }

  if (error) {
    return (
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader><DialogTitle>Meetings – {clientName}</DialogTitle></DialogHeader>
        <div className="py-10 text-center text-red-600">Failed to load meetings.</div>
      </DialogContent>
    );
  }

  return (
    <div>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Meetings – {clientName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search & actions */}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:bg-gray-100 ${hasActiveFilters ? "text-blue-600" : ""}`}
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white z-50" align="end">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Filter by Status</Label>
                    <RadioGroup value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
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
                  <TableHead>Topic</TableHead>
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
                      <Badge variant={m.status === "finished" ? "secondary" : "default"}>
                        {m.day ? formatDate(m.day) : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{m.time}</TableCell>
                    <TableCell>{m.location}</TableCell>
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
