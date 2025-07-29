
import { GanttChart } from "@/components/action-plan/GanttChart";
import { Project } from "@/types/project";

interface GanttTabProps {
  project: Project;
}

export const GanttTab = ({ project }: GanttTabProps) => {
  return <GanttChart project={project} />;
};
