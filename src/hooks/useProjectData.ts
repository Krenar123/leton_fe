
import { useState, useEffect } from "react";
import { Project, ActionItem } from "@/types/project";

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Office Building Renovation",
    client: "ABC Corp",
    location: "New York, NY",
    start: "2025-07-15",
    due: "2025-12-30",
    value: 250000,
    profitability: 15.5,
    status: "Active",
    description: "Complete renovation of office building"
  },
  {
    id: 2,
    name: "Residential Complex",
    client: "XYZ Holdings",
    location: "Los Angeles, CA",
    start: "2025-08-01",
    due: "2026-06-15",
    value: 1200000,
    profitability: 22.3,
    status: "Active",
    description: "New residential complex construction"
  },
  {
    id: 3,
    name: "Mall Expansion",
    client: "Retail Partners",
    location: "Chicago, IL",
    start: "2025-02-10",
    due: "2025-07-20",
    value: 800000,
    profitability: 18.7,
    status: "Completed",
    description: "Shopping mall expansion project"
  },
  {
    id: 4,
    name: "Hospital Wing",
    client: "Health Systems Inc",
    location: "Miami, FL",
    start: "2025-09-01",
    due: "2026-04-30",
    value: 950000,
    profitability: 12.8,
    status: "Active",
    description: "Hospital wing construction"
  }
];

const mockActionItems: ActionItem[] = [
  {
    task: "Construction phase 1",
    startDate: "2025-07-15",
    endDate: "2025-12-30",
    assignees: ["John", "Sarah"],
    completed: false
  },
  {
    task: "Material procurement",
    startDate: "2025-07-10",
    endDate: "2025-08-15",
    assignees: ["Mike", "Lisa"],
    completed: true
  },
  {
    task: "Quality inspection",
    startDate: "2025-12-15",
    endDate: "2025-12-25",
    assignees: ["David"],
    completed: false
  },
  {
    task: "Final documentation",
    startDate: "2025-12-20",
    endDate: "2025-12-30",
    assignees: ["Anna", "Tom"],
    completed: false
  },
  {
    task: "Client handover",
    startDate: "2025-12-28",
    endDate: "2025-12-30",
    assignees: ["John", "Sarah", "Mike"],
    completed: false
  }
];

export const useProjectData = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const id = parseInt(projectId || "0");
    const foundProject = mockProjects.find(p => p.id === id);
    setProject(foundProject || null);
  }, [projectId]);

  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
    console.log('Project updated:', updatedProject);
    
    const changeNote = {
      timestamp: new Date().toISOString(),
      changes: `Project information updated: ${updatedProject.name}`,
      details: updatedProject
    };
    console.log('Change note created:', changeNote);
  };

  return {
    project,
    actionItems: mockActionItems,
    handleProjectUpdate
  };
};
