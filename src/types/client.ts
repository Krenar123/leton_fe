
export interface Client {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  businessNumber?: string;
  vat?: string;
  currentProjects: number;
  totalProjects: number;
  totalValue: number;
  totalPaid: number;
  totalOutstanding: number;
  firstProject: string;
  lastProject: string;
  profitability: number;
  description?: string;
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
