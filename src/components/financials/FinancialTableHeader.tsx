
import { ViewMode } from "@/types/financials";
import { FinancialTableControls } from "./FinancialTableControls";

interface FinancialTableHeaderProps {
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

export const FinancialTableHeader = ({
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
}: FinancialTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <FinancialTableControls
        viewMode={viewMode}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        onSettingsClick={onSettingsClick}
        onAddItemLine={onAddItemLine}
        onAddInvoice={onAddInvoice}
        onPaymentReceived={onPaymentReceived}
        onAddBill={onAddBill}
        onBillPaid={onBillPaid}
        onAddTeamCost={onAddTeamCost}
      />
    </div>
  );
};
