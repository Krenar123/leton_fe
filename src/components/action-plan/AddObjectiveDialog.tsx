
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Objective } from "@/types/strategy";
import { calculateStatusFromDates } from "@/utils/statusCalculator";

interface AddObjectiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (objective: Omit<Objective, 'id'>) => void;
}

export const AddObjectiveDialog = ({ open, onOpenChange, onAdd }: AddObjectiveDialogProps) => {
  const [field, setField] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [due, setDue] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!field || !start || !due) return;

    const participantsList = participants
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    // Automatically calculate status based on dates
    const status = calculateStatusFromDates(start, due);

    onAdd({
      field,
      description: description || undefined,
      start,
      due,
      participants: participantsList,
      status
    });

    // Reset form
    setField("");
    setDescription("");
    setStart("");
    setDue("");
    setParticipants("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Objective</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="field">Objective Field *</Label>
            <Input
              id="field"
              value={field}
              onChange={(e) => setField(e.target.value)}
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
              <Label htmlFor="start">Start Date *</Label>
              <Input
                id="start"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="due">Due Date *</Label>
              <Input
                id="due"
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
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
            <Button type="submit">Add Objective</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
