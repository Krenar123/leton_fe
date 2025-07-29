
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Star, FolderOpen, Copy, Move, Download, Folder, FileText } from "lucide-react";
import { DocumentItem } from "./types";

interface DocumentsGridProps {
  sortedItems: DocumentItem[];
  onItemClick: (item: DocumentItem) => void;
  onDragStart: (e: React.DragEvent, item: DocumentItem) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetFolder: DocumentItem | null) => void;
  onToggleFavorite: (item: DocumentItem) => void;
  onOpen: (item: DocumentItem) => void;
  onCopy: (item: DocumentItem) => void;
  onMove: (item: DocumentItem) => void;
  onRename: (item: DocumentItem) => void;
  onDownload: (item: DocumentItem) => void;
  onDelete: (item: DocumentItem) => void;
  formatFileSize: (bytes: number) => string;
}

export const DocumentsGrid = ({
  sortedItems,
  onItemClick,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleFavorite,
  onOpen,
  onCopy,
  onMove,
  onRename,
  onDownload,
  onDelete,
  formatFileSize
}: DocumentsGridProps) => {
  const getFileIcon = (item: DocumentItem) => {
    if (item.type === "folder") return Folder;
    return FileText;
  };

  return (
    <div className="p-4 max-h-[400px] overflow-y-auto">
      <div className="grid grid-cols-6 gap-4">
        {sortedItems.map((item) => {
          const Icon = getFileIcon(item);
          return (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger asChild>
                <div
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  onDragOver={item.type === "folder" ? onDragOver : undefined}
                  onDrop={item.type === "folder" ? (e) => onDrop(e, item) : undefined}
                  className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer relative"
                  onClick={() => onItemClick(item)}
                >
                  <div className="relative">
                    <Icon className="w-8 h-8 text-gray-500 mb-2" />
                    {item.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm font-medium truncate max-w-20">{item.name}</span>
                      {item.isNew && (
                        <Badge variant="default" className="text-xs h-4 px-1">New</Badge>
                      )}
                    </div>
                    {item.type === "file" && item.size && (
                      <span className="text-xs text-gray-500">{formatFileSize(item.size)}</span>
                    )}
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => onOpen(item)}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Open
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onToggleFavorite(item)}>
                  <Star className={`w-4 h-4 mr-2 ${item.isFavorite ? 'text-yellow-500' : ''}`} />
                  {item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onCopy(item)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onMove(item)}>
                  <Move className="w-4 h-4 mr-2" />
                  Move
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onRename(item)}>
                  Rename
                </ContextMenuItem>
                {item.type === "file" && (
                  <ContextMenuItem onClick={() => onDownload(item)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </ContextMenuItem>
                )}
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onDelete(item)} className="text-red-600">
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
};
