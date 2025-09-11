import { useState, useMemo } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { RenameItemDialog } from "./RenameItemDialog";
import { Home, Folder } from "lucide-react";
import { DocumentItem, QuickAccessFolder, SortField, SortDirection } from "./documents/types";
import { DocumentsSidebar } from "./documents/DocumentsSidebar";
import { DocumentsToolbar } from "./documents/DocumentsToolbar";
import { DocumentsTable } from "./documents/DocumentsTable";
import { DocumentsGrid } from "./documents/DocumentsGrid";
import { MoveFolderDialog } from "./documents/MoveFolderDialog";
import { useProjectDocuments } from "@/hooks/useProjectDocuments";
import { useToast } from "@/hooks/use-toast";

interface DocumentsDialogProps {
  projectRef: string;
  projectName: string;
  onClose: () => void;
}

// Quick access folders will be defined inside the component to access the actual folder IDs


export const DocumentsDialog = ({ projectRef, projectName, onClose }: DocumentsDialogProps) => {
  const { documents, loading, error, handleUpload, handleDelete, refreshDocuments } = useProjectDocuments(projectRef);
  const { toast } = useToast();
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
  
  // Local state for UI interactions (favorites, etc.)
  const [localDocumentState, setLocalDocumentState] = useState<Record<number, { isFavorite?: boolean; isNew?: boolean; lastAccessedAt?: string }>>({});
  
  // Local state for folders (since backend doesn't support folders yet)
  const [localFolders, setLocalFolders] = useState<DocumentItem[]>([
    {
      id: 1,
      name: "Project Plans",
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
    }
  ]);

  // Merge backend documents with local folders and state
  const mergedDocuments = useMemo(() => {
    const allDocuments = [...documents, ...localFolders];
    return allDocuments.map(doc => ({
      ...doc,
      ...localDocumentState[doc.id]
    }));
  }, [documents, localFolders, localDocumentState]);

  // Quick access folders based on actual folder IDs
  const quickAccessFolders: QuickAccessFolder[] = useMemo(() => [
    { id: "home", name: "Project Home", icon: Home, folderId: null },
    { id: "contracts", name: "Contracts", icon: Folder, folderId: 2 },
    { id: "plans", name: "Project Plans", icon: Folder, folderId: 1 },
  ], []);

  // Recently used folders (mock data based on lastAccessedAt)
  const recentlyUsedFolders = useMemo(() => {
    return mergedDocuments
      .filter(doc => doc.type === "folder" && doc.lastAccessedAt)
      .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())
      .slice(0, 5);
  }, [mergedDocuments]);

  const currentItems = mergedDocuments.filter(doc => doc.parentId === currentFolderId);
  
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
    
    // Update last accessed time
    setLocalDocumentState(prev => ({
      ...prev,
      [folder.id]: { ...prev[folder.id], lastAccessedAt: new Date().toISOString() }
    }));
  };

  const handleQuickAccessClick = (quickFolder: QuickAccessFolder) => {
    if (quickFolder.folderId === null) {
      setCurrentFolderId(null);
      setFolderPath([]);
    } else {
      const folder = mergedDocuments.find(doc => doc.id === quickFolder.folderId);
      if (folder) {
        setCurrentFolderId(folder.id);
        setFolderPath([folder]);
        
        // Update last accessed time
        setLocalDocumentState(prev => ({
          ...prev,
          [folder.id]: { ...prev[folder.id], lastAccessedAt: new Date().toISOString() }
        }));
      }
    }
  };

  const handleRecentFolderClick = (folder: DocumentItem) => {
    // Navigate to the folder
    const pathToFolder: DocumentItem[] = [];
    let currentFolder: DocumentItem | undefined = folder;
    
    while (currentFolder && currentFolder.parentId !== null) {
      const parent = mergedDocuments.find(doc => doc.id === currentFolder.parentId);
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
    
    // Update last accessed time
    setLocalDocumentState(prev => ({
      ...prev,
      [folder.id]: { ...prev[folder.id], lastAccessedAt: new Date().toISOString() }
    }));
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
    
    setLocalFolders(prev => [...prev, newFolder]);
    setIsCreateFolderOpen(false);
    toast({
      title: "Success",
      description: `Folder "${name}" created successfully`,
    });
    console.log('New folder created:', newFolder);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      // Upload files one by one
      for (const file of Array.from(files)) {
        await handleUpload(file);
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    }

    event.target.value = '';
  };

  const handleToggleFavorite = (item: DocumentItem) => {
    setLocalDocumentState(prev => ({
      ...prev,
      [item.id]: { ...prev[item.id], isFavorite: !item.isFavorite }
    }));
    console.log('Toggled favorite for:', item.name);
  };

  const handleCopy = (item: DocumentItem) => {
    if (item.type === "folder") {
      const newFolder: DocumentItem = {
        ...item,
        id: Date.now() + Math.random(),
        name: `${item.name} - Copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isNew: true,
        lastAccessedAt: new Date().toISOString()
      };
      
      setLocalFolders(prev => [...prev, newFolder]);
      toast({
        title: "Success",
        description: `Folder "${newFolder.name}" created successfully`,
      });
      console.log('Folder copied:', item.name, 'to', newFolder.name);
    } else {
      // TODO: Implement file copy functionality in backend
      toast({
        title: "Feature Not Available",
        description: "File copying is not yet supported. Please contact your administrator.",
        variant: "destructive",
      });
    }
  };

  const handleMove = (item: DocumentItem, targetFolderId: number | null = null) => {
    if (targetFolderId === undefined) {
      setMovingItem(item);
      setIsMoveDialogOpen(true);
    } else {
      if (item.type === "folder") {
        setLocalFolders(prev => prev.map(folder => 
          folder.id === item.id 
            ? { ...folder, parentId: targetFolderId, updatedAt: new Date().toISOString() }
            : folder
        ));
        toast({
          title: "Success",
          description: `Folder "${item.name}" moved successfully`,
        });
        console.log('Folder moved:', item.name, 'to folder ID:', targetFolderId);
      } else {
        // TODO: Implement file move functionality in backend
        toast({
          title: "Feature Not Available",
          description: "File moving is not yet supported. Please contact your administrator.",
          variant: "destructive",
        });
      }
    }
  };

  const handleMoveFromDialog = (item: DocumentItem, targetFolderId: number | null) => {
    handleMove(item, targetFolderId);
    setIsMoveDialogOpen(false);
    setMovingItem(null);
  };

  const handleOpen = (item: DocumentItem) => {
    console.log('Opening:', item.name);
    
    // Mark as viewed if it was new and update last accessed time
    setLocalDocumentState(prev => ({
      ...prev,
      [item.id]: { 
        ...prev[item.id], 
        isNew: false, 
        lastAccessedAt: new Date().toISOString() 
      }
    }));
    
    if (item.type === "folder") {
      handleFolderClick(item);
    } else {
      // In a real implementation, this would open the file in the default application
      console.log('Opening file in default application:', item.name);
    }
  };

  const handleRename = (item: DocumentItem) => {
    setRenamingItem(item);
    setIsRenameDialogOpen(true);
  };

  const handleRenameConfirm = (newName: string) => {
    if (renamingItem) {
      if (renamingItem.type === "folder") {
        setLocalFolders(prev => prev.map(folder => 
          folder.id === renamingItem.id 
            ? { ...folder, name: newName, updatedAt: new Date().toISOString() }
            : folder
        ));
        toast({
          title: "Success",
          description: `Folder renamed to "${newName}" successfully`,
        });
        console.log('Folder renamed:', renamingItem.name, 'to', newName);
      } else {
        // TODO: Implement file rename functionality in backend
        toast({
          title: "Feature Not Available",
          description: "File renaming is not yet supported. Please contact your administrator.",
          variant: "destructive",
        });
      }
      setIsRenameDialogOpen(false);
      setRenamingItem(null);
    }
  };

  const handleDeleteDocument = async (item: DocumentItem) => {
    try {
      if (item.type === "folder") {
        // Delete folder and all its children
        const deleteFolderAndChildren = (folderId: number) => {
          const childrenToDelete = localFolders.filter(folder => folder.parentId === folderId);
          childrenToDelete.forEach(child => deleteFolderAndChildren(child.id));
          setLocalFolders(prev => prev.filter(folder => folder.id !== folderId));
        };
        
        deleteFolderAndChildren(item.id);
        toast({
          title: "Success",
          description: `Folder "${item.name}" deleted successfully`,
        });
        console.log('Folder deleted:', item.name);
      } else {
        await handleDelete(item.id);
        toast({
          title: "Success",
          description: `${item.name} deleted successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Delete Error",
        description: error instanceof Error ? error.message : "Failed to delete document",
        variant: "destructive",
      });
    }
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
      if (draggedItem.type === "folder") {
        setLocalFolders(prev => prev.map(folder => 
          folder.id === draggedItem.id 
            ? { ...folder, parentId: targetId, updatedAt: new Date().toISOString() }
            : folder
        ));
        toast({
          title: "Success",
          description: `Folder "${draggedItem.name}" moved successfully`,
        });
        console.log('Folder moved:', draggedItem.name, 'to', targetFolder?.name || 'root');
      } else {
        // TODO: Implement file drag and drop functionality in backend
        toast({
          title: "Feature Not Available",
          description: "File drag and drop is not yet supported. Please contact your administrator.",
          variant: "destructive",
        });
      }
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

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <span>Documents - {projectName}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 p-6 pt-4 space-y-4 overflow-hidden">
              {/* Navigation */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>📁 {projectName}</span>
                {folderPath.map((folder) => (
                  <span key={folder.id}>/ {folder.name}</span>
                ))}
                {currentFolderId === null && folderPath.length === 0 && (
                  <span>/ Project Home</span>
                )}
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

              {/* Document List/Grid */}
              <div 
                className="flex-1 border rounded-lg overflow-auto min-h-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading documents...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p className="mb-2">Error loading documents</p>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button 
                      onClick={refreshDocuments}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : viewMode === "list" ? (
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
                    onDelete={handleDeleteDocument}
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
                    onDelete={handleDeleteDocument}
                    formatFileSize={formatFileSize}
                  />
                )}
                
                {!loading && !error && sortedItems.length === 0 && (
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

      {/* Rename Dialog */}
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

      {/* Move Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        {movingItem && (
          <MoveFolderDialog 
            item={movingItem}
            folders={mergedDocuments}
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

// Re-export the DocumentItem interface for backward compatibility
export type { DocumentItem } from "./documents/types";
