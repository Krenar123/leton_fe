import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface CreateMeetingDialogProps {
  onCreateMeeting: (meeting: any) => void;
  onClose: () => void;
}
export const CreateMeetingDialog = ({
  onCreateMeeting,
  onClose
}: CreateMeetingDialogProps) => {
  const [formData, setFormData] = useState({
    topic: "",
    withWho: "",
    ourCompanyPerson: "",
    day: "",
    time: "",
    location: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateMeeting({
      ...formData,
      id: Date.now(),
      type: "upcoming",
      isPast: false
    });
    setFormData({
      topic: "",
      withWho: "",
      ourCompanyPerson: "",
      day: "",
      time: "",
      location: ""
    });
  };
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create New Meeting</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input id="topic" value={formData.topic} onChange={e => handleChange("topic", e.target.value)} placeholder="Meeting topic" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="withWho">Client Meeting Attendees</Label>
          <Input id="withWho" value={formData.withWho} onChange={e => handleChange("withWho", e.target.value)} placeholder="Client name - Contact person" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ourCompanyPerson">Our Meeting Attendees</Label>
          <Input id="ourCompanyPerson" value={formData.ourCompanyPerson} onChange={e => handleChange("ourCompanyPerson", e.target.value)} placeholder="Team member name" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Input id="day" type="date" value={formData.day} onChange={e => handleChange("day", e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={formData.time} onChange={e => handleChange("time", e.target.value)} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location/Link</Label>
          <Input id="location" value={formData.location} onChange={e => handleChange("location", e.target.value)} placeholder="Conference room, Teams link, etc." required />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Meeting
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>;
};