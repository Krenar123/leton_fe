
import { useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EditEventDialog } from "@/components/calendar/EditEventDialog";
import { DeleteEventDialog } from "@/components/calendar/DeleteEventDialog";
import { CalendarEvent } from "@/types/calendar";
import { useCalendarData } from "@/hooks/useCalendarData";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [deleteEventOpen, setDeleteEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarData();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setCreateEventOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditEventOpen(true);
  };

  const handleCreateEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent = addEvent(eventData);
    setCreateEventOpen(false);
    setSelectedDate(null);
    console.log('New event created:', newEvent);
    console.log('Total events after creation:', events.length + 1);
  };

  const handleUpdateEvent = (eventData: CalendarEvent) => {
    updateEvent(eventData);
    setEditEventOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setDeleteEventOpen(false);
    setEditEventOpen(false);
    setSelectedEvent(null);
  };

  const openDeleteDialog = () => {
    setEditEventOpen(false);
    setDeleteEventOpen(true);
  };

  return (
    <div className="space-y-6">
      <CalendarView 
        events={events}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
      />

      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        selectedDate={selectedDate}
        onCreateEvent={handleCreateEvent}
      />

      <EditEventDialog
        open={editEventOpen}
        onOpenChange={setEditEventOpen}
        event={selectedEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={openDeleteDialog}
      />

      <DeleteEventDialog
        open={deleteEventOpen}
        onOpenChange={setDeleteEventOpen}
        event={selectedEvent}
        onConfirmDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar;
