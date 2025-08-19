import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { updateProject } from "@/services/api";

interface Project {
  id: number; // could be ref or numeric
  ref: string;
  name: string;
  client: string;
  location: string;
  start_date: string;
  end_date: string;
  value: number;
  profitability: number;
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  description?: string;
}

interface ProjectInfoDialogProps {
  project: Project | null;
  onUpdate: (project: Project) => void;
  onClose: () => void;
}

export const ProjectInfoDialog = ({
  project,
  onUpdate,
  onClose,
}: ProjectInfoDialogProps) => {
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        start_date: project.start_date?.split("T")[0] || "",
        end_date: project.end_date?.split("T")[0] || "",
      });
    }
  }, [project]);

  const handleInputChange = (field: keyof Project, value: string | number) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        budget: formData.value,
        status: formData.status,
        start_date: new Date(formData.start_date).toISOString().split("T")[0],
        end_date: new Date(formData.end_date).toISOString().split("T")[0],
      };

      const response = await updateProject(formData.ref, payload);
      const updated = response.data.attributes;

      onUpdate({
        ...formData,
        ...updated,
        start_date: updated.start_date,
        end_date: updated.end_date,
        value: updated.value,
        status: updated.status,
      });

      toast({
        title: "Project updated",
        description: "Changes saved successfully.",
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Unable to update project",
        variant: "destructive",
      });
    }
  };

  if (!formData) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Project Information</DialogTitle>
        <DialogDescription>
          Edit project details. Changes will be saved immediately.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Project Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) =>
              handleInputChange("description", e.target.value)
            }
            className="col-span-3"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="client" className="text-right">
            Client Name
          </Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => handleInputChange("client", e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start_date" className="text-right col-span-2">
              Start Date
            </Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              className="col-span-2"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end_date" className="text-right col-span-2">
              Due Date
            </Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              className="col-span-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="value" className="text-right">
            Project Value
          </Label>
          <Input
            id="value"
            type="number"
            value={formData.value}
            onChange={(e) =>
              handleInputChange("value", parseInt(e.target.value) || 0)
            }
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              handleInputChange(
                "status",
                e.target.value as Project["status"]
              )
            }
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Job Profitability</Label>
          <div className="col-span-3 flex h-10 items-center px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md">
            {formData.profitability}% (Calculated automatically)
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
