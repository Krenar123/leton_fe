
// src/types/client.ts
export interface Client {
  ref: string;
  company: string;
  contactName: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  industry?: string;
  status: "active" | "inactive" | "prospect";
  currentProjects: number;
  totalProjects: number;
  totalValue: number;
  totalPaid: number;
  totalOutstanding: number;
  firstProject?: string | null;
  lastProject?: string | null;
  profitability?: number;
}


export interface ClientFilterState {
  company: string;
  totalValue: { min: string; max: string };
  totalProjects: { min: string; max: string };
  profitability: { min: string; max: string };
}

export interface ClientColumnVisibility {
  company: boolean;
  email: boolean;
  phone: boolean;
  address: boolean;
  totalValue: boolean;
  totalPaid: boolean;
  totalOutstanding: boolean;
  firstProject: boolean;
  lastProject: boolean;
  profitability: boolean;
}
