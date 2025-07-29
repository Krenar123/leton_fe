import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Search, Star, List, Grid3X3, Folder, Upload } from "lucide-react";
import { CreateFolderDialog } from "../CreateFolderDialog";
interface DocumentsToolbarProps {
  folderPath: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (show: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isCreateFolderOpen: boolean;
  setIsCreateFolderOpen: (open: boolean) => void;
  onBackClick: () => void;
  onCreateFolder: (name: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export const DocumentsToolbar = ({
  folderPath,
  searchTerm,
  setSearchTerm,
  showFavoritesOnly,
  setShowFavoritesOnly,
  viewMode,
  setViewMode,
  isCreateFolderOpen,
  setIsCreateFolderOpen,
  onBackClick,
  onCreateFolder,
  onFileUpload
}: DocumentsToolbarProps) => {
  return <div className="flex items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        {folderPath.length > 0 && <Button variant="outline" size="sm" onClick={onBackClick}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search documents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 w-64" />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant={showFavoritesOnly ? "default" : "outline"} size="sm" onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
          <Star className="w-4 h-4 mr-2" />
          Favorites
        </Button>
        
        <div className="flex border rounded-md">
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="rounded-r-none bg-[#0a1f44]">
            <List className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-l-none">
            <Grid3X3 className="w-4 h-4" />
          </Button>
        </div>
        
        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Folder className="w-4 h-4 mr-2" />
              New Folder
            </Button>
          </DialogTrigger>
          <CreateFolderDialog onCreateFolder={onCreateFolder} onClose={() => setIsCreateFolderOpen(false)} />
        </Dialog>
        
        <label className="cursor-pointer">
          <Button variant="outline" size="sm" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </span>
          </Button>
          <input type="file" multiple className="hidden" onChange={onFileUpload} />
        </label>
      </div>
    </div>;
};