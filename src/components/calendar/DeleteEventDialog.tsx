
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { AlertTriangle } from "lucide-react";

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onConfirmDelete: (eventId: string) => void;
}

export const DeleteEventDialog = ({ open, onOpenChange, event, onConfirmDelete }: DeleteEventDialogProps) => {
  if (!event) return null;

  const handleDelete = () => {
    onConfirmDelete(event.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <DialogTitle>Delete Event</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete "{event.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
