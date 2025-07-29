import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectTable from "@/components/projects/ProjectTable";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import { Dialog } from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";
interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "Active" | "Completed";
  description?: string;
}
const mockProjects: Project[] = [{
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
}, {
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
}, {
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
}, {
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
}];
interface FilterState {
  client: string;
  location: string;
  start: string;
  due: string;
  value: {
    min: string;
    max: string;
  };
  profit: {
    min: string;
    max: string;
  };
  status: string;
}
interface ColumnVisibility {
  client: boolean;
  location: boolean;
  start: boolean;
  due: boolean;
  value: boolean;
  profit: boolean;
}
const Projects = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [filters, setFilters] = useState<FilterState>({
    client: "",
    location: "",
    start: "",
    due: "",
    value: {
      min: "",
      max: ""
    },
    profit: {
      min: "",
      max: ""
    },
    status: ""
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    client: true,
    location: true,
    start: true,
    due: true,
    value: true,
    profit: true
  });
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.openNewProject) {
      setIsNewProjectOpen(true);
      // Clear the state to avoid reopening on future visits
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const activeProjects = projects.filter(p => p.status === "Active");
  const completedProjects = projects.filter(p => p.status === "Completed");
  const hasActiveFilters = Object.values(filters).some(filter => typeof filter === 'string' ? filter !== '' : filter.min !== '' || filter.max !== '');
  const getFilteredProjects = () => {
    let filtered = projects;

    // Status filter from tabs
    if (statusFilter === "active") {
      filtered = filtered.filter(p => p.status === "Active");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter(p => p.status === "Completed");
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.client.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Additional filters
    if (filters.client) {
      filtered = filtered.filter(p => p.client.toLowerCase().includes(filters.client.toLowerCase()));
    }
    if (filters.location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.value.min) {
      filtered = filtered.filter(p => p.value >= parseInt(filters.value.min));
    }
    if (filters.value.max) {
      filtered = filtered.filter(p => p.value <= parseInt(filters.value.max));
    }
    if (filters.profit.min) {
      filtered = filtered.filter(p => p.profitability >= parseFloat(filters.profit.min));
    }
    if (filters.profit.max) {
      filtered = filtered.filter(p => p.profitability <= parseFloat(filters.profit.max));
    }
    return filtered;
  };
  const filteredProjects = getFilteredProjects();
  const handleProjectCreate = (project: Project) => {
    setProjects([...projects, project]);
  };
  const clearFilters = () => {
    setFilters({
      client: "",
      location: "",
      start: "",
      due: "",
      value: {
        min: "",
        max: ""
      },
      profit: {
        min: "",
        max: ""
      },
      status: ""
    });
  };
  return <div className="space-y-6 px-[16px] py-[16px]">
      {/* Project Overview Cards */}
      <ProjectOverview totalProjects={projects.length} activeProjects={activeProjects.length} completedProjects={completedProjects.length} statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      {/* Project List */}
      <Card className="p-6 px-[16px] py-[16px]">
        {/* Search and Controls */}
        <ProjectFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} filters={filters} onFiltersChange={setFilters} columnVisibility={columnVisibility} onColumnVisibilityChange={setColumnVisibility} hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} onNewProject={() => setIsNewProjectOpen(true)} newProjectDialog={null} />

        {/* Projects Table */}
        <ProjectTable projects={filteredProjects} columnVisibility={columnVisibility} />
      </Card>

      {/* New Project Dialog */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <NewProjectDialog projects={projects} onProjectCreate={handleProjectCreate} onClose={() => setIsNewProjectOpen(false)} />
      </Dialog>
    </div>;
};
export default Projects;