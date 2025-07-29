
import { Folder, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DocumentItem, QuickAccessFolder } from "./types";

interface DocumentsSidebarProps {
  quickAccessFolders: QuickAccessFolder[];
  recentlyUsedFolders: DocumentItem[];
  onQuickAccessClick: (folder: QuickAccessFolder) => void;
  onRecentFolderClick: (folder: DocumentItem) => void;
}

export const DocumentsSidebar = ({ 
  quickAccessFolders, 
  recentlyUsedFolders, 
  onQuickAccessClick, 
  onRecentFolderClick 
}: DocumentsSidebarProps) => {
  return (
    <div className="w-64 bg-gray-50 border-r p-4 rounded-l-lg">
      <h3 className="font-semibold text-sm text-gray-700 mb-3">Quick Access</h3>
      <div className="space-y-1">
        {quickAccessFolders.map((folder) => {
          const Icon = folder.icon;
          return (
            <button
              key={folder.id}
              onClick={() => onQuickAccessClick(folder)}
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span>{folder.name}</span>
            </button>
          );
        })}
      </div>
      
      <Separator className="my-4" />
      
      <h3 className="font-semibold text-sm text-gray-700 mb-3">Recent Folders</h3>
      <div className="space-y-1">
        {recentlyUsedFolders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onRecentFolderClick(folder)}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            <Folder className="w-4 h-4" />
            <span className="truncate">{folder.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
