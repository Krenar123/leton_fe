
export interface EstimateActualItem {
  ref: string;
  parent_id: string;
  itemLine: string;
  contractor?: string; // Added contractor field
  costCode?: string; // Auto-generated cost code (1, 1.1, 1.1.1, etc.)
  vendor?: string; // Subcontractor, supplier, or own
  unit?: string; // Unit of measurement
  quantity?: number; // Quantity
  unitPrice?: number; // Unit price
  estimatedCost: number;
  actualCost: number;
  estimatedRevenue: number;
  actualRevenue: number;
  invoiced: number;
  paid: number;
  billed: number;
  payments: number;
  startDate?: string;
  dueDate?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  dependsOn?: string; // itemLine name that this depends on
  isCompleted: boolean;
  // Hierarchical structure properties
  level?: number; // 1 = main category, 2 = category, 3 = subcategory, 4 = vendor
  parentCostCode?: string; // Parent cost code for hierarchy
  isCategory?: boolean; // Whether this is a category (not a line item)
  isExpanded?: boolean; // Whether category is expanded
  children?: EstimateActualItem[]; // Child items for categories
  // Change orders tracking
  changeOrders?: number; // Number of times this cost code has been revised or added after contract generation
}

export type ViewMode = 'contract-amounts' | 'invoiced-paid' | 'costs-bills' | 'cost-tracking' | 'team-cost';

export interface FinancialDocument {
  id: string;
  name: string;
  type: 'invoice' | 'payment' | 'bill' | 'receipt';
  uploadDate: string;
  amount: number;
  itemLine: string;
  expectedDate?: string;
  url?: string;
}

export interface CashFlowEntry {
  date: string;
  inflow: number;
  outflow: number;
  isProjected: boolean;
  type: 'actual' | 'projected';
  historicInflow: number;
  projectedInflow: number;
  historicOutflow: number;
  projectedOutflow: number;
}

export type CashFlowPeriod = 'weekly' | 'monthly';
export type CashFlowRange = 'current' | 'last2' | 'last3' | 'last4';

export interface TableDisplaySettings {
  // Contract Amounts view settings
  contractAmounts: {
    showContractor: boolean;
    showStartDate: boolean;
    showDueDate: boolean;
    showDependencies: boolean;
    showChangeOrders: boolean;
  };
  // Invoiced-Paid view settings
  invoicedPaid: {
    showContractor: boolean;
    showBalance: boolean;
    showStartDate: boolean;
    showDueDate: boolean;
    showDependencies: boolean;
    showChangeOrders: boolean;
  };
  // Costs-Bills view settings
  costsBills: {
    showContractor: boolean;
    showVendor: boolean;
    showUnit: boolean;
    showQuantity: boolean;
    showUnitPrice: boolean;
    showBalance: boolean;
    showStartDate: boolean;
    showDueDate: boolean;
    showDependencies: boolean;
    showChangeOrders: boolean;
  };
  // Cost Tracking view settings
  costTracking: {
    showContractor: boolean;
    showVendor: boolean;
    showUnit: boolean;
    showQuantity: boolean;
    showUnitPrice: boolean;
    showBalance: boolean;
    showStartDate: boolean;
    showDueDate: boolean;
    showDependencies: boolean;
    showChangeOrders: boolean;
  };
}

export interface FilterStates {
  contractAmounts: {
    searchTerm: string;
    statusFilter: string;
  };
  invoicedPaid: {
    searchTerm: string;
    statusFilter: string;
  };
  costsBills: {
    searchTerm: string;
    statusFilter: string;
  };
  costTracking: {
    searchTerm: string;
    vendorFilter: string;
  };
}
