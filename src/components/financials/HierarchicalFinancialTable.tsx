// ✅ FINAL VERSION — with hierarchy rendering + financial data cells
import { useState } from "react";
import { Card } from "@/components/ui/card";
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
import { EstimateActualItem, ViewMode, TableDisplaySettings } from "@/types/financials";

interface HierarchicalFinancialTableProps {
  viewMode: ViewMode;
  data: EstimateActualItem[];
  onAddItemLine: () => void;
  onItemLineAction: (
    itemLine: string,
    action: "invoice" | "bill-paid" | "invoice-paid" | "bill" | "details" | "edit" | "delete" | "complete"
  ) => void;
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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    newExpanded.has(id) ? newExpanded.delete(id) : newExpanded.add(id);
    setExpandedItems(newExpanded);
  };

  const getVisibleItems = () => {
    const visibleItems: EstimateActualItem[] = [];
    const processItem = (item: EstimateActualItem, parentExpanded: boolean = true) => {
      const matchesSearch = item.itemLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      if (parentExpanded && matchesSearch && matchesStatus) {
        visibleItems.push(item);
        const isExpanded = expandedItems.has(String(item.id));
        if (isExpanded) {
          const children = data.filter(child => String(child.parentId) === String(item.id));
          children.forEach(child => processItem(child, true));
        }
      }
    };
    const rootItems = data.filter(item => item.level === 1);
    rootItems.forEach(item => processItem(item, true));
    return visibleItems;
  };

  const renderExpandIcon = (item: EstimateActualItem) => {
    const hasChildren = data.some(child => String(child.parentId) === String(item.id));
    if (!hasChildren) return null;
    const isExpanded = expandedItems.has(String(item.id));
    return (
      <button onClick={() => toggleExpanded(String(item.id))} className="mr-2 p-1 hover:bg-muted rounded">
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    );
  };

  const getIndentationStyle = (level?: number) => ({ paddingLeft: `${((level || 1) - 1) * 24}px` });
  const formatCurrency = (val: number = 0) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);

  const getStatusFromItem = (item: EstimateActualItem): "Planned" | "In Progress" | "Finished" | "Already Due" => {
    if (item.isCompleted || item.status === "completed") return "Finished";
    if (item.status === "in-progress") return "In Progress";
    if (item.status === "on-hold") return "Already Due";
    return item.startDate && item.dueDate ? calculateStatusFromDates(item.startDate, item.dueDate) : "Planned";
  };

  const renderFinancialCells = (item: EstimateActualItem) => {
    if (!item) return null;
    const estimatedCost = (item.quantity || 0) * (item.unitPrice || 0);
    const revisedContract = item.estimatedRevenue || estimatedCost;
    const balance = revisedContract - (item.paid || 0);
    const status = getStatusFromItem(item);
  
    switch (viewMode) {
      case "contract-amounts":
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
                      onClick={() => onItemLineAction(item.itemLine, status === 'Finished' ? 'edit' : 'complete')}
                      isClickable
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{status}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </>
        );
  
      case "invoiced-paid":
        return (
          <>
            <TableCell className="text-right flex-1">{formatCurrency(revisedContract)}</TableCell>
            <TableCell className="text-right flex-1">{formatCurrency(item.invoiced || 0)}</TableCell>
            <TableCell className="text-right flex-1">{formatCurrency(item.paid || 0)}</TableCell>
            <TableCell className="text-center flex-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <StatusIcon
                      status={status}
                      className="w-5 h-5"
                      onClick={() => onItemLineAction(item.itemLine, status === 'Finished' ? 'edit' : 'complete')}
                      isClickable
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{status}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="text-right flex-1">{formatCurrency(balance)}</TableCell>
          </>
        );
  
      case "cost-tracking":
        return (
          <>
            <TableCell className="text-right flex-1">{formatCurrency(estimatedCost)}</TableCell>
            <TableCell className="text-right flex-1">{formatCurrency(item.actualCost || 0)}</TableCell>
            <TableCell className="text-right flex-1">{formatCurrency(item.paid || 0)}</TableCell>
          </>
        );
  
      default:
        return (
          <>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </>
        );
    }
  };
  

  const visibleItems = getVisibleItems();
  const viewModeKey =
    viewMode === "contract-amounts"
      ? "contractAmounts"
      : viewMode === "invoiced-paid"
      ? "invoicedPaid"
      : viewMode === "costs-bills"
      ? "costsBills"
      : "costTracking";

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
                  <TableHead className="text-right">Original Contract</TableHead>
                  <TableHead className="text-right">Revised Contract</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </>
              )}
              {viewMode === "invoiced-paid" && (
                <>
                  <TableHead className="text-right">Revised Contract</TableHead>
                  <TableHead className="text-right">Invoiced</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </>
              )}
              {viewMode === "cost-tracking" && (
                <>
                  <TableHead className="text-right">Estimated</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.map((item, index) => (
              <TableRow
                key={`${item.costCode}-${item.itemLine}`}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                } ${item.isCategory ? "font-medium" : ""}`}
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
