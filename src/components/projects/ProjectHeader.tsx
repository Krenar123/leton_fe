import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ProjectInfoDialog } from "./ProjectInfoDialog";
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
interface ProjectHeaderProps {
  project: Project;
  isProjectDialogOpen: boolean;
  setIsProjectDialogOpen: (open: boolean) => void;
  onProjectUpdate: (project: Project) => void;
}
export const ProjectHeader = ({
  project,
  isProjectDialogOpen,
  setIsProjectDialogOpen,
  onProjectUpdate
}: ProjectHeaderProps) => {
  return <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 bg-gray-100 border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
          <h1 className="text-2xl font-bold mb-2 text-gray-800 bg-slate-200">{project.name}</h1>
          <p className="text-gray-600 mb-1 font-medium">{project.client}</p>
          <p className="text-gray-500 text-sm">{project.location}</p>
          <p className="text-gray-600 text-sm mt-2">{project.description}</p>
        </Card>
      </DialogTrigger>
      
      <ProjectInfoDialog project={project} onUpdate={onProjectUpdate} onClose={() => setIsProjectDialogOpen(false)} />
    </Dialog>;
};