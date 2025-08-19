
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/types/objective";
import { updateObjective } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface EditObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (objective: Objective) => void;
  objective: Objective | null;
  projectRef: string;
}

export const EditObjectiveDialog = ({ open, onOpenChange, onSave, objective, projectRef }: EditObjectiveDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [participants, setParticipants] = useState("");

  useEffect(() => {
    if (objective) {
      setTitle(objective.title);
      setDescription(objective.description || "");
      setStartDate(objective.start_date);
      setEndDate(objective.end_date);
      setParticipants(objective.participants.join(", "));
    }
  }, [objective]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!objective || !title || !start_date || !end_date) return;
  
    const participantsList = participants
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  
    const payload = {
      title,
      description: description || undefined,
      start_date,
      end_date,
      participants: participantsList,
    };
  
    console.log(objective)
    try {
      const response = await updateObjective(projectRef, objective.ref, payload);

      toast({ title: "Objective updated successfully" });
  
      onSave(response.data.attributes); // optional: ensure parent state updates
      onOpenChange(false);
    } catch (error: any) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update objective",
        variant: "destructive",
      });
    }
  };  
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Objective</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Objective Field *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Product Development"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the objective..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">Due Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="participants">Participants</Label>
            <Input
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Enter names separated by commas"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
