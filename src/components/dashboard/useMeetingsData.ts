
import { useState } from "react";
import { Meeting } from "./types/meetings";

const mockMeetings: Meeting[] = [
  {
    id: "meeting-1",
    companyName: "Smith Construction LLC",
    name: "John Smith",
    ourPersons: ["Sarah Johnson", "Mike Davis"],
    description: "Client Review - Office Building Progress",
    project: "Office Building Renovation",
    projectId: 1,
    location: "Conference Room A",
    date: "2025-07-12",
    time: "14:00",
    status: "upcoming",
    type: "client-meeting"
  },
  {
    id: "meeting-2", 
    companyName: "Wilson Architects",
    name: "Anna Wilson",
    ourPersons: ["Mike Davis"],
    description: "Team Standup - Residential Complex",
    project: "Residential Complex",
    projectId: 2,
    location: "Teams Meeting",
    date: "2025-07-15",
    time: "09:00",
    status: "upcoming",
    type: "internal-meeting"
  },
  {
    id: "meeting-3",
    companyName: "Brown Development Group",
    name: "David Brown",
    ourPersons: ["Sarah Johnson", "Tom Wilson"],
    description: "Project Kickoff Meeting",
    project: "Shopping Mall Renovation",
    projectId: 3,
    location: "Client Office",
    date: "2025-07-18",
    time: "10:30",
    status: "upcoming",
    type: "client-meeting"
  }
];

export const useMeetingsData = () => {
  const [meetings] = useState<Meeting[]>(mockMeetings);

  // Only show upcoming meetings, sorted by date
  const upcomingMeetings = meetings
    .filter(meeting => meeting.status === "upcoming")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredMeetings = (searchTerm: string, personFilter: string, ourPersonsFilter: string, projectFilter: string, dateFilter: string) => {
    return upcomingMeetings.filter(meeting => {
      const matchesSearch = meeting.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           meeting.ourPersons.some(person => person.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPerson = personFilter === "all" || meeting.name === personFilter;
      const matchesOurPersons = ourPersonsFilter === "all" || meeting.ourPersons.includes(ourPersonsFilter);
      const matchesProject = projectFilter === "all" || meeting.project === projectFilter;
      
      // Date filtering logic
      const meetingDate = new Date(meeting.date);
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = meetingDate.toDateString() === today.toDateString();
      } else if (dateFilter === "this-week") {
        matchesDate = meetingDate >= startOfWeek && meetingDate <= endOfWeek;
      } else if (dateFilter === "this-month") {
        matchesDate = meetingDate >= startOfMonth && meetingDate <= endOfMonth;
      }
      
      return matchesSearch && matchesPerson && matchesOurPersons && matchesProject && matchesDate;
    });
  };

  const uniqueProjects = Array.from(new Set(upcomingMeetings.map(m => m.project)));
  const uniquePersons = Array.from(new Set(upcomingMeetings.map(m => m.name)));
  const uniqueOurPersons = Array.from(new Set(upcomingMeetings.flatMap(m => m.ourPersons)));

  return {
    meetings: upcomingMeetings,
    filteredMeetings,
    uniqueProjects,
    uniquePersons,
    uniqueOurPersons
  };
};
