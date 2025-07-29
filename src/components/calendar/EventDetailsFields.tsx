
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventDetailsFieldsProps {
  location: string;
  notificationEmail: string;
  notificationTiming: 'none' | '1day' | '1week' | 'custom';
  customNotificationDays: number;
  note: string;
  participants: string;
  onLocationChange: (location: string) => void;
  onNotificationEmailChange: (email: string) => void;
  onNotificationTimingChange: (timing: 'none' | '1day' | '1week' | 'custom') => void;
  onCustomNotificationDaysChange: (days: number) => void;
  onNoteChange: (note: string) => void;
  onParticipantsChange: (participants: string) => void;
}

export const EventDetailsFields = ({
  location,
  notificationEmail,
  notificationTiming,
  customNotificationDays,
  note,
  participants,
  onLocationChange,
  onNotificationEmailChange,
  onNotificationTimingChange,
  onCustomNotificationDaysChange,
  onNoteChange,
  onParticipantsChange,
}: EventDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Enter event location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notificationEmail">Notification Email (optional)</Label>
        <Input
          id="notificationEmail"
          type="email"
          value={notificationEmail}
          onChange={(e) => onNotificationEmailChange(e.target.value)}
          placeholder="Email for notifications"
        />
      </div>

      <div className="space-y-2">
        <Label>Notification Timing</Label>
        <Select 
          value={notificationTiming} 
          onValueChange={onNotificationTimingChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No notification</SelectItem>
            <SelectItem value="1day">1 day before</SelectItem>
            <SelectItem value="1week">1 week before</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {notificationTiming === 'custom' && (
        <div className="space-y-2">
          <Label htmlFor="customDays">Days before</Label>
          <Input
            id="customDays"
            type="number"
            min="1"
            value={customNotificationDays}
            onChange={(e) => onCustomNotificationDaysChange(parseInt(e.target.value) || 1)}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="participants">Participants (optional)</Label>
        <Input
          id="participants"
          value={participants}
          onChange={(e) => onParticipantsChange(e.target.value)}
          placeholder="user1@email.com, user2@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Note (optional)</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Add any notes or details"
        />
      </div>
    </>
  );
};
