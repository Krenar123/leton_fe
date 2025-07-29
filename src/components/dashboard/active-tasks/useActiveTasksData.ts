
import { useState, useMemo } from "react";
import { ActiveTask } from "./types";

export const useActiveTasksData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const activeTasks: ActiveTask[] = [
    {
      id: 1,
      task: "Final documentation",
      project: "Office Building Renovation",
      projectId: 1,
      start: "2025-07-15",
      due: "2025-07-30",
      assignees: ["Anna", "Tom"],
      status: "In Progress"
    },
    {
      id: 2,
      task: "Quality inspection",
      project: "Residential Complex",
      projectId: 2,
      start: "2025-07-20",
      due: "2025-07-25",
      assignees: ["David"],
      status: "Not Started"
    },
    {
      id: 3,
      task: "Material procurement",
      project: "Hospital Wing",
      projectId: 4,
      start: "2025-07-25",
      due: "2025-08-15",
      assignees: ["Mike", "Lisa"],
      status: "In Progress"
    },
    {
      id: 4,
      task: "Construction phase 1",
      project: "Shopping Center",
      projectId: 5,
      start: "2025-07-30",
      due: "2025-12-30",
      assignees: ["John", "Sarah"],
      status: "Not Started"
    },
    {
      id: 5,
      task: "Client handover",
      project: "Office Building Renovation",
      projectId: 1,
      start: "2025-08-05",
      due: "2025-08-05",
      assignees: ["John", "Sarah", "Mike"],
      status: "Completed"
    }
  ];

  const filteredTasks = useMemo(() => {
    return activeTasks.filter(task => {
      const matchesSearch = searchTerm === "" || 
                           task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.assignees.some(assignee => assignee.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "" || task.status === statusFilter;
      const matchesProject = projectFilter === "" || task.project === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [activeTasks, searchTerm, statusFilter, projectFilter]);

  const handleClearFilters = () => {
    setStatusFilter("");
    setProjectFilter("");
  };

  const hasActiveFilters = statusFilter !== "" || projectFilter !== "";
  const uniqueProjects = [...new Set(activeTasks.map(task => task.project))];

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    projectFilter,
    setProjectFilter,
    filteredTasks,
    handleClearFilters,
    hasActiveFilters,
    uniqueProjects
  };
};
