import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/project";
import { Objective } from "@/types/objective";
import {
  fetchProjectById,
  fetchObjectivesByProject
} from "@/services/api";

export const useProjectData = (projectRef: string) => {
  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectError
  } = useQuery({
    queryKey: ["project", projectRef],
    queryFn: () => fetchProjectById(projectRef),
    enabled: !!projectRef
  });

  const {
    data: objectiveData,
    isLoading: objectiveLoading,
    isError: objectiveError
  } = useQuery({
    queryKey: ["objectives", projectRef],
    queryFn: () => fetchObjectivesByProject(projectRef),
    enabled: !!projectRef
  });

  const project: Project | null = projectData?.data?.attributes || null;

  console.log("project");
  console.log(project);
  const actionItems: Objective[] = Array.isArray(objectiveData?.data)
    ? objectiveData.data.map((entry: any) => ({
        ...entry.attributes,
        ref: entry.id
      }))
    : [];

  const handleProjectUpdate = (updatedProject: Project) => {
    const changeNote = {
      timestamp: new Date().toISOString(),
      changes: `Project updated: ${updatedProject.name}`,
      details: updatedProject
    };

    console.log("Project updated:", changeNote);
  };

  return {
    project,
    actionItems,
    isLoading: projectLoading || objectiveLoading,
    isError: projectError || objectiveError,
    handleProjectUpdate
  };
};
