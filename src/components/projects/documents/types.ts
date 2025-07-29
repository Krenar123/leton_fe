
export interface DocumentItem {
  id: number;
  name: string;
  type: "file" | "folder";
  size?: number;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
  isNew?: boolean;
  fileType?: string;
  isFavorite?: boolean;
  lastAccessedAt?: string;
}

export interface QuickAccessFolder {
  id: string;
  name: string;
  icon: React.ElementType;
  folderId: number | null;
}

export type SortField = 'name' | 'size' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';
