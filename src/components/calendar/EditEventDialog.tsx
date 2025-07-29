
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEvent, EventColor } from "@/types/calendar";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: () => void;
}

const colorOptions: { value: EventColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
];

export const EditEventDialog = ({ open, onOpenChange, event, onUpdateEvent, onDeleteEvent }: EditEventDialogProps) => {
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
    if (event && open) {
      setFormData({
        title: event.title,
        color: event.color as EventColor,
        isAllDay: event.isAllDay,
        startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(event.endDate), 'yyyy-MM-dd'),
        startTime: event.startTime || '09:00',
        endTime: event.endTime || '10:00',
        location: event.location || '',
        notificationEmail: event.notificationEmail || '',
        notificationTiming: event.notificationTiming,
        customNotificationDays: event.customNotificationDays || 1,
        note: event.note || '',
        participants: event.participants.join(', '),
      });
    }
  }, [event, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;

    const updatedEvent: CalendarEvent = {
      ...event,
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
      participants: formData.participants ? formData.participants.split(',').map(p => p.trim()) : [],
    };

    onUpdateEvent(updatedEvent);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Event</DialogTitle>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onDeleteEvent}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded ${color.class} ${
                    formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={formData.isAllDay}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: !!checked }))}
            />
            <Label htmlFor="allDay">All day</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          {!formData.isAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationEmail">Notification Email</Label>
            <Input
              id="notificationEmail"
              type="email"
              value={formData.notificationEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, notificationEmail: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Notification Timing</Label>
            <Select 
              value={formData.notificationTiming} 
              onValueChange={(value: 'none' | '1day' | '1week' | 'custom') => 
                setFormData(prev => ({ ...prev, notificationTiming: value }))
              }
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

          {formData.notificationTiming === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customDays">Days before</Label>
              <Input
                id="customDays"
                type="number"
                min="1"
                value={formData.customNotificationDays}
                onChange={(e) => setFormData(prev => ({ ...prev, customNotificationDays: parseInt(e.target.value) || 1 }))}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="participants">Participants (comma-separated emails)</Label>
            <Input
              id="participants"
              value={formData.participants}
              onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
              placeholder="user1@email.com, user2@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
