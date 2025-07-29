
import { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

interface ProjectInfoDialogProps {
  project: Project | null;
  onUpdate: (project: Project) => void;
  onClose: () => void;
}

export const ProjectInfoDialog = ({ project, onUpdate, onClose }: ProjectInfoDialogProps) => {
  const [formData, setFormData] = useState<Project | null>(null);

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    }
  }, [project]);

  const handleInputChange = (field: keyof Project, value: string | number) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onUpdate(formData);
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!formData) return null;

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Project Information</DialogTitle>
        <DialogDescription>
          Edit project details. Changes will be automatically saved as notes.
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
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
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
            onChange={(e) => handleInputChange('client', e.target.value)}
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
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right col-span-2">
              Start Date
            </Label>
            <Input
              id="start"
              type="date"
              value={formData.start}
              onChange={(e) => handleInputChange('start', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due" className="text-right col-span-2">
              Due Date
            </Label>
            <Input
              id="due"
              type="date"
              value={formData.due}
              onChange={(e) => handleInputChange('due', e.target.value)}
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
            onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
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
            onChange={(e) => handleInputChange('status', e.target.value as "Active" | "Completed")}
            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Job Profitability
          </Label>
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
