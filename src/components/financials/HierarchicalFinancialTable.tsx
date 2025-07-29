
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { EstimateActualItem, ViewMode, TableDisplaySettings } from "@/types/financials";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FinancialTableActions } from "./FinancialTableActions";
import { FinancialTableHeader } from "./FinancialTableHeader";
import { TableSettingsDialog } from "./TableSettingsDialog";
import { StatusIcon } from "@/components/action-plan/StatusIcon";
import { calculateStatusFromDates } from "@/utils/statusCalculator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HierarchicalFinancialTableProps {
  viewMode: ViewMode;
  data: EstimateActualItem[];
  onAddItemLine: () => void;
  onItemLineAction: (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => void;
  tableSettings: TableDisplaySettings;
  onTableSettingsChange: (settings: TableDisplaySettings) => void;
}

export const HierarchicalFinancialTable = ({
  viewMode,
  data,
  onAddItemLine,
  onItemLineAction,
  tableSettings,
  onTableSettingsChange,
}: HierarchicalFinancialTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["1", "1.1", "1.1.1", "2"]));

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

  const toggleExpanded = (costCode: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(costCode)) {
      newExpanded.delete(costCode);
    } else {
      newExpanded.add(costCode);
    }
    setExpandedItems(newExpanded);
  };

  // Format date from ISO string to DD/MM/YYYY
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '-';
    }
  };

  // Calculate change orders for an item
  const calculateChangeOrders = (item: EstimateActualItem): number => {
    // For categories, aggregate change orders from children
    if (item.isCategory) {
      const children = data.filter(child => child.parentCostCode === item.costCode);
      return children.reduce((total, child) => {
        if (child.isCategory) {
          return total + calculateChangeOrders(child);
        } else {
          return total + (child.changeOrders || 0);
        }
      }, 0);
    }
    
    // For individual items, return their change orders count
    return item.changeOrders || 0;
  };

  // Calculate aggregated costs for categories
  const calculateCategoryCosts = (categoryCode: string): { estCost: number; actualCost: number } => {
    let estCost = 0;
    let actualCost = 0;

    // Find all direct children of this category
    const directChildren = data.filter(item => item.parentCostCode === categoryCode);
    
    directChildren.forEach(child => {
      if (child.isCategory) {
        // If child is a category, recursively calculate its costs
        const childCosts = calculateCategoryCosts(child.costCode || "");
        estCost += childCosts.estCost;
        actualCost += childCosts.actualCost;
      } else {
        // If child is a line item, add its costs directly
        const childEstCost = (child.quantity || 0) * (child.unitPrice || 0);
        estCost += childEstCost;
        actualCost += child.actualCost || 0;
      }
    });

    return { estCost, actualCost };
  };

  // Calculate aggregated costs for invoiced-paid view
  const calculateInvoicedPaidCosts = (categoryCode: string): { originalContract: number; revisedContract: number; invoiced: number; paid: number; balance: number } => {
    let originalContract = 0;
    let revisedContract = 0;
    let invoiced = 0;
    let paid = 0;

    // Find all direct children of this category
    const directChildren = data.filter(item => item.parentCostCode === categoryCode);
    
    directChildren.forEach(child => {
      if (child.isCategory) {
        // If child is a category, recursively calculate its costs
        const childCosts = calculateInvoicedPaidCosts(child.costCode || "");
        originalContract += childCosts.originalContract;
        revisedContract += childCosts.revisedContract;
        invoiced += childCosts.invoiced;
        paid += childCosts.paid;
      } else {
        // If child is a line item, add its costs directly
        const estCost = (child.quantity || 0) * (child.unitPrice || 0);
        originalContract += estCost;
        revisedContract += child.estimatedRevenue || estCost;
        invoiced += child.invoiced || 0;
        paid += child.paid || 0;
      }
    });

    const balance = revisedContract - paid;
    return { originalContract, revisedContract, invoiced, paid, balance };
  };

  const getVisibleItems = () => {
    const visibleItems: EstimateActualItem[] = [];
    
    const processItem = (item: EstimateActualItem, parentExpanded: boolean = true) => {
      const matchesSearch = item.itemLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      if (parentExpanded && matchesSearch && matchesStatus) {
        visibleItems.push(item);
        
        // If this is a category, check if we should show its children
        if (item.isCategory) {
          const isExpanded = expandedItems.has(item.costCode || "");
          if (isExpanded) {
            const children = data.filter(child => child.parentCostCode === item.costCode);
            children.forEach(child => processItem(child, true));
          }
        }
      }
    };

    // First, show all top-level items (level 1)
    data.filter(item => item.level === 1).forEach(item => processItem(item, true));
    
    return visibleItems;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getIndentationStyle = (level?: number) => {
    const indentLevel = (level || 1) - 1;
    const baseIndent = indentLevel * 24;
    // Add extra indentation for level 4 (vendors) to make them more distinct
    const extraIndent = level === 4 ? 8 : 0;
    return {
      paddingLeft: `${baseIndent + extraIndent}px`,
    };
  };

  const renderExpandIcon = (item: EstimateActualItem) => {
    if (!item.isCategory) return null;
    
    const hasChildren = data.some(child => child.parentCostCode === item.costCode);
    if (!hasChildren) return null;

    const isExpanded = expandedItems.has(item.costCode || "");
    
    return (
      <button
        onClick={() => toggleExpanded(item.costCode || "")}
        className="mr-2 p-1 hover:bg-muted rounded"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    );
  };

  const getStatusFromItem = (item: EstimateActualItem): 'Planned' | 'In Progress' | 'Finished' | 'Already Due' => {
    if (item.isCompleted) return 'Finished';
    if (item.status === 'completed') return 'Finished';
    if (item.status === 'in-progress') return 'In Progress';
    if (item.status === 'on-hold') return 'Already Due';
    
    // If we have dates, calculate based on them
    if (item.startDate && item.dueDate) {
      return calculateStatusFromDates(item.startDate, item.dueDate);
    }
    
    return 'Planned';
  };

  const getStatusText = (status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due'): string => {
    switch (status) {
      case 'Planned': return 'Not started yet';
      case 'In Progress': return 'Currently in progress';
      case 'Finished': return 'Completed';
      case 'Already Due': return 'Overdue or on hold';
      default: return status;
    }
  };

  const handleStatusClick = (item: EstimateActualItem) => {
    const currentStatus = getStatusFromItem(item);
    let newAction: 'complete' | 'edit' = 'complete';
    
    // Cycle through statuses: Planned -> In Progress -> Finished
    if (currentStatus === 'Planned' || currentStatus === 'In Progress') {
      newAction = 'complete';
    } else {
      newAction = 'edit'; // For finished items, open edit dialog
    }
    
    onItemLineAction(item.itemLine, newAction);
  };

  const renderFinancialCells = (item: EstimateActualItem) => {
    const viewModeKey = getViewModeKey(viewMode);
    const currentViewSettings = tableSettings[viewModeKey];

    if (viewMode === "contract-amounts") {
      if (item.isCategory) {
        const { originalContract, revisedContract } = calculateInvoicedPaidCosts(item.costCode || "");
        const changeOrders = calculateChangeOrders(item);
        return (
          <>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(originalContract)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(revisedContract)}</TableCell>
            <TableCell className="text-center flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <StatusIcon 
                      status="Planned" 
                      className="w-5 h-5"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Category status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            {'showContractor' in currentViewSettings && currentViewSettings.showContractor && (
              <TableCell className="text-muted-foreground flex-1">-</TableCell>
            )}
            {currentViewSettings.showStartDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDueDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDependencies && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showChangeOrders && (
              <TableCell className="text-center flex-1">{changeOrders}</TableCell>
            )}
          </>
        );
      }

      const estimatedCost = (item.quantity || 0) * (item.unitPrice || 0);
      const revisedContract = item.estimatedRevenue || estimatedCost;
      const status = getStatusFromItem(item);
      const changeOrders = calculateChangeOrders(item);
      
      return (
        <>
          <TableCell className="text-right flex-1">{formatCurrency(estimatedCost)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(revisedContract)}</TableCell>
          <TableCell className="text-center flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <StatusIcon 
                    status={status} 
                    className="w-5 h-5"
                    onClick={() => handleStatusClick(item)}
                    isClickable={true}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getStatusText(status)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          {'showContractor' in currentViewSettings && currentViewSettings.showContractor && (
            <TableCell className="text-muted-foreground flex-1">{item.contractor || '-'}</TableCell>
          )}
          {currentViewSettings.showStartDate && (
            <TableCell className="text-center flex-1">{formatDate(item.startDate)}</TableCell>
          )}
          {currentViewSettings.showDueDate && (
            <TableCell className="text-center flex-1">{formatDate(item.dueDate)}</TableCell>
          )}
          {currentViewSettings.showDependencies && (
            <TableCell className="text-center flex-1">{item.dependsOn || '-'}</TableCell>
          )}
          {currentViewSettings.showChangeOrders && (
            <TableCell className="text-center flex-1">{changeOrders}</TableCell>
          )}
        </>
      );
    }

    if (viewMode === "invoiced-paid") {
      if (item.isCategory) {
        // For categories, show aggregated values
        const { revisedContract, invoiced, paid, balance } = calculateInvoicedPaidCosts(item.costCode || "");
        const changeOrders = calculateChangeOrders(item);
        return (
          <>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(revisedContract)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(invoiced)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(paid)}</TableCell>
            <TableCell className="text-center flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <StatusIcon 
                      status="Planned" 
                      className="w-5 h-5"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Category status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
              <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(balance)}</TableCell>
            )}
            {currentViewSettings.showStartDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDueDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDependencies && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showChangeOrders && (
              <TableCell className="text-center flex-1">{changeOrders}</TableCell>
            )}
          </>
        );
      }

      const estimatedCost = (item.quantity || 0) * (item.unitPrice || 0);
      const revisedContract = item.estimatedRevenue || estimatedCost;
      const balance = revisedContract - (item.paid || 0);
      const status = getStatusFromItem(item);
      const changeOrders = calculateChangeOrders(item);
      
      return (
        <>
          <TableCell className="text-right flex-1">{formatCurrency(revisedContract)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(item.invoiced)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(item.paid)}</TableCell>
          <TableCell className="text-center flex-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <StatusIcon 
                    status={status} 
                    className="w-5 h-5"
                    onClick={() => handleStatusClick(item)}
                    isClickable={true}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getStatusText(status)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>
          {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
            <TableCell className="text-right flex-1">{formatCurrency(balance)}</TableCell>
          )}
          {currentViewSettings.showStartDate && (
            <TableCell className="text-center flex-1">{formatDate(item.startDate)}</TableCell>
          )}
          {currentViewSettings.showDueDate && (
            <TableCell className="text-center flex-1">{formatDate(item.dueDate)}</TableCell>
          )}
          {currentViewSettings.showDependencies && (
            <TableCell className="text-center flex-1">{item.dependsOn || '-'}</TableCell>
          )}
          {currentViewSettings.showChangeOrders && (
            <TableCell className="text-center flex-1">{changeOrders}</TableCell>
          )}
        </>
      );
    }

    if (viewMode === "costs-bills") {
      if (item.isCategory) {
        // For categories, show aggregated values
        const { estCost, actualCost } = calculateCategoryCosts(item.costCode || "");
        const paid = 0; // Calculate from children if needed
        const balance = actualCost - paid;
        const changeOrders = calculateChangeOrders(item);
        return (
          <>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(estCost)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(actualCost)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(paid)}</TableCell>
            {'showVendor' in currentViewSettings && currentViewSettings.showVendor && (
              <TableCell className="text-muted-foreground flex-1">-</TableCell>
            )}
            {'showUnit' in currentViewSettings && currentViewSettings.showUnit && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showQuantity' in currentViewSettings && currentViewSettings.showQuantity && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showUnitPrice' in currentViewSettings && currentViewSettings.showUnitPrice && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
              <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(balance)}</TableCell>
            )}
            {currentViewSettings.showStartDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDueDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDependencies && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showChangeOrders && (
              <TableCell className="text-center flex-1">{changeOrders}</TableCell>
            )}
          </>
        );
      }

      const estimatedCost = (item.quantity || 0) * (item.unitPrice || 0);
      const actualCost = item.actualCost || 0;
      const paid = item.paid || 0;
      const balance = actualCost - paid;
      const changeOrders = calculateChangeOrders(item);
      
      return (
        <>
          <TableCell className="text-right flex-1">{formatCurrency(estimatedCost)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(actualCost)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(paid)}</TableCell>
          {'showVendor' in currentViewSettings && currentViewSettings.showVendor && (
            <TableCell className="text-muted-foreground flex-1">{item.vendor || '-'}</TableCell>
          )}
          {'showUnit' in currentViewSettings && currentViewSettings.showUnit && (
            <TableCell className="text-right flex-1">{item.unit || "-"}</TableCell>
          )}
          {'showQuantity' in currentViewSettings && currentViewSettings.showQuantity && (
            <TableCell className="text-right flex-1">{item.quantity || "-"}</TableCell>
          )}
          {'showUnitPrice' in currentViewSettings && currentViewSettings.showUnitPrice && (
            <TableCell className="text-right flex-1">{item.unitPrice ? formatCurrency(item.unitPrice) : "-"}</TableCell>
          )}
          {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
            <TableCell className="text-right flex-1">{formatCurrency(balance)}</TableCell>
          )}
          {currentViewSettings.showStartDate && (
            <TableCell className="text-center flex-1">{formatDate(item.startDate)}</TableCell>
          )}
          {currentViewSettings.showDueDate && (
            <TableCell className="text-center flex-1">{formatDate(item.dueDate)}</TableCell>
          )}
          {currentViewSettings.showDependencies && (
            <TableCell className="text-center flex-1">{item.dependsOn || '-'}</TableCell>
          )}
          {currentViewSettings.showChangeOrders && (
            <TableCell className="text-center flex-1">{changeOrders}</TableCell>
          )}
        </>
      );
    }

    if (viewMode === "cost-tracking") {
      if (item.isCategory) {
        // For categories, show aggregated values
        const { estCost, actualCost } = calculateCategoryCosts(item.costCode || "");
        return (
          <>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(estCost)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(actualCost)}</TableCell>
            <TableCell className="text-right font-medium flex-1 text-primary">{formatCurrency(0)}</TableCell>
            {'showVendor' in currentViewSettings && currentViewSettings.showVendor && (
              <TableCell className="text-muted-foreground flex-1">-</TableCell>
            )}
            {'showUnit' in currentViewSettings && currentViewSettings.showUnit && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showQuantity' in currentViewSettings && currentViewSettings.showQuantity && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showUnitPrice' in currentViewSettings && currentViewSettings.showUnitPrice && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
              <TableCell className="text-right flex-1">-</TableCell>
            )}
            {currentViewSettings.showStartDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDueDate && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showDependencies && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
            {currentViewSettings.showChangeOrders && (
              <TableCell className="text-center flex-1">-</TableCell>
            )}
          </>
        );
      }

      const estimatedCost = (item.quantity || 0) * (item.unitPrice || 0);
      
      return (
        <>
          <TableCell className="text-right flex-1">{formatCurrency(estimatedCost)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(item.actualCost || 0)}</TableCell>
          <TableCell className="text-right flex-1">{formatCurrency(item.paid || 0)}</TableCell>
          {'showVendor' in currentViewSettings && currentViewSettings.showVendor && (
            <TableCell className="text-muted-foreground flex-1">{item.vendor || '-'}</TableCell>
          )}
          {'showUnit' in currentViewSettings && currentViewSettings.showUnit && (
            <TableCell className="text-right flex-1">{item.unit || "-"}</TableCell>
          )}
          {'showQuantity' in currentViewSettings && currentViewSettings.showQuantity && (
            <TableCell className="text-right flex-1">{item.quantity || "-"}</TableCell>
          )}
          {'showUnitPrice' in currentViewSettings && currentViewSettings.showUnitPrice && (
            <TableCell className="text-right flex-1">{item.unitPrice ? formatCurrency(item.unitPrice) : "-"}</TableCell>
          )}
          {'showBalance' in currentViewSettings && currentViewSettings.showBalance && (
            <TableCell className="text-right flex-1">{formatCurrency((estimatedCost) - (item.paid || 0))}</TableCell>
          )}
          {currentViewSettings.showStartDate && (
            <TableCell className="text-center flex-1">{formatDate(item.startDate)}</TableCell>
          )}
          {currentViewSettings.showDueDate && (
            <TableCell className="text-center flex-1">{formatDate(item.dueDate)}</TableCell>
          )}
          {currentViewSettings.showDependencies && (
            <TableCell className="text-center flex-1">{item.dependsOn || '-'}</TableCell>
          )}
          {currentViewSettings.showChangeOrders && (
            <TableCell className="text-center flex-1">{calculateChangeOrders(item)}</TableCell>
          )}
        </>
      );
    }

    // Default fallback for other view modes
    return (
      <>
        <TableCell className="text-right w-32">-</TableCell>
        <TableCell className="text-right w-32">-</TableCell>
        <TableCell className="text-right w-32">-</TableCell>
        <TableCell className="text-right w-32">-</TableCell>
        <TableCell className="text-right w-32">-</TableCell>
      </>
    );
  };

  const visibleItems = getVisibleItems();
  const viewModeKey = getViewModeKey(viewMode);
  const currentTableSettings = tableSettings[viewModeKey];

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
              <TableHead className="font-semibold text-foreground w-24">Cost Code</TableHead>
              <TableHead className="font-semibold text-foreground w-40">Description</TableHead>
              {viewMode === "contract-amounts" && (
                <>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Original Contract Amount</TableHead>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Revised Contract Amount</TableHead>
                  <TableHead className="font-semibold text-foreground text-center flex-1">Status</TableHead>
                  {'showContractor' in currentTableSettings && currentTableSettings.showContractor && (
                    <TableHead className="font-semibold text-foreground flex-1">Contractor</TableHead>
                  )}
                  {currentTableSettings.showStartDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Start Date</TableHead>
                  )}
                  {currentTableSettings.showDueDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Due Date</TableHead>
                  )}
                  {currentTableSettings.showDependencies && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Dependencies</TableHead>
                  )}
                  {currentTableSettings.showChangeOrders && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Change Orders</TableHead>
                  )}
                </>
              )}
              {viewMode === "invoiced-paid" && (
                <>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Revised Contract Amount</TableHead>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Invoiced</TableHead>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Paid</TableHead>
                  <TableHead className="font-semibold text-foreground text-center flex-1">Status</TableHead>
                  {'showBalance' in currentTableSettings && currentTableSettings.showBalance && (
                    <TableHead className="font-semibold text-foreground text-right flex-1">Balance</TableHead>
                  )}
                  {currentTableSettings.showStartDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Start Date</TableHead>
                  )}
                  {currentTableSettings.showDueDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Due Date</TableHead>
                  )}
                  {currentTableSettings.showDependencies && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Dependencies</TableHead>
                  )}
                  {currentTableSettings.showChangeOrders && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Change Orders</TableHead>
                  )}
                </>
              )}
              {(viewMode === "costs-bills" || viewMode === "cost-tracking") && (
                <>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Est Cost</TableHead>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Actual Cost (Billed)</TableHead>
                  <TableHead className="font-semibold text-foreground text-right flex-1">Paid</TableHead>
                  {'showVendor' in currentTableSettings && currentTableSettings.showVendor && (
                    <TableHead className="font-semibold text-foreground flex-1">Vendor</TableHead>
                  )}
                  {'showUnit' in currentTableSettings && currentTableSettings.showUnit && (
                    <TableHead className="font-semibold text-foreground text-right flex-1">Unit</TableHead>
                  )}
                  {'showQuantity' in currentTableSettings && currentTableSettings.showQuantity && (
                    <TableHead className="font-semibold text-foreground text-right flex-1">Quantity</TableHead>
                  )}
                  {'showUnitPrice' in currentTableSettings && currentTableSettings.showUnitPrice && (
                    <TableHead className="font-semibold text-foreground text-right flex-1">Unit Price</TableHead>
                  )}
                  {'showBalance' in currentTableSettings && currentTableSettings.showBalance && (
                    <TableHead className="font-semibold text-foreground text-right flex-1">Balance</TableHead>
                  )}
                  {currentTableSettings.showStartDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Start Date</TableHead>
                  )}
                  {currentTableSettings.showDueDate && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Due Date</TableHead>
                  )}
                  {currentTableSettings.showDependencies && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Dependencies</TableHead>
                  )}
                  {currentTableSettings.showChangeOrders && (
                    <TableHead className="font-semibold text-foreground text-center flex-1">Change Orders</TableHead>
                  )}
                </>
              )}
              <TableHead className="font-semibold text-foreground text-right w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item, index) => (
              <TableRow 
                key={`${item.costCode}-${item.itemLine}`}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                } ${item.isCategory ? 'font-medium' : ''}`}
              >
                <TableCell className="w-24" style={getIndentationStyle(item.level)}>
                  <div className="flex items-center">
                    {renderExpandIcon(item)}
                    {item.costCode}
                  </div>
                </TableCell>
                <TableCell className="font-medium w-40">{item.itemLine}</TableCell>
                {renderFinancialCells(item)}
                <TableCell className="text-right w-20">
                  {!item.isCategory && (
                    <FinancialTableActions
                      item={item}
                      viewMode={viewMode}
                      onItemLineAction={onItemLineAction}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
