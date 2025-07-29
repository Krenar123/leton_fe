
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EstimateActualItem, ViewMode, TableDisplaySettings } from "@/types/financials";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSettingsDialog } from "./TableSettingsDialog";
import { FinancialTableHeader } from "./FinancialTableHeader";
import { FinancialTableBody } from "./FinancialTableBody";

interface ConsistentFinancialTableProps {
  viewMode: ViewMode;
  data: EstimateActualItem[];
  onAddItemLine: () => void;
  onItemLineAction: (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => void;
  tableSettings: TableDisplaySettings;
  onTableSettingsChange: (settings: TableDisplaySettings) => void;
}

export const ConsistentFinancialTable = ({
  viewMode,
  data,
  onAddItemLine,
  onItemLineAction,
  tableSettings,
  onTableSettingsChange,
}: ConsistentFinancialTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Map viewMode to TableDisplaySettings keys
  const getViewModeKey = (viewMode: ViewMode): keyof TableDisplaySettings => {
    switch (viewMode) {
      case 'contract-amounts':
        return 'contractAmounts';
      case 'invoiced-paid':
        return 'invoicedPaid';
      case 'costs-bills':
        return 'costsBills';
      case 'cost-tracking':
        return 'costTracking';
      default:
        return 'contractAmounts';
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.itemLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.contractor && item.contractor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getFinancialColumns = () => {
    switch (viewMode) {
      case 'contract-amounts':
        return [
          { key: 'originalAmount', label: 'Original Contract Amount' },
          { key: 'revisedAmount', label: 'Revised Contract Amount' }
        ];
      case 'invoiced-paid':
        return [
          { key: 'invoiced', label: 'Invoiced' },
          { key: 'paid', label: 'Paid' },
          { key: 'balance', label: 'Balance' }
        ];
      case 'costs-bills':
        return [
          { key: 'billed', label: 'Billed' },
          { key: 'payments', label: 'Payments' },
          { key: 'outstanding', label: 'Outstanding' }
        ];
      case 'cost-tracking':
        return [
          { key: 'estimatedCost', label: 'Estimated Cost' },
          { key: 'actualCost', label: 'Actual Cost (Bills)' },
          { key: 'billsPaid', label: 'Bills Paid' }
        ];
      default:
        return [
          { key: 'estimatedCost', label: 'Est. Cost' },
          { key: 'actualCost', label: 'Act. Cost' },
          { key: 'estimatedRevenue', label: 'Est. Revenue' },
          { key: 'actualRevenue', label: 'Act. Revenue' }
        ];
    }
  };

  const financialColumns = getFinancialColumns();
  const viewModeKey = getViewModeKey(viewMode);
  const currentViewSettings = tableSettings[viewModeKey];

  // Helper function to check if a property exists on current view settings
  const hasProperty = (prop: string): boolean => {
    return prop in currentViewSettings;
  };

  // Type guard to check if settings have showContractor property
  const hasShowContractor = (settings: any): settings is { showContractor: boolean } => {
    return 'showContractor' in settings;
  };

  // Type guard to check if settings have showChangeOrders property
  const hasShowChangeOrders = (settings: any): settings is { showChangeOrders: boolean } => {
    return 'showChangeOrders' in settings;
  };

  return (
    <Card className="border-0 shadow-lg bg-card">
      <div className="p-6 border-b border-border">
        <FinancialTableHeader
          viewMode={viewMode}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onAddItemLine={onAddItemLine}
        />
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border hover:bg-transparent">
              {viewMode === 'contract-amounts' && (
                <>
                  <TableHead className="font-semibold text-foreground w-24">Cost Code</TableHead>
                  <TableHead className="font-semibold text-foreground min-w-48">Description</TableHead>
                  {financialColumns.map((column) => (
                    <TableHead key={column.key} className="font-semibold text-amber-600 text-right w-32">
                      {column.label}
                    </TableHead>
                  ))}
                  {currentViewSettings.showChangeOrders && (
                    <TableHead className="font-semibold text-foreground w-32">Change Orders</TableHead>
                  )}
                  {currentViewSettings.showContractor && (
                    <TableHead className="font-semibold text-foreground w-40">Contractor</TableHead>
                  )}
                  {currentViewSettings.showDependencies && (
                    <TableHead className="font-semibold text-foreground w-32">Dependencies</TableHead>
                  )}
                  {currentViewSettings.showStartDate && (
                    <TableHead className="font-semibold text-foreground w-32">Start Date</TableHead>
                  )}
                  {currentViewSettings.showDueDate && (
                    <TableHead className="font-semibold text-foreground w-32">Due Date</TableHead>
                  )}
                  <TableHead className="font-semibold text-foreground w-36">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right w-20">Actions</TableHead>
                </>
              )}
              {viewMode !== 'contract-amounts' && (
                <>
                  <TableHead className="font-semibold text-foreground min-w-48">Item Line</TableHead>
                  {financialColumns.map((column) => (
                    <TableHead key={column.key} className="font-semibold text-foreground text-right w-32">
                      {column.label}
                    </TableHead>
                  ))}
                  {hasProperty('showContractor') && hasShowContractor(currentViewSettings) && currentViewSettings.showContractor && (
                    <TableHead className="font-semibold text-foreground w-40">Contractor</TableHead>
                  )}
                  {currentViewSettings.showDependencies && (
                    <TableHead className="font-semibold text-foreground w-32">Dependencies</TableHead>
                  )}
                  {currentViewSettings.showStartDate && (
                    <TableHead className="font-semibold text-foreground w-32">Start Date</TableHead>
                  )}
                  {currentViewSettings.showDueDate && (
                    <TableHead className="font-semibold text-foreground w-32">Due Date</TableHead>
                  )}
                  <TableHead className="font-semibold text-foreground w-36">Status</TableHead>
                  <TableHead className="font-semibold text-foreground text-right w-20">Actions</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <FinancialTableBody
            filteredData={filteredData}
            viewMode={viewMode}
            tableSettings={tableSettings}
            onItemLineAction={onItemLineAction}
          />
        </Table>
      </div>

      <TableSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={tableSettings}
        onSettingsChange={onTableSettingsChange}
        viewMode={viewMode}
      />
    </Card>
  );
};
