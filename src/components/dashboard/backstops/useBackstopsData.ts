
import { useState } from "react";
import { Backstop } from "./types";

const mockBackstops: Backstop[] = [
  {
    id: 1,
    what: "Task Due Date",
    where: "Phase 1 - Foundation",
    backstopValue: "2025-08-15",
    status: "On Track",
    type: "task_due",
    isReached: false,
    severity: "medium",
    dateCreated: "2025-07-15",
    isAutomatic: true,
    projectId: 1,
    projectName: "Office Building Renovation"
  },
  {
    id: 2,
    what: "Item Line Cost",
    where: "Electrical Installation",
    backstopValue: "$3,500",
    status: "$3,200 (91%)",
    currentValue: "$3,200",
    type: "item_expense",
    isReached: false,
    severity: "medium",
    dateCreated: "2025-07-20",
    isAutomatic: false,
    projectId: 1,
    projectName: "Office Building Renovation"
  },
  {
    id: 3,
    what: "Project Profitability",
    where: "Overall Project",
    backstopValue: "15%",
    status: "18.5%",
    currentValue: "18.5%",
    type: "job_profitability",
    isReached: false,
    severity: "low",
    dateCreated: "2025-07-25",
    isAutomatic: false,
    projectId: 1,
    projectName: "Office Building Renovation"
  },
  {
    id: 4,
    what: "Projected Cash Flow",
    where: "September 2025",
    backstopValue: "50%",
    status: "65%",
    currentValue: "65%",
    type: "cashflow",
    isReached: true,
    severity: "high",
    dateCreated: "2025-07-30",
    isAutomatic: false,
    projectId: 1,
    projectName: "Office Building Renovation"
  },
  {
    id: 5,
    what: "Task Due Date",
    where: "Phase 2 - Framing",
    backstopValue: "2025-09-15",
    status: "Delayed",
    type: "task_due",
    isReached: true,
    severity: "high",
    dateCreated: "2025-08-01",
    isAutomatic: true,
    projectId: 2,
    projectName: "Residential Complex"
  },
  {
    id: 6,
    what: "Item Line Cost",
    where: "HVAC System",
    backstopValue: "$8,000",
    status: "$8,500 (106%)",
    currentValue: "$8,500",
    type: "item_expense",
    isReached: true,
    severity: "medium",
    dateCreated: "2025-08-05",
    isAutomatic: false,
    projectId: 2,
    projectName: "Residential Complex"
  }
];

export const useBackstopsData = () => {
  const [backstops] = useState<Backstop[]>(mockBackstops);

  const filteredBackstops = (searchTerm: string, statusFilter: string, typeFilter: string, projectFilter: string) => {
    return backstops.filter(backstop => {
      const matchesSearch = backstop.what.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           backstop.where.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           backstop.projectName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "reached" && backstop.isReached);
      const matchesType = typeFilter === "all" || backstop.type === typeFilter;
      const matchesProject = projectFilter === "all" || backstop.projectName === projectFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesProject;
    });
  };

  const uniqueProjects = Array.from(new Set(backstops.map(b => b.projectName)));

  return {
    backstops,
    filteredBackstops,
    uniqueProjects
  };
};
