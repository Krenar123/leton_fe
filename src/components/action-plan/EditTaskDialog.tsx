import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/task";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  task: Task | null;
}

export const EditTaskDialog = ({ open, onOpenChange, onSave, task }: EditTaskDialogProps) => {
  const [titleName, setTitleName] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStart] = useState("");
  const [due_date, setDue] = useState("");
  const [participants, setParticipants] = useState("");

  useEffect(() => {
    console.log(task);
    if (task) {
      setTitleName(task.title);
      setDescription(task.description || "");
      setStart(task.start_date);
      setDue(task.due_date);
      setParticipants(task.participants.join(", "));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!task || !titleName || !start_date || !due_date) return;

    const participantsList = participants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    onSave({
      ...task,
      title: titleName,
      description: description || undefined,
      start_date,
      due_date,
      participants: participantsList,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Name *</Label>
            <Input
              id="title"
              value={titleName}
              onChange={(e) => setTitleName(e.target.value)}
              placeholder="e.g., Design wireframes"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the task..."
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
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={due_date}
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
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
