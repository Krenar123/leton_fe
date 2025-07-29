import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Star, MoreVertical, FolderOpen, Copy, Move, Download, Folder, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { DocumentItem, SortField, SortDirection } from "./types";
interface DocumentsTableProps {
  sortedItems: DocumentItem[];
  sortField: SortField;
  sortDirection: SortDirection;
  draggedItem: DocumentItem | null;
  onSort: (field: SortField) => void;
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
  formatDate: (dateString: string) => string;
}
export const DocumentsTable = ({
  sortedItems,
  sortField,
  sortDirection,
  draggedItem,
  onSort,
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
  formatFileSize,
  formatDate
}: DocumentsTableProps) => {
  const getFileIcon = (item: DocumentItem) => {
    if (item.type === "folder") return Folder;
    return FileText;
  };
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };
  return <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 border-b">
          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors h-10 py-2" onClick={() => onSort('name')}>
            <div className="flex items-center space-x-1">
              <span>Name</span>
              {getSortIcon('name')}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors h-10 py-2" onClick={() => onSort('size')}>
            <div className="flex items-center space-x-1">
              <span>Size</span>
              {getSortIcon('size')}
            </div>
          </TableHead>
          <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors h-10 py-2" onClick={() => onSort('updatedAt')}>
            <div className="flex items-center space-x-1">
              <span>Modified</span>
              {getSortIcon('updatedAt')}
            </div>
          </TableHead>
          <TableHead className="w-12 h-10 py-2"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedItems.map(item => {
        const Icon = getFileIcon(item);
        return <ContextMenu key={item.id}>
              <ContextMenuTrigger asChild>
                <TableRow draggable onDragStart={e => onDragStart(e, item)} onDragOver={item.type === "folder" ? onDragOver : undefined} onDrop={item.type === "folder" ? e => onDrop(e, item) : undefined} className="cursor-pointer hover:bg-gray-50 h-10 border-b" onClick={() => onItemClick(item)}>
                  <TableCell className="py-2">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-sm font-medium truncate">{item.name}</span>
                        {item.isFavorite && <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                        {item.isNew && <Badge variant="default" className="text-xs h-4 px-1 flex-shrink-0 bg-[#d9a44d]">New</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 py-2">
                    {item.type === "file" && item.size ? formatFileSize(item.size) : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 py-2">
                    {formatDate(item.updatedAt)}
                  </TableCell>
                  <TableCell className="py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={e => e.stopPropagation()}>
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onOpen(item);
                    }}>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          Open
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}>
                          <Star className={`w-4 h-4 mr-2 ${item.isFavorite ? 'text-yellow-500' : ''}`} />
                          {item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onCopy(item);
                    }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onMove(item);
                    }}>
                          <Move className="w-4 h-4 mr-2" />
                          Move
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onRename(item);
                    }}>
                          Rename
                        </DropdownMenuItem>
                        {item.type === "file" && <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onDownload(item);
                    }}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={e => {
                      e.stopPropagation();
                      onDelete(item);
                    }} className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
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
                {item.type === "file" && <ContextMenuItem onClick={() => onDownload(item)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </ContextMenuItem>}
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onDelete(item)} className="text-red-600">
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>;
      })}
      </TableBody>
    </Table>;
};