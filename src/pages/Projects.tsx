import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ProjectOverview from "@/components/projects/ProjectOverview";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectTable from "@/components/projects/ProjectTable";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import { Dialog } from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllProjects } from "@/services/api";

interface Project {
  id: number;
  ref: string;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "active" | "completed";
  description?: string;
}

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
  const queryClient = useQueryClient();
  const location = useLocation();
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed">("all");
  const [filters, setFilters] = useState<FilterState>({
    client: "",
    location: "",
    start: "",
    due: "",
    value: { min: "", max: "" },
    profit: { min: "", max: "" },
    status: "",
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    client: true,
    location: true,
    start: true,
    due: true,
    value: true,
    profit: true,
  });

  useEffect(() => {
    if ((location.state as any)?.openNewProject) {
      setIsNewProjectOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchAllProjects,
  });

  const projects: Project[] = Array.isArray(data?.data)
    ? data.data.map((entry: any) => entry.attributes)
    : [];

  const activeProjects = projects.filter((p) => p.status === "active");
  const completedProjects = projects.filter((p) => p.status === "completed");

  const hasActiveFilters = Object.values(filters).some((filter) =>
    typeof filter === "string" ? filter !== "" : filter.min !== "" || filter.max !== ""
  );

  const getFilteredProjects = () => {
    let filtered = projects;

    if (statusFilter === "active") {
      filtered = filtered.filter((p) => p.status === "active");
    } else if (statusFilter === "completed") {
      filtered = filtered.filter((p) => p.status === "completed");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.client) {
      filtered = filtered.filter((p) =>
        p.client.toLowerCase().includes(filters.client.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.value.min) {
      filtered = filtered.filter((p) => p.value >= parseFloat(filters.value.min));
    }

    if (filters.value.max) {
      filtered = filtered.filter((p) => p.value <= parseFloat(filters.value.max));
    }

    if (filters.profit.min) {
      filtered = filtered.filter((p) => p.profitability >= parseFloat(filters.profit.min));
    }

    if (filters.profit.max) {
      filtered = filtered.filter((p) => p.profitability <= parseFloat(filters.profit.max));
    }

    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const handleProjectCreate = (project: Project) => {
    // Refetch the projects list after creation
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const clearFilters = () => {
    setFilters({
      client: "",
      location: "",
      start: "",
      due: "",
      value: { min: "", max: "" },
      profit: { min: "", max: "" },
      status: "",
    });
  };

  return (
    <div className="space-y-6 px-[16px] py-[16px]">
      <ProjectOverview
        totalProjects={projects.length}
        activeProjects={activeProjects.length}
        completedProjects={completedProjects.length}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <Card className="p-6 px-[16px] py-[16px]">
        <ProjectFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          onNewProject={() => setIsNewProjectOpen(true)}
          newProjectDialog={null}
        />

        <ProjectTable projects={filteredProjects} columnVisibility={columnVisibility} />
      </Card>

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <NewProjectDialog
          projects={projects}
          onProjectCreate={handleProjectCreate}
          onClose={() => setIsNewProjectOpen(false)}
        />
      </Dialog>
    </div>
  );
};

export default Projects;
