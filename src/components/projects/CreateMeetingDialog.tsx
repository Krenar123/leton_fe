import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchUsers, fetchClients } from "@/services/api";
import { CreateMeetingData } from "@/types/project";

interface CreateMeetingDialogProps {
  onCreateMeeting: (meeting: any) => void;
  onClose: () => void;
}

interface User {
  ref: string;
  first_name: string;
  last_name: string;
}

interface Client {
  ref: string;
  name: string;
}

export const CreateMeetingDialog = ({
  onCreateMeeting,
  onClose
}: CreateMeetingDialogProps) => {
  const [formData, setFormData] = useState<CreateMeetingData>({
    title: "",
    start_at: "",
    end_at: "",
    location: "",
    agenda: "",
    notes: "",
    client_ref: "",
    client_attendees_text: "",
    attendee_user_refs: []
  });

  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, clientsData] = await Promise.all([
          fetchUsers(),
          fetchClients()
        ]);

        setUsers(Array.isArray(usersData) ? usersData : usersData?.data || []);
        setClients(Array.isArray(clientsData) ? clientsData : clientsData?.data || []);
      } catch (error) {
        console.error("Failed to load users and clients:", error);
      }
    };
    loadData();
  }, []);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) {
      errors.push("Title is required");
    }
    
    if (!formData.start_at) {
      errors.push("Meeting date and start time is required");
    }
    
    if (!formData.end_at) {
      errors.push("End time is required");
    }
    
    if (formData.start_at && formData.end_at) {
      const startDate = new Date(formData.start_at);
      const endDate = new Date(formData.end_at);
      
      if (endDate <= startDate) {
        errors.push("End time must be after start time");
      }
      
      const now = new Date();
      if (startDate < now) {
        errors.push("Warning: Start time is in the past");
      }
    }
    
    if (formData.attendee_user_refs.length === 0) {
      errors.push("At least one team member must be selected");
    }
    
    setValidationErrors(errors);
    return errors.length === 0 || (errors.length === 1 && errors[0].includes("Warning"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Convert to backend expected format - only include accepted parameters
      const backendPayload = {
        title: formData.title,
        meeting_date: formData.start_at, // Backend expects meeting_date instead of start_at
        duration_minutes: formData.start_at && formData.end_at ? 
          Math.round((new Date(formData.end_at).getTime() - new Date(formData.start_at).getTime()) / (1000 * 60)) : 60,
        location: formData.location || "",
        description: formData.agenda || "", // Backend expects description instead of agenda
        meeting_type: "client", // Use "client" type as it's the only valid type
        status: "scheduled"
      };
      
      await onCreateMeeting(backendPayload);
      setFormData({
        title: "",
        start_at: "",
        end_at: "",
        location: "",
        agenda: "",
        notes: "",
        client_ref: "",
        client_attendees_text: "",
        attendee_user_refs: []
      });
      setValidationErrors([]);
    } catch (error) {
      console.error("Failed to create meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateMeetingData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUserToggle = (userRef: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      attendee_user_refs: checked 
        ? [...prev.attendee_user_refs, userRef]
        : prev.attendee_user_refs.filter(ref => ref !== userRef)
    }));
  };

  const handleDateChange = (field: 'start_at' | 'end_at', date: string) => {
    const currentDateTime = getDateTimeFromISO(formData[field] || "");
    const time = currentDateTime.time || "09:00"; // Default time if none set
    if (date) {
      const dateTime = new Date(`${date}T${time}:00`).toISOString();
      handleChange(field, dateTime);
      
      // If we're changing the start date, also update the end date to match
      if (field === 'start_at') {
        const endTime = getDateTimeFromISO(formData.end_at || "").time || "10:00";
        const endDateTime = new Date(`${date}T${endTime}:00`).toISOString();
        handleChange("end_at", endDateTime);
      }
    }
  };

  const handleTimeChange = (field: 'start_at' | 'end_at', time: string) => {
    const currentDateTime = getDateTimeFromISO(formData[field] || "");
    const date = currentDateTime.date || new Date().toISOString().slice(0, 10); // Default to today if no date
    if (time) {
      const dateTime = new Date(`${date}T${time}:00`).toISOString();
      handleChange(field, dateTime);
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    // Use the same date as the start date for the end time
    const startDate = getDateTimeFromISO(formData.start_at || "");
    const date = startDate.date || new Date().toISOString().slice(0, 10);
    if (time) {
      const dateTime = new Date(`${date}T${time}:00`).toISOString();
      handleChange("end_at", dateTime);
    }
  };

  const getDateTimeFromISO = (isoString: string) => {
    if (!isoString) return { date: "", time: "" };
    const date = new Date(isoString);
    return {
      date: date.toISOString().slice(0, 10),
      time: date.toISOString().slice(11, 16)
    };
  };

  const startDateTime = getDateTimeFromISO(formData.start_at);
  const endDateTime = getDateTimeFromISO(formData.end_at);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Meeting</DialogTitle>
      </DialogHeader>
      
      {validationErrors.length > 0 && (
        <Alert variant={validationErrors.some(e => !e.includes("Warning")) ? "destructive" : "default"}>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title" 
            value={formData.title} 
            onChange={e => handleChange("title", e.target.value)} 
            placeholder="Meeting title" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting_date">Meeting Date *</Label>
          <Input 
            id="meeting_date" 
            type="date" 
            value={startDateTime.date} 
            onChange={e => handleDateChange("start_at", e.target.value)} 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time *</Label>
            <Input 
              id="start_time" 
              type="time" 
              value={startDateTime.time} 
              onChange={e => handleTimeChange("start_at", e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">End Time *</Label>
            <Input 
              id="end_time" 
              type="time" 
              value={endDateTime.time} 
              onChange={e => handleEndTimeChange} 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            value={formData.location} 
            onChange={e => handleChange("location", e.target.value)} 
            placeholder="Conference room, Teams link, etc." 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agenda">Agenda</Label>
          <Textarea 
            id="agenda" 
            value={formData.agenda} 
            onChange={e => handleChange("agenda", e.target.value)} 
            placeholder="Meeting agenda items..." 
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={formData.notes} 
            onChange={e => handleChange("notes", e.target.value)} 
            placeholder="Additional notes..." 
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Client (Optional)</Label>
          <Select value={formData.client_ref || "none"} onValueChange={value => handleChange("client_ref", value === "none" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No client</SelectItem>
              {clients && clients.length > 0 && clients.map(client => (
                <SelectItem key={client.attributes.ref} value={client.attributes.ref}>
                  {client.attributes.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_attendees_text">Client Meeting Attendees</Label>
          <Input 
            id="client_attendees_text" 
            value={formData.client_attendees_text} 
            onChange={e => handleChange("client_attendees_text", e.target.value)} 
            placeholder="Client attendees (free-form text)" 
          />
        </div>

        <div className="space-y-2">
          <Label>Our Meeting Attendees *</Label>
          <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-2">
            {users && users.length > 0 && users.map(user => (
              <div key={user.attributes.ref} className="flex items-center space-x-2">
                <Checkbox
                  id={`user-${user.attributes.ref}`}
                  checked={formData.attendee_user_refs.includes(user.attributes.ref)}
                  onCheckedChange={checked => handleUserToggle(user.attributes.ref, checked as boolean)}
                />
                <Label htmlFor={`user-${user.ref}`} className="text-sm">
                  {user.attributes.fullName}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Meeting"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};