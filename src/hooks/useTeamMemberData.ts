
import { Objective, Task } from "@/types/strategy";

interface Meeting {
  id: string;
  company: string;
  person: string;
  ourPersons: string[];
  description: string;
  project: string;
  location: string;
  date: string;
  time: string;
}

interface TeamMemberData {
  objectives: {
    completed: number;
    total: number;
    data: Objective[];
  };
  tasks: {
    completed: number;
    total: number;
    data: Task[];
  };
  meetings: Meeting[];
}

export const useTeamMemberData = (memberId: number): TeamMemberData => {
  // Mock data - in a real app, this would come from an API
  return {
    objectives: {
      completed: 8,
      total: 12,
      data: [
        {
          id: "1",
          field: "Complete foundation inspection",
          start: "2025-01-15",
          due: "2025-02-15",
          participants: ["John Smith", "Mike Davis"],
          status: "In Progress" as const
        },
        {
          id: "2", 
          field: "Review architectural plans",
          start: "2025-01-20",
          due: "2025-02-10",
          participants: ["Lisa Chen", "Sarah Johnson"],
          status: "Finished" as const
        }
      ]
    },
    tasks: {
      completed: 15,
      total: 20,
      data: [
        {
          id: "1",
          objectiveId: "1",
          task: "Schedule inspection team",
          start: "2025-01-15",
          due: "2025-01-20",
          participants: ["John Smith"],
          status: "Finished" as const
        },
        {
          id: "2",
          objectiveId: "1", 
          task: "Prepare inspection checklist",
          start: "2025-01-18",
          due: "2025-01-25",
          participants: ["Mike Davis"],
          status: "In Progress" as const
        }
      ]
    },
    meetings: [
      {
        id: "1",
        company: "BuildCorp Inc",
        person: "James Wilson",
        ourPersons: ["John Smith", "Sarah Johnson"],
        description: "Project status review",
        project: "Office Building Renovation",
        location: "Conference Room A",
        date: "2025-07-15",
        time: "10:00 AM"
      },
      {
        id: "2",
        company: "Design Studios",
        person: "Emma Davis",
        ourPersons: ["Lisa Chen"],
        description: "Design approval meeting",
        project: "Residential Complex",
        location: "Client Office",
        date: "2025-07-18",
        time: "2:00 PM"
      }
    ]
  };
};
