
import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentItem } from "./DocumentsDialog";

interface RenameItemDialogProps {
  item: DocumentItem;
  onRename: (newName: string) => void;
  onClose: () => void;
}

export const RenameItemDialog = ({ item, onRename, onClose }: RenameItemDialogProps) => {
  const [newName, setNewName] = useState("");

  useEffect(() => {
    setNewName(item.name);
  }, [item.name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== item.name) {
      onRename(newName.trim());
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Rename {item.type === "folder" ? "Folder" : "File"}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newName">New Name</Label>
          <Input
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new name..."
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!newName.trim() || newName.trim() === item.name}
          >
            Rename
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
