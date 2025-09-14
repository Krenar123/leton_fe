
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { Note } from "./NotesDialog";

interface CreateNoteDialogProps {
  projectRef: string;
  onCreateNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

export const CreateNoteDialog = ({ projectRef, onCreateNote, onClose }: CreateNoteDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    pinned: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.body) {
      return;
    }

    onCreateNote({
      title: formData.title,
      body: formData.body,
      pinned: formData.pinned
    });
    
    setFormData({
      title: "",
      body: "",
      pinned: false
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Note</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Note title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Body *</Label>
          <RichTextEditor
            id="body"
            value={formData.body}
            onChange={(value) => handleChange('body', value)}
            placeholder="Write your note here. Use the formatting buttons for bold and italic text."
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pinned"
            checked={formData.pinned}
            onChange={(e) => handleChange("pinned", e.target.checked)}
            className="rounded border-gray-300"
          />
          <Label htmlFor="pinned">Pin this note</Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Note
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
