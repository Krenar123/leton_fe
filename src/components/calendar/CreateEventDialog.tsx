
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarEvent, EventColor } from "@/types/calendar";
import { format } from "date-fns";
import { EventColorSelector } from "./EventColorSelector";
import { EventDateTimeFields } from "./EventDateTimeFields";
import { EventDetailsFields } from "./EventDetailsFields";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onCreateEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export const CreateEventDialog = ({ open, onOpenChange, selectedDate, onCreateEvent }: CreateEventDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    color: 'blue' as EventColor,
    isAllDay: false,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notificationEmail: '',
    notificationTiming: 'none' as 'none' | '1day' | '1week' | 'custom',
    customNotificationDays: 1,
    note: '',
    participants: '',
  });

  useEffect(() => {
    if (selectedDate && open) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setFormData(prev => ({
        ...prev,
        startDate: dateStr,
        endDate: dateStr,
      }));
    }
  }, [selectedDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: formData.title,
      color: formData.color,
      isAllDay: formData.isAllDay,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      startTime: formData.isAllDay ? undefined : formData.startTime,
      endTime: formData.isAllDay ? undefined : formData.endTime,
      location: formData.location || undefined,
      notificationEmail: formData.notificationEmail || undefined,
      notificationTiming: formData.notificationTiming,
      customNotificationDays: formData.notificationTiming === 'custom' ? formData.customNotificationDays : undefined,
      note: formData.note || undefined,
      participants: formData.participants ? formData.participants.split(',').map(p => p.trim()).filter(p => p) : [],
    };

    onCreateEvent(eventData);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      title: '',
      color: 'blue',
      isAllDay: false,
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      notificationEmail: '',
      notificationTiming: 'none',
      customNotificationDays: 1,
      note: '',
      participants: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <EventColorSelector
              selectedColor={formData.color}
              onColorChange={(color) => setFormData(prev => ({ ...prev, color }))}
            />
          </div>

          <EventDateTimeFields
            isAllDay={formData.isAllDay}
            startDate={formData.startDate}
            endDate={formData.endDate}
            startTime={formData.startTime}
            endTime={formData.endTime}
            onAllDayChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
            onStartDateChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
            onEndDateChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
            onStartTimeChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
            onEndTimeChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
          />

          <EventDetailsFields
            location={formData.location}
            notificationEmail={formData.notificationEmail}
            notificationTiming={formData.notificationTiming}
            customNotificationDays={formData.customNotificationDays}
            note={formData.note}
            participants={formData.participants}
            onLocationChange={(location) => setFormData(prev => ({ ...prev, location }))}
            onNotificationEmailChange={(email) => setFormData(prev => ({ ...prev, notificationEmail: email }))}
            onNotificationTimingChange={(timing) => setFormData(prev => ({ ...prev, notificationTiming: timing }))}
            onCustomNotificationDaysChange={(days) => setFormData(prev => ({ ...prev, customNotificationDays: days }))}
            onNoteChange={(note) => setFormData(prev => ({ ...prev, note }))}
            onParticipantsChange={(participants) => setFormData(prev => ({ ...prev, participants }))}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
