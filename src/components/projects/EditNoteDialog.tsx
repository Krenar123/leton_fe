
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "./RichTextEditor";
import { Note } from "./NotesDialog";

interface EditNoteDialogProps {
  note: Note;
  onEditNote: (note: Note) => void;
  onClose: () => void;
  existingCategories: string[];
}

export const EditNoteDialog = ({ note, onEditNote, onClose, existingCategories }: EditNoteDialogProps) => {
  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content,
    category: note.category
  });
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = isNewCategory ? newCategoryName : formData.category;
    
    if (!formData.title || !formData.content || !finalCategory) {
      return;
    }

    onEditNote({
      ...note,
      title: formData.title,
      content: formData.content,
      category: finalCategory
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Edit Note</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Note title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <div className="flex space-x-2">
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={isNewCategory ? "new" : formData.category} 
              onChange={(e) => {
                if (e.target.value === "new") {
                  setIsNewCategory(true);
                  setFormData(prev => ({ ...prev, category: "" }));
                } else {
                  setIsNewCategory(false);
                  setFormData(prev => ({ ...prev, category: e.target.value }));
                }
              }}
            >
              <option value="">Select category</option>
              {existingCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">+ New Category</option>
            </select>
          </div>
          
          {isNewCategory && (
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter new category name"
              required
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-note-content">Content</Label>
          <RichTextEditor
            id="edit-note-content"
            value={formData.content}
            onChange={(value) => handleChange('content', value)}
            placeholder="Write your note here. Use the formatting buttons for bold and italic text."
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
