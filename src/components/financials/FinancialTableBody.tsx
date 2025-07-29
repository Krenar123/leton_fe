
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Pause } from "lucide-react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { EstimateActualItem, ViewMode, TableDisplaySettings } from "@/types/financials";
import { FinancialTableActions } from "./FinancialTableActions";

interface FinancialTableBodyProps {
  filteredData: EstimateActualItem[];
  viewMode: ViewMode;
  tableSettings: TableDisplaySettings;
  onItemLineAction: (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => void;
}

export const FinancialTableBody = ({
  filteredData,
  viewMode,
  tableSettings,
  onItemLineAction,
}: FinancialTableBodyProps) => {
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'not-started': { 
        label: 'Not Started', 
        icon: Clock, 
        className: 'bg-gray-100 text-gray-700 border-gray-200' 
      },
      'in-progress': { 
        label: 'In Progress', 
        icon: Clock, 
        className: 'bg-blue-100 text-blue-700 border-blue-200' 
      },
      'completed': { 
        label: 'Completed', 
        icon: CheckCircle, 
        className: 'bg-green-100 text-green-700 border-green-200' 
      },
      'on-hold': { 
        label: 'On Hold', 
        icon: Pause, 
        className: 'bg-amber-100 text-amber-700 border-amber-200' 
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['not-started'];
    const Icon = config.icon;
    
    return (
      <Badge variant="outline" className={`${config.className} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderFinancialCells = (item: EstimateActualItem) => {
    switch (viewMode) {
      case 'contract-amounts':
        // For contract amounts: Original Amount, Revised Amount
        const originalAmount = (item.quantity || 0) * (item.unitPrice || 0);
        const revisedAmount = item.actualCost || originalAmount;
        return (
          <>
            <TableCell className="text-right font-medium w-32 text-amber-600">{formatCurrency(originalAmount)}</TableCell>
            <TableCell className="text-right font-medium w-32 text-amber-600">{formatCurrency(revisedAmount)}</TableCell>
          </>
        );
      case 'invoiced-paid':
        const invoicedBalance = item.invoiced - item.paid;
        return (
          <>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.invoiced)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.paid)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(invoicedBalance)}</TableCell>
          </>
        );
      case 'costs-bills':
        const billedOutstanding = item.billed - item.payments;
        return (
          <>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.billed)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.payments)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(billedOutstanding)}</TableCell>
          </>
        );
      case 'cost-tracking':
        return (
          <>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.estimatedCost)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.billed)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.payments)}</TableCell>
          </>
        );
      default:
        return (
          <>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.estimatedCost)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.actualCost || 0)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.estimatedRevenue)}</TableCell>
            <TableCell className="text-right font-medium w-32">{formatCurrency(item.actualRevenue || 0)}</TableCell>
          </>
        );
    }
  };

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
    <TableBody>
      {filteredData.map((item, index) => (
        <TableRow 
          key={item.itemLine} 
          className={`border-b border-border hover:bg-muted/50 transition-colors ${
            index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
          }`}
        >
          {viewMode === 'contract-amounts' && (
            <>
              <TableCell className="text-muted-foreground w-24">{item.costCode || '-'}</TableCell>
              <TableCell className="font-medium min-w-48">{item.itemLine}</TableCell>
              {renderFinancialCells(item)}
              {currentViewSettings.showChangeOrders && (
                <TableCell className="text-muted-foreground w-32">{item.changeOrders || 0}</TableCell>
              )}
              {currentViewSettings.showContractor && (
                <TableCell className="text-muted-foreground w-40">{item.contractor || '-'}</TableCell>
              )}
              {currentViewSettings.showDependencies && (
                <TableCell className="text-muted-foreground w-32">{item.dependsOn || '-'}</TableCell>
              )}
              {currentViewSettings.showStartDate && (
                <TableCell className="text-muted-foreground w-32">
                  {item.startDate ? format(new Date(item.startDate), 'dd/MM/yyyy') : '-'}
                </TableCell>
              )}
              {currentViewSettings.showDueDate && (
                <TableCell className="text-muted-foreground w-32">
                  {item.dueDate ? format(new Date(item.dueDate), 'dd/MM/yyyy') : '-'}
                </TableCell>
              )}
              <TableCell className="w-36">{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right w-20">
                <FinancialTableActions
                  item={item}
                  viewMode={viewMode}
                  onItemLineAction={onItemLineAction}
                />
              </TableCell>
            </>
          )}
          {viewMode !== 'contract-amounts' && (
            <>
              <TableCell className="font-medium min-w-48">{item.itemLine}</TableCell>
              {renderFinancialCells(item)}
              {hasProperty('showContractor') && hasShowContractor(currentViewSettings) && currentViewSettings.showContractor && (
                <TableCell className="text-muted-foreground w-40">{item.contractor || '-'}</TableCell>
              )}
              {currentViewSettings.showDependencies && (
                <TableCell className="text-muted-foreground w-32">{item.dependsOn || '-'}</TableCell>
              )}
              {currentViewSettings.showStartDate && (
                <TableCell className="text-muted-foreground w-32">
                  {item.startDate ? format(new Date(item.startDate), 'dd/MM/yyyy') : '-'}
                </TableCell>
              )}
              {currentViewSettings.showDueDate && (
                <TableCell className="text-muted-foreground w-32">
                  {item.dueDate ? format(new Date(item.dueDate), 'dd/MM/yyyy') : '-'}
                </TableCell>
              )}
              <TableCell className="w-36">{getStatusBadge(item.status)}</TableCell>
              <TableCell className="text-right w-20">
                <FinancialTableActions
                  item={item}
                  viewMode={viewMode}
                  onItemLineAction={onItemLineAction}
                />
              </TableCell>
            </>
          )}
        </TableRow>
      ))}
    </TableBody>
  );
};
