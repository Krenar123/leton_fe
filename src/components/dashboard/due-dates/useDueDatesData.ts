
import { useState, useMemo } from "react";
import { ProjectObjective, ColumnVisibility } from "./types";

const mockObjectives: ProjectObjective[] = [
  {
    id: "1",
    field: "Product Development",
    projectName: "Office Building Renovation",
    projectId: 1,
    start: "2025-07-15",
    due: "2025-10-30",
    participants: ["John Doe", "Sarah Smith"],
    status: "In Progress"
  },
  {
    id: "2",
    field: "Market Analysis",
    projectName: "Residential Complex",
    projectId: 2,
    start: "2025-08-01",
    due: "2025-09-15",
    participants: ["Mike Johnson"],
    status: "Planned"
  },
  {
    id: "3",
    field: "Quality Assurance",
    projectName: "Hospital Wing",
    projectId: 4,
    start: "2025-09-01",
    due: "2025-11-15",
    participants: ["Lisa Brown", "David Wilson"],
    status: "In Progress"
  },
  {
    id: "4",
    field: "Budget Planning",
    projectName: "Shopping Center",
    projectId: 5,
    start: "2025-07-20",
    due: "2025-08-30",
    participants: ["Anna Lee", "Tom Harris"],
    status: "Already Due"
  },
  {
    id: "5",
    field: "Risk Assessment",
    projectName: "Corporate Headquarters",
    projectId: 6,
    start: "2025-08-10",
    due: "2025-12-01",
    participants: ["Emma Davis", "James Wilson", "Kate Brown"],
    status: "Planned"
  }
];

export const useDueDatesData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    projectName: true,
    start: true,
    due: true,
    participants: true,
    status: true
  });

  const filteredObjectives = useMemo(() => {
    return mockObjectives.filter(objective => {
      const matchesSearch = searchTerm === "" || 
                           objective.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           objective.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "" || objective.status === statusFilter;
      const matchesProject = projectFilter === "" || objective.projectName === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [searchTerm, statusFilter, projectFilter]);

  const handleClearFilters = () => {
    setStatusFilter("");
    setProjectFilter("");
  };

  const hasActiveFilters = statusFilter !== "" || projectFilter !== "";
  const uniqueProjects = [...new Set(mockObjectives.map(obj => obj.projectName))];

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    columnVisibility,
    setColumnVisibility,
    filteredObjectives,
    handleClearFilters,
    hasActiveFilters,
    uniqueProjects
  };
};
