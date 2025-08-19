
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Settings2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewMode } from "@/types/financials";

interface FinancialTableControlsProps {
  viewMode: ViewMode;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSettingsClick: () => void;
  onAddItemLine?: () => void;
  onAddInvoice?: () => void;
  onPaymentReceived?: () => void;
  onAddBill?: () => void;
  onBillPaid?: () => void;
  onAddTeamCost?: () => void;
}

const getStatusOptionsForViewMode = (viewMode: ViewMode) => {
  const baseOptions = [
    { value: "all", label: "All Status" },
    { value: "not_started", label: "Not Started" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on_hold", label: "On Hold" }
  ];

  // For different view modes, we might want different filter options
  switch (viewMode) {
    case "invoiced-paid":
      return [
        { value: "all", label: "All Status" },
        { value: "pending-invoice", label: "Pending Invoice" },
        { value: "invoiced", label: "Invoiced" },
        { value: "partially-paid", label: "Partially Paid" },
        { value: "fully-paid", label: "Fully Paid" }
      ];
    case "costs-bills":
      return [
        { value: "all", label: "All Status" },
        { value: "pending-bill", label: "Pending Bill" },
        { value: "billed", label: "Billed" },
        { value: "partially-paid", label: "Partially Paid" },
        { value: "paid", label: "Paid" }
      ];
    case "cost-tracking":
      return [
        { value: "all", label: "All Vendors" },
        { value: "abc-construction", label: "ABC Construction" },
        { value: "super-company", label: "Super Company" },
        { value: "plumbpro-services", label: "PlumbPro Services" }
      ];
    default:
      return baseOptions;
  }
};

const getSearchPlaceholder = (viewMode: ViewMode) => {
  switch (viewMode) {
    case "contract-amounts":
      return "Search item lines...";
    case "invoiced-paid":
      return "Search invoices and payments...";
    case "costs-bills":
      return "Search costs and bills...";
    case "cost-tracking":
      return "Search by vendor or description...";
    default:
      return "Search...";
  }
};

const getActionButtons = (viewMode: ViewMode, handlers: {
  onAddItemLine?: () => void;
  onAddInvoice?: () => void;
  onPaymentReceived?: () => void;
  onAddBill?: () => void;
  onBillPaid?: () => void;
  onAddTeamCost?: () => void;
}) => {
  switch (viewMode) {
    case "contract-amounts":
      return (
        <Button 
          onClick={handlers.onAddItemLine}
          className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item Line
        </Button>
      );
    case "invoiced-paid":
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handlers.onAddInvoice}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Invoice
          </Button>
          <Button 
            onClick={handlers.onPaymentReceived}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Payment Received
          </Button>
        </div>
      );
    case "costs-bills":
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handlers.onAddBill}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
          <Button 
            onClick={handlers.onBillPaid}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Bill Paid
          </Button>
        </div>
      );
    case "cost-tracking":
      return (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handlers.onAddBill}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
          <Button 
            onClick={handlers.onBillPaid}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Bill Paid
          </Button>
        </div>
      );
    case "team-cost":
      return (
        <Button 
          onClick={handlers.onAddTeamCost}
          className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team Cost
        </Button>
      );
    default:
      return null;
  }
};

export const FinancialTableControls = ({
  viewMode,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onSettingsClick,
  onAddItemLine,
  onAddInvoice,
  onPaymentReceived,
  onAddBill,
  onBillPaid,
  onAddTeamCost,
}: FinancialTableControlsProps) => {
  const statusOptions = getStatusOptionsForViewMode(viewMode);
  const searchPlaceholder = getSearchPlaceholder(viewMode);
  const hasActiveFilter = statusFilter !== "all";

  const actionButtons = getActionButtons(viewMode, {
    onAddItemLine,
    onAddInvoice,
    onPaymentReceived,
    onAddBill,
    onBillPaid,
    onAddTeamCost,
  });

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left side - Search */}
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white border-gray-300"
        />
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={`hover:bg-gray-100 ${hasActiveFilter ? "text-yellow-600 hover:text-yellow-700" : "text-gray-600 hover:text-gray-700"}`}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white z-50">
            {statusOptions.map(option => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={statusFilter === option.value ? "bg-accent" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
        >
          <Settings2 className="h-4 w-4" />
        </Button>

        {actionButtons}
      </div>
    </div>
  );
};
