
export interface Contact {
  id: number;
  name: string;
  company: string;
  vendor_ref?: string; // Optional vendor reference if selected from dropdown
  company_name_override?: string; // Optional company name if no vendor selected
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
