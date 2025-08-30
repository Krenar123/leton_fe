export interface Supplier {
  id: number;
  ref: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  currentProjects: number;
  totalProjects: number;
  totalValue: number;
  totalPaid: number;
  totalOutstanding: number;
  firstProject: string;
  lastProject: string;
  profitability: number;
  description: string;
  sector?: string;
  businessNr?: string;
  vat?: string;
}

export interface SupplierFilterState {
  company: string;
  totalValue: { min: string; max: string };
  totalProjects: { min: string; max: string };
  profitability: { min: string; max: string };
}

export interface SupplierColumnVisibility {
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
