
export interface Contact {
  id: number;
  name: string;
  company: string;
  sector?: string;
  unit?: string;
  role?: string;
  address?: string;
  phones: string[];
  emails: string[];
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilters {
  company: string;
  sector: string;
  unit: string;
  role: string;
}

export type ContactSortField = 'name' | 'company' | 'sector' | 'unit' | 'role';
export type ContactSortDirection = 'asc' | 'desc';
