
import { Objective, Task } from "@/types/strategy";
import { calculateStatusFromDates } from "@/utils/statusCalculator";

export const mockObjectives: Objective[] = [
  {
    id: "1",
    field: "Product Development",
    description: "Develop a comprehensive product strategy and roadmap for the next quarter",
    start: "2025-07-15",
    due: "2025-10-30",
    participants: ["John Doe", "Sarah Smith"],
    status: calculateStatusFromDates("2025-07-15", "2025-10-30")
  },
  {
    id: "2",
    field: "Market Analysis",
    description: "Conduct thorough market research and competitive analysis",
    start: "2025-08-01",
    due: "2025-09-15",
    participants: ["Mike Johnson"],
    status: "Finished" // Manually set as finished
  },
  {
    id: "3",
    field: "Quality Assurance",
    description: "Implement comprehensive testing protocols and quality standards",
    start: "2025-09-01",
    due: "2025-11-15",
    participants: ["Lisa Brown", "David Wilson", "Emma Davis", "James Taylor"],
    status: calculateStatusFromDates("2025-09-01", "2025-11-15")
  }
];

export const mockTasks: Task[] = [
  {
    id: "1",
    objectiveId: "1",
    task: "Design product architecture",
    start: "2025-07-15",
    due: "2025-08-15",
    participants: ["John Doe"],
    status: "Finished"
  },
  {
    id: "2",
    objectiveId: "1",
    task: "Develop MVP",
    start: "2025-08-16",
    due: "2025-09-30",
    participants: ["John Doe", "Sarah Smith"],
    status: "In Progress"
  },
  {
    id: "3",
    objectiveId: "1",
    task: "User testing",
    start: "2025-10-01",
    due: "2025-10-30",
    participants: ["Sarah Smith"],
    status: "Planned"
  },
  {
    id: "4",
    objectiveId: "2",
    task: "Competitor analysis",
    start: "2025-08-01",
    due: "2025-08-20",
    participants: ["Mike Johnson"],
    status: "Finished"
  },
  {
    id: "5",
    objectiveId: "2",
    task: "Market size assessment",
    start: "2025-08-21",
    due: "2025-09-15",
    participants: ["Mike Johnson"],
    status: "Finished"
  }
];
