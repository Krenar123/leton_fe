
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, Home } from "lucide-react";
import { DocumentItem } from "./types";

interface MoveFolderDialogProps {
  item: DocumentItem;
  folders: DocumentItem[];
  onMove: (item: DocumentItem, targetFolderId: number | null) => void;
  onClose: () => void;
}

export const MoveFolderDialog = ({ item, folders, onMove, onClose }: MoveFolderDialogProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const availableFolders = folders.filter(folder => 
    folder.type === "folder" && 
    folder.id !== item.id && 
    folder.parentId !== item.id
  );

  const handleMove = () => {
    onMove(item, selectedFolderId);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Move "{item.name}"</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select destination folder:</label>
          <div className="max-h-48 overflow-y-auto border rounded-md">
            <div 
              className={`p-2 hover:bg-gray-50 cursor-pointer ${selectedFolderId === null ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedFolderId(null)}
            >
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Project Root</span>
              </div>
            </div>
            {availableFolders.map((folder) => (
              <div 
                key={folder.id}
                className={`p-2 hover:bg-gray-50 cursor-pointer ${selectedFolderId === folder.id ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="w-4 h-4" />
                  <span>{folder.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleMove}>
            Move Here
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
