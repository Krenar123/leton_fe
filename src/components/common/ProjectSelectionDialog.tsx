
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useProjectData } from "@/hooks/useProjectData";

interface ProjectSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect: (projectId: number) => void;
  title: string;
  description: string;
}

// Mock projects data for now
const mockProjects = [
  {
    id: 1,
    name: "Office Building Renovation",
    client: "ABC Corp",
    status: "Active" as const
  },
  {
    id: 2,
    name: "Residential Complex",
    client: "XYZ Holdings",
    status: "Active" as const
  },
  {
    id: 3,
    name: "Mall Expansion",
    client: "Retail Partners",
    status: "Completed" as const
  },
  {
    id: 4,
    name: "Hospital Wing",
    client: "Health Systems Inc",
    status: "Active" as const
  }
];

export const ProjectSelectionDialog = ({
  isOpen,
  onClose,
  onProjectSelect,
  title,
  description
}: ProjectSelectionDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectSelect = (projectId: number) => {
    onProjectSelect(projectId);
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id}
              className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleProjectSelect(project.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No projects found
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
