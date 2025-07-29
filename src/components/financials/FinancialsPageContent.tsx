
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CashFlowGraph } from "./CashFlowGraph";
import { FinancialOverviewBlocks } from "./FinancialOverviewBlocks";
import { ConsistentFinancialTable } from "./ConsistentFinancialTable";
import { HierarchicalFinancialTable } from "./HierarchicalFinancialTable";
import { TeamCostsTable } from "./TeamCostsTable";
import { FinancialsDialogs } from "./FinancialsDialogs";
import { UploadInvoiceDialog } from "./UploadInvoiceDialog";
import { PaymentReceivedDialog } from "./PaymentReceivedDialog";
import { CreateInvoiceDialog } from "./CreateInvoiceDialog";
import { EstimateActualItem, ViewMode, FinancialDocument, TableDisplaySettings } from "@/types/financials";

interface FinancialsPageContentProps {
  estimatesActualsData: EstimateActualItem[];
  documents: FinancialDocument[];
  tableSettings: TableDisplaySettings;
  onTableSettingsChange: (settings: TableDisplaySettings) => void;
  onAddItemLine: (newItem: {
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  }) => void;
  onAddInvoicePayment: (itemLine: string, type: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill', amount: number, expectedDate: string, file?: File) => void;
  onItemLineAction: (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => EstimateActualItem | null;
  getDocumentsForItemLine: (itemLine: string) => FinancialDocument[];
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;
}

export const FinancialsPageContent = ({
  estimatesActualsData,
  documents,
  tableSettings,
  onTableSettingsChange,
  onAddItemLine,
  onAddInvoicePayment,
  onItemLineAction,
  getDocumentsForItemLine,
  onDeleteDocument,
  onRenameDocument,
}: FinancialsPageContentProps) => {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>('contract-amounts');

  // State for dialogs
  const [isItemLineDialogOpen, setIsItemLineDialogOpen] = useState(false);
  const [isAddInvoicePaymentDialogOpen, setIsAddInvoicePaymentDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isUploadInvoiceDialogOpen, setIsUploadInvoiceDialogOpen] = useState(false);
  const [isPaymentReceivedDialogOpen, setIsPaymentReceivedDialogOpen] = useState(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [selectedItemLine, setSelectedItemLine] = useState<string>("");
  const [editingItem, setEditingItem] = useState<EstimateActualItem | undefined>(undefined);
  const [actionType, setActionType] = useState<'invoice' | 'bill-paid' | 'invoice-paid' | 'bill'>('invoice');

  const handleItemLineActionInternal = (itemLine: string, action: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill' | 'details' | 'edit' | 'delete' | 'complete') => {
    if (action === 'details') {
      setSelectedItemLine(itemLine);
      setIsHistoryDialogOpen(true);
    } else if (action === 'edit') {
      const item = onItemLineAction(itemLine, action);
      if (item) {
        setEditingItem(item);
        setIsItemLineDialogOpen(true);
      }
    } else if (action === 'delete' || action === 'complete') {
      onItemLineAction(itemLine, action);
    } else {
      setSelectedItemLine(itemLine);
      setActionType(action);
      setIsAddInvoicePaymentDialogOpen(true);
    }
  };

  const handleAddItemLineInternal = (newItem: {
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  }) => {
    onAddItemLine(newItem);
    setEditingItem(undefined);
    setIsItemLineDialogOpen(false);
  };

  const handleCloseItemLineDialog = () => {
    setIsItemLineDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleOpenAddItemLineDialog = () => {
    console.log("Opening Add Item Line dialog");
    setIsItemLineDialogOpen(true);
  };

  // Handler functions for different button actions
  const handleAddInvoice = () => {
    console.log("Add Invoice clicked");
    setIsCreateInvoiceDialogOpen(true);
  };

  const handlePaymentReceived = () => {
    console.log("Payment Received clicked");
    setIsPaymentReceivedDialogOpen(true);
  };

  const handleAddBill = () => {
    console.log("Add Bill clicked");
    // TODO: Implement add bill functionality
  };

  const handleBillPaid = () => {
    console.log("Bill Paid clicked");
    // TODO: Implement bill paid functionality
  };

  const handleAddTeamCost = () => {
    console.log("Add Team Cost clicked");
    // TODO: Implement add team cost functionality
  };

  const handleUploadInvoice = (file: File, itemLines: string[], amounts: number[], invoiceDate: string, dueDate: string) => {
    console.log("Uploading invoice:", { file, itemLines, amounts, invoiceDate, dueDate });
    // TODO: Process the invoice upload
    setIsUploadInvoiceDialogOpen(false);
  };

  const handlePaymentReceivedSubmit = (invoiceId: string, amount: number, paymentDate: string) => {
    console.log("Processing payment:", { invoiceId, amount, paymentDate });
    // TODO: Process the payment
    setIsPaymentReceivedDialogOpen(false);
  };

  const handleCreateInvoice = (selectedItems: { costCode: string; itemLine: string; amount: number }[]) => {
    console.log("Creating invoice for items:", selectedItems);
    // Just close the dialog for now - invoice creation will be implemented later
    setIsCreateInvoiceDialogOpen(false);
  };

  return (
    <div className="space-y-6 min-h-screen pb-8 px-6">
      {/* Cash Flow Graph Section */}
      <CashFlowGraph documents={documents} />

      {/* Financial Overview and Table Section */}
      <Card className="border border-border bg-card shadow-sm">
        <div className="p-4 space-y-4">
          {/* Financial Overview Blocks */}
          <FinancialOverviewBlocks 
            estimatesActualsData={estimatesActualsData}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Financial Table or Team Costs Table */}
          {viewMode === 'team-cost' ? (
            <TeamCostsTable />
          ) : viewMode === 'contract-amounts' || viewMode === 'invoiced-paid' || viewMode === 'cost-tracking' ? (
            <HierarchicalFinancialTable 
              viewMode={viewMode}
              data={estimatesActualsData}
              onAddItemLine={handleOpenAddItemLineDialog}
              onItemLineAction={handleItemLineActionInternal}
              tableSettings={tableSettings}
              onTableSettingsChange={onTableSettingsChange}
            />
          ) : (
            <ConsistentFinancialTable 
              viewMode={viewMode}
              data={estimatesActualsData}
              onAddItemLine={handleOpenAddItemLineDialog}
              onItemLineAction={handleItemLineActionInternal}
              tableSettings={tableSettings}
              onTableSettingsChange={onTableSettingsChange}
            />
          )}
        </div>
      </Card>

      {/* Dialogs */}
      <FinancialsDialogs
        isItemLineDialogOpen={isItemLineDialogOpen}
        onCloseItemLineDialog={handleCloseItemLineDialog}
        onSaveItemLine={handleAddItemLineInternal}
        existingItemLines={estimatesActualsData}
        editingItem={editingItem}
        isAddInvoicePaymentDialogOpen={isAddInvoicePaymentDialogOpen}
        onCloseAddInvoicePaymentDialog={() => setIsAddInvoicePaymentDialogOpen(false)}
        selectedItemLine={selectedItemLine}
        actionType={actionType}
        onSaveInvoicePayment={onAddInvoicePayment}
        isHistoryDialogOpen={isHistoryDialogOpen}
        onCloseHistoryDialog={() => setIsHistoryDialogOpen(false)}
        documents={getDocumentsForItemLine(selectedItemLine)}
        onDeleteDocument={onDeleteDocument}
        onRenameDocument={onRenameDocument}
      />

      {/* New Dialogs */}
      <UploadInvoiceDialog
        isOpen={isUploadInvoiceDialogOpen}
        onClose={() => setIsUploadInvoiceDialogOpen(false)}
        onUpload={handleUploadInvoice}
        itemLines={estimatesActualsData.map(item => item.itemLine)}
      />

      <PaymentReceivedDialog
        isOpen={isPaymentReceivedDialogOpen}
        onClose={() => setIsPaymentReceivedDialogOpen(false)}
        onPayment={handlePaymentReceivedSubmit}
        invoices={documents.filter(doc => doc.type === 'invoice')}
      />

      <CreateInvoiceDialog
        isOpen={isCreateInvoiceDialogOpen}
        onClose={() => setIsCreateInvoiceDialogOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        estimatesActualsData={estimatesActualsData}
      />
    </div>
  );
};
