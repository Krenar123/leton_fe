
import { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";

// Mock meeting data from projects
const mockProjectMeetings = [
  {
    id: "meeting-1",
    title: "Client Review - Office Building",
    projectId: 1,
    projectName: "Office Building Renovation",
    date: new Date(2025, 6, 10), // July 10, 2025
    time: "14:00",
    location: "Conference Room A",
    participants: ["John Smith", "Sarah Johnson"],
    type: "client-meeting"
  },
  {
    id: "meeting-2", 
    title: "Team Standup - Residential Complex",
    projectId: 2,
    projectName: "Residential Complex",
    date: new Date(2025, 6, 12), // July 12, 2025
    time: "09:00",
    location: "Teams Meeting",
    participants: ["Mike Davis", "Anna Wilson"],
    type: "internal-meeting"
  }
];

export const useCalendarData = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Convert project meetings to calendar events
    const meetingEvents: CalendarEvent[] = mockProjectMeetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      color: meeting.type === 'client-meeting' ? 'blue' : 'green',
      isAllDay: false,
      startDate: meeting.date,
      endDate: meeting.date,
      startTime: meeting.time,
      endTime: meeting.time.split(':').map((part, index) => 
        index === 1 ? String(parseInt(part) + 60).padStart(2, '0') : part
      ).join(':'), // Add 1 hour to start time
      location: meeting.location,
      participants: meeting.participants,
      note: `Project: ${meeting.projectName}`,
      notificationTiming: 'none' as const,
    }));

    setEvents(meetingEvents);
  }, []);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`, // More unique ID
    };
    
    console.log('Adding new event:', newEvent);
    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, newEvent];
      console.log('Updated events array:', updatedEvents);
      return updatedEvents;
    });
    
    return newEvent;
  };

  const updateEvent = (eventData: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === eventData.id ? eventData : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  console.log('Current events in hook:', events.length);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent
  };
};
