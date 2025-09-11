// src/components/projects/MeetingsDialog.tsx
import { useMemo, useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateMeetingDialog } from "./CreateMeetingDialog";
import { EditMeetingDialog } from "./EditMeetingDialog";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProjectMeetings } from "@/hooks/useProjectMeetings";
import { Meeting, CreateMeetingData, UpdateMeetingData } from "@/types/project";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface MeetingsDialogProps {
  projectRef: string;      // <- add this
  projectName: string;
  onClose: () => void;
}

export const MeetingsDialog = ({ projectRef, projectName }: MeetingsDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "planned" | "finished">("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: meetings = [], isLoading, createMeeting, updateMeeting, deleteMeeting } = useProjectMeetings(projectRef);

  const isPast = (m: Meeting) => new Date(m.start_at) < new Date();

  const filteredMeetings = useMemo(() => {
    const now = new Date();
    const matches = (meetings as Meeting[]).filter(m => {
      const matchesSearch =
        !searchTerm ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.client_attendees_text ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.location ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.agenda ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const past = new Date(m.start_at) < now;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "planned" && !past) ||
        (statusFilter === "finished" && past);

      return matchesSearch && matchesStatus;
    });

    // upcoming first asc; past last desc
    return matches.sort((a, b) => {
      const da = new Date(a.start_at);
      const db = new Date(b.start_at);
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const getAttendeeInitials = (attendeeRefs: string[]) => {
    // This would need to be enhanced to get actual user names from the users data
    return attendeeRefs.length > 0 ? `${attendeeRefs.length} attendee(s)` : "No attendees";
  };

  // Create -> call API (normalize FE -> BE payload)
  const handleCreateMeeting = async (data: CreateMeetingData) => {
    await createMeeting(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateMeeting = async (data: UpdateMeetingData) => {
    await updateMeeting({ meetingRef: data.id, payload: data });
    setIsEditDialogOpen(false);
    setSelectedMeeting(null);
  };

  const handleDeleteMeeting = async (meetingRef: string) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      await deleteMeeting(meetingRef);
    }
  };

  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsViewDialogOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsEditDialogOpen(true);
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
                  <TableHead>When</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Our Attendees</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6}>Loading…</TableCell></TableRow>
                ) : (
                  filteredMeetings.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.title}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={isPast(m) ? "secondary" : "default"}>
                            {formatDate(m.start_at)}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            {formatTime(m.start_at)} - {formatTime(m.end_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {m.client_ref ? (
                          <span className="text-sm">Client linked</span>
                        ) : (
                          <span className="text-sm text-gray-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getAttendeeInitials(m.attendee_user_refs)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{m.location || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewMeeting(m)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditMeeting(m)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMeeting(m.ref)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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

        {/* Edit Meeting Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          {selectedMeeting && (
            <EditMeetingDialog
              meeting={selectedMeeting}
              onUpdateMeeting={handleUpdateMeeting}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedMeeting(null);
              }}
            />
          )}
        </Dialog>

        {/* View Meeting Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          {selectedMeeting && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Meeting Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm">{selectedMeeting.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Start Time</Label>
                    <p className="text-sm">{formatDate(selectedMeeting.start_at)} at {formatTime(selectedMeeting.start_at)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">End Time</Label>
                    <p className="text-sm">{formatDate(selectedMeeting.end_at)} at {formatTime(selectedMeeting.end_at)}</p>
                  </div>
                </div>
                {selectedMeeting.location && (
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{selectedMeeting.location}</p>
                  </div>
                )}
                {selectedMeeting.agenda && (
                  <div>
                    <Label className="text-sm font-medium">Agenda</Label>
                    <p className="text-sm whitespace-pre-wrap">{selectedMeeting.agenda}</p>
                  </div>
                )}
                {selectedMeeting.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm whitespace-pre-wrap">{selectedMeeting.notes}</p>
                  </div>
                )}
                {selectedMeeting.client_ref && (
                  <div>
                    <Label className="text-sm font-medium">Client</Label>
                    <p className="text-sm">Client linked (Ref: {selectedMeeting.client_ref})</p>
                  </div>
                )}
                {selectedMeeting.client_attendees_text && (
                  <div>
                    <Label className="text-sm font-medium">Client Attendees</Label>
                    <p className="text-sm">{selectedMeeting.client_attendees_text}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Our Attendees</Label>
                  <p className="text-sm">{getAttendeeInitials(selectedMeeting.attendee_user_refs)}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditMeeting(selectedMeeting);
                }}>
                  Edit Meeting
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </DialogContent>
    </div>
  );
};
