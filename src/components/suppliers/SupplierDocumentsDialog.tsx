
import { useState, useMemo } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { RenameItemDialog } from "../projects/RenameItemDialog";
import { Home, Folder } from "lucide-react";
import { DocumentItem, QuickAccessFolder, SortField, SortDirection } from "../projects/documents/types";
import { DocumentsSidebar } from "../projects/documents/DocumentsSidebar";
import { DocumentsToolbar } from "../projects/documents/DocumentsToolbar";
import { DocumentsTable } from "../projects/documents/DocumentsTable";
import { DocumentsGrid } from "../projects/documents/DocumentsGrid";
import { MoveFolderDialog } from "../projects/documents/MoveFolderDialog";

interface SupplierDocumentsDialogProps {
  supplierName: string;
  onClose: () => void;
}

const quickAccessFolders: QuickAccessFolder[] = [
  { id: "home", name: "Supplier Home", icon: Home, folderId: null },
  { id: "contracts", name: "Contracts", icon: Folder, folderId: 2 },
  { id: "invoices", name: "Invoices", icon: Folder, folderId: 1 },
];

const initialMockDocuments: DocumentItem[] = [
  {
    id: 1,
    name: "Invoices",
    type: "folder",
    createdAt: "2024-07-01T10:00:00Z",
    updatedAt: "2024-07-06T14:20:00Z",
    parentId: null,
    lastAccessedAt: "2024-07-06T14:20:00Z"
  },
  {
    id: 2,
    name: "Contracts",
    type: "folder",
    createdAt: "2024-07-02T09:00:00Z",
    updatedAt: "2024-07-05T11:30:00Z",
    parentId: null,
    isFavorite: true,
    lastAccessedAt: "2024-07-05T11:30:00Z"
  },
  {
    id: 3,
    name: "Service Agreement.pdf",
    type: "file",
    size: 2500000,
    createdAt: "2024-07-03T14:20:00Z",
    updatedAt: "2024-07-03T14:20:00Z",
    parentId: 2,
    fileType: "pdf",
    isFavorite: true,
    lastAccessedAt: "2024-07-03T14:20:00Z"
  },
  {
    id: 4,
    name: "Invoice #001.xlsx",
    type: "file",
    size: 850000,
    createdAt: "2024-07-04T16:45:00Z",
    updatedAt: "2024-07-06T10:15:00Z",
    parentId: 1,
    fileType: "xlsx",
    isNew: true,
    lastAccessedAt: "2024-07-06T10:15:00Z"
  },
  {
    id: 5,
    name: "Purchase Order.docx",
    type: "file",
    size: 125000,
    createdAt: "2024-07-05T11:30:00Z",
    updatedAt: "2024-07-05T11:30:00Z",
    parentId: null,
    fileType: "docx",
    lastAccessedAt: "2024-07-05T11:30:00Z"
  }
];

export const SupplierDocumentsDialog = ({ supplierName, onClose }: SupplierDocumentsDialogProps) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialMockDocuments);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderPath, setFolderPath] = useState<DocumentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renamingItem, setRenamingItem] = useState<DocumentItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [draggedItem, setDraggedItem] = useState<DocumentItem | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [movingItem, setMovingItem] = useState<DocumentItem | null>(null);

  const recentlyUsedFolders = useMemo(() => {
    return documents
      .filter(doc => doc.type === "folder" && doc.lastAccessedAt)
      .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())
      .slice(0, 5);
  }, [documents]);

  const currentItems = documents.filter(doc => doc.parentId === currentFolderId);
  
  const filteredAndSearchedItems = currentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? item.isFavorite : true;
    return matchesSearch && matchesFavorites;
  });

  const sortedItems = useMemo(() => {
    return [...filteredAndSearchedItems].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'size') {
        aValue = a.size || 0;
        bValue = b.size || 0;
      } else if (sortField === 'updatedAt') {
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
      } else {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [filteredAndSearchedItems, sortField, sortDirection]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFolderClick = (folder: DocumentItem) => {
    setCurrentFolderId(folder.id);
    setFolderPath([...folderPath, folder]);
    
    setDocuments(prev => prev.map(doc => 
      doc.id === folder.id 
        ? { ...doc, lastAccessedAt: new Date().toISOString() }
        : doc
    ));
  };

  const handleQuickAccessClick = (quickFolder: QuickAccessFolder) => {
    if (quickFolder.folderId === null) {
      setCurrentFolderId(null);
      setFolderPath([]);
    } else {
      const folder = documents.find(doc => doc.id === quickFolder.folderId);
      if (folder) {
        setCurrentFolderId(folder.id);
        setFolderPath([folder]);
        
        setDocuments(prev => prev.map(doc => 
          doc.id === folder.id 
            ? { ...doc, lastAccessedAt: new Date().toISOString() }
            : doc
        ));
      }
    }
  };

  const handleRecentFolderClick = (folder: DocumentItem) => {
    const pathToFolder: DocumentItem[] = [];
    let currentFolder: DocumentItem | undefined = folder;
    
    while (currentFolder && currentFolder.parentId !== null) {
      const parent = documents.find(doc => doc.id === currentFolder.parentId);
      if (parent) {
        pathToFolder.unshift(parent);
        currentFolder = parent;
      } else {
        break;
      }
    }
    
    pathToFolder.push(folder);
    setFolderPath(pathToFolder);
    setCurrentFolderId(folder.id);
    
    setDocuments(prev => prev.map(doc => 
      doc.id === folder.id 
        ? { ...doc, lastAccessedAt: new Date().toISOString() }
        : doc
    ));
  };

  const handleBackClick = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      setCurrentFolderId(newPath.length > 0 ? newPath[newPath.length - 1].id : null);
    }
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: DocumentItem = {
      id: Date.now(),
      name,
      type: "folder",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId: currentFolderId,
      lastAccessedAt: new Date().toISOString()
    };
    
    setDocuments(prev => [...prev, newFolder]);
    setIsCreateFolderOpen(false);
    console.log('New folder created:', newFolder);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: DocumentItem = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: "file",
        size: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: currentFolderId,
        fileType: file.name.split('.').pop()?.toLowerCase(),
        isNew: true,
        lastAccessedAt: new Date().toISOString()
      };
      
      setDocuments(prev => [...prev, newFile]);
      console.log('File uploaded:', newFile);
    });

    event.target.value = '';
  };

  const handleToggleFavorite = (item: DocumentItem) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === item.id 
        ? { ...doc, isFavorite: !doc.isFavorite, updatedAt: new Date().toISOString() }
        : doc
    ));
    console.log('Toggled favorite for:', item.name);
  };

  const handleCopy = (item: DocumentItem) => {
    const newItem: DocumentItem = {
      ...item,
      id: Date.now() + Math.random(),
      name: `${item.name} - Copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNew: true,
      lastAccessedAt: new Date().toISOString()
    };
    
    setDocuments(prev => [...prev, newItem]);
    console.log('Item copied:', item.name, 'to', newItem.name);
  };

  const handleMove = (item: DocumentItem, targetFolderId: number | null = null) => {
    if (targetFolderId === undefined) {
      setMovingItem(item);
      setIsMoveDialogOpen(true);
    } else {
      setDocuments(prev => prev.map(doc => 
        doc.id === item.id 
          ? { ...doc, parentId: targetFolderId, updatedAt: new Date().toISOString() }
          : doc
      ));
      console.log('Item moved:', item.name, 'to folder ID:', targetFolderId);
    }
  };

  const handleMoveFromDialog = (item: DocumentItem, targetFolderId: number | null) => {
    handleMove(item, targetFolderId);
    setIsMoveDialogOpen(false);
    setMovingItem(null);
  };

  const handleOpen = (item: DocumentItem) => {
    console.log('Opening:', item.name);
    
    if (item.isNew) {
      setDocuments(prev => prev.map(doc => 
        doc.id === item.id 
          ? { ...doc, isNew: false, lastAccessedAt: new Date().toISOString() }
          : doc
      ));
    } else {
      setDocuments(prev => prev.map(doc => 
        doc.id === item.id 
          ? { ...doc, lastAccessedAt: new Date().toISOString() }
          : doc
      ));
    }
    
    if (item.type === "folder") {
      handleFolderClick(item);
    } else {
      console.log('Opening file in default application:', item.name);
    }
  };

  const handleRename = (item: DocumentItem) => {
    setRenamingItem(item);
    setIsRenameDialogOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    if (renamingItem) {
      setDocuments(prev => prev.map(doc => 
        doc.id === renamingItem.id 
          ? { ...doc, name: newName, updatedAt: new Date().toISOString() }
          : doc
      ));
      setIsRenameDialogOpen(false);
      setRenamingItem(null);
      console.log('Item renamed:', renamingItem.name, 'to', newName);
    }
  };

  const handleDelete = (item: DocumentItem) => {
    const deleteItem = (itemId: number) => {
      const itemsToDelete = documents.filter(doc => doc.parentId === itemId);
      itemsToDelete.forEach(childItem => deleteItem(childItem.id));
      setDocuments(prev => prev.filter(doc => doc.id !== itemId));
    };
    
    deleteItem(item.id);
    console.log('Item deleted:', item.name);
  };

  const handleDownload = (item: DocumentItem) => {
    console.log('Downloading:', item.name);
  };

  const handleItemClick = (item: DocumentItem) => {
    handleOpen(item);
  };

  const handleDragStart = (e: React.DragEvent, item: DocumentItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetFolder: DocumentItem | null) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetId = targetFolder ? targetFolder.id : null;
    if (draggedItem.parentId !== targetId) {
      setDocuments(prev => prev.map(doc => 
        doc.id === draggedItem.id 
          ? { ...doc, parentId: targetId, updatedAt: new Date().toISOString() }
          : doc
      ));
      console.log('Item moved:', draggedItem.name, 'to', targetFolder?.name || 'root');
    }
    setDraggedItem(null);
  };

  return (
    <div>
      <DialogContent className="sm:max-w-[1200px] max-h-[80vh] p-0">
        <div className="flex h-full max-h-[80vh]">
          <DocumentsSidebar
            quickAccessFolders={quickAccessFolders}
            recentlyUsedFolders={recentlyUsedFolders}
            onQuickAccessClick={handleQuickAccessClick}
            onRecentFolderClick={handleRecentFolderClick}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <span>Documents - {supplierName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 p-6 pt-4 space-y-4 overflow-hidden">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>📁 {supplierName}</span>
                {folderPath.map((folder) => (
                  <span key={folder.id}>/ {folder.name}</span>
                ))}
              </div>

              <DocumentsToolbar
                folderPath={folderPath}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                viewMode={viewMode}
                setViewMode={setViewMode}
                isCreateFolderOpen={isCreateFolderOpen}
                setIsCreateFolderOpen={setIsCreateFolderOpen}
                onBackClick={handleBackClick}
                onCreateFolder={handleCreateFolder}
                onFileUpload={handleFileUpload}
              />

              <div 
                className="flex-1 border rounded-lg overflow-auto min-h-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
              >
                {viewMode === "list" ? (
                  <DocumentsTable
                    sortedItems={sortedItems}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    draggedItem={draggedItem}
                    onSort={handleSort}
                    onItemClick={handleItemClick}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onToggleFavorite={handleToggleFavorite}
                    onOpen={handleOpen}
                    onCopy={handleCopy}
                    onMove={handleMove}
                    onRename={handleRename}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    formatFileSize={formatFileSize}
                    formatDate={formatDate}
                  />
                ) : (
                  <DocumentsGrid
                    sortedItems={sortedItems}
                    onItemClick={handleItemClick}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onToggleFavorite={handleToggleFavorite}
                    onOpen={handleOpen}
                    onCopy={handleCopy}
                    onMove={handleMove}
                    onRename={handleRename}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    formatFileSize={formatFileSize}
                  />
                )}
                
                {sortedItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? "No documents found matching your search." : 
                     showFavoritesOnly ? "No favorite items found." : "This folder is empty."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        {renamingItem && (
          <RenameItemDialog 
            item={renamingItem}
            onRename={handleRenameConfirm}
            onClose={() => {
              setIsRenameDialogOpen(false);
              setRenamingItem(null);
            }}
          />
        )}
      </Dialog>

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        {movingItem && (
          <MoveFolderDialog 
            item={movingItem}
            folders={documents}
            onMove={handleMoveFromDialog}
            onClose={() => {
              setIsMoveDialogOpen(false);
              setMovingItem(null);
            }}
          />
        )}
      </Dialog>
    </div>
  );
};
