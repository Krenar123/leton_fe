import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/types/task";
import { calculateStatusFromDates } from "@/utils/statusCalculator";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (task: Omit<Task, "id">) => void;
  objectiveRef: string;
}

export const AddTaskDialog = ({
  open,
  onOpenChange,
  onAdd,
  objectiveRef
}: AddTaskDialogProps) => {
  const [title, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStart] = useState("");
  const [due_date, setDue] = useState("");
  const [participants, setParticipants] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !start_date || !due_date) return;

    const participantsList = participants
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const status = calculateStatusFromDates(start_date, due_date); // Optional if backend handles status

    onAdd({
      objectiveRef,
      title,
      description: description || undefined,
      start_date,
      due_date,
      participants: participantsList,
      status
    });

    // Reset form
    setTask("");
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
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Name *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTask(e.target.value)}
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
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
