// FinancialsPageContent.tsx
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
import { CreateBillDialog } from "./CreateBillDialog";
import { BillPaidDialog } from "./BillPaidDialog";
import { useGetTeamCosts, useCreateTeamCosts } from "@/hooks/queries/teamCosts";
import {
  EstimateActualItem,
  ViewMode,
  FinancialDocument,
  TableDisplaySettings,
} from "@/types/financials";

interface FinancialsPageContentProps {
  projectRef: string;
  estimatesActualsData: EstimateActualItem[];
  documents: FinancialDocument[];
  tableSettings: TableDisplaySettings;
  onTableSettingsChange: (settings: TableDisplaySettings) => void;

  // existing
  onAddItemLine: (newItem: {
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string | number;
    status: "not_started" | "in_progress" | "completed" | "on-hold";
  }) => void;
  onItemLineAction: (
    itemLine: string,
    action:
      | "invoice"
      | "bill-paid"
      | "invoice-paid"
      | "bill"
      | "details"
      | "edit"
      | "delete"
      | "complete"
  ) => EstimateActualItem | null;
  getDocumentsForItemLine: (itemLine: string) => FinancialDocument[];
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;

  // NEW: plug these from your container (uses useFinancialsData or services/api)
  addInvoice: (args: {
    projectRef: string;
    item_line_id: number;
    amount: number;
    issue_date?: string;
    due_date?: string;
    tax_amount?: number;
    total_amount?: number;
    invoice_number?: string;
    status?: string;
  }) => Promise<void>;

  addPayment: (
    projectRef: string,
    invoiceRef: string,
    args: {
      amount: number;
      payment_date?: string;
      payment_method?: string;
      reference_number?: string;
      notes?: string;
    }
  ) => Promise<void>;

  // Used by PaymentReceivedDialog to list invoices
  loadProjectInvoices: (projectRef: string) => Promise<any>;

  addBill: (args: {
    projectRef: string;
    item_line_id: number;
    amount: number;
    issue_date?: string;
    due_date?: string;
    tax_amount?: number;
    total_amount?: number;
    bill_number?: string;
    status?: string;
  }) => Promise<void>;

  loadProjectBills: (projectRef: string) => Promise<any>;
  addBillPayment: (
    projectRef: string,
    billRef: string,
    args: {
      amount: number;
      payment_date?: string;
      payment_method?: string;
      reference_number?: string;
      notes?: string;
    }
  ) => Promise<void>;
}

export const FinancialsPageContent = ({
  projectRef,
  estimatesActualsData,
  documents,
  tableSettings,
  onTableSettingsChange,
  onAddItemLine,
  onItemLineAction,
  getDocumentsForItemLine,
  onDeleteDocument,
  onRenameDocument,
  addInvoice,            // <- here
  addPayment,            // <- here
  loadProjectInvoices,   // <- here
  addBill,
  loadProjectBills,
  addBillPayment,
}: FinancialsPageContentProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("contract-amounts");

  // dialogs
  const [isItemLineDialogOpen, setIsItemLineDialogOpen] = useState(false);
  const [isAddInvoicePaymentDialogOpen, setIsAddInvoicePaymentDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isUploadInvoiceDialogOpen, setIsUploadInvoiceDialogOpen] = useState(false);
  const [isPaymentReceivedDialogOpen, setIsPaymentReceivedDialogOpen] = useState(false);
  const [isCreateInvoiceDialogOpen, setIsCreateInvoiceDialogOpen] = useState(false);
  const [selectedItemLine, setSelectedItemLine] = useState<string>("");
  const [editingItem, setEditingItem] = useState<EstimateActualItem | undefined>(undefined);
  const [isCreateBillDialogOpen, setIsCreateBillDialogOpen] = useState(false);
  const [isBillPaidDialogOpen, setIsBillPaidDialogOpen] = useState(false);
  const [actionType, setActionType] =
    useState<"invoice" | "bill-paid" | "invoice-paid" | "bill">("invoice");

  const { data: teamCosts = [], refetch: refetchTeamCosts } = useGetTeamCosts(projectRef);
  const teamCostTotal = teamCosts.reduce((sum, r) => sum + (r.totalCost || 0), 0);

  const handleItemLineActionInternal = (
    itemLine: string,
    action:
      | "invoice"
      | "bill-paid"
      | "invoice-paid"
      | "bill"
      | "details"
      | "edit"
      | "delete"
      | "complete"
  ) => {
    if (action === "details") {
      setSelectedItemLine(itemLine);
      setIsHistoryDialogOpen(true);
    } else if (action === "edit") {
      const item = onItemLineAction(itemLine, action);
      if (item) {
        setEditingItem(item);
        setIsItemLineDialogOpen(true);
      }
    } else if (action === "delete" || action === "complete") {
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
    dependsOn?: string | number;
    status: "not_started" | "in_progress" | "completed" | "on-hold";
  }) => {
    onAddItemLine(newItem);
    setEditingItem(undefined);
    setIsItemLineDialogOpen(false);
  };

  const handleCloseItemLineDialog = () => {
    setIsItemLineDialogOpen(false);
    setEditingItem(undefined);
  };

  // toolbar buttons
  const handleAddInvoice = () => setIsCreateInvoiceDialogOpen(true);
  const handlePaymentReceived = () => setIsPaymentReceivedDialogOpen(true);
  const handleAddBill     = () => setIsCreateBillDialogOpen(true);
  const handleBillPaid    = () => setIsBillPaidDialogOpen(true);
  const handleAddTeamCost = () => {};

  // upload
  const handleUploadInvoice = (
    file: File,
    itemLines: string[],
    amounts: number[],
    invoiceDate: string,
    dueDate: string
  ) => {
    // optional: batch create invoices here
    setIsUploadInvoiceDialogOpen(false);
  };

  // ←—— where addPayment is called
  const handlePaymentReceivedSubmit = async (
    invoiceRef: string,
    amount: number,
    paymentDate: string
  ) => {
    await addPayment(projectRef, invoiceRef, {
      amount,
      payment_date: paymentDate,
    });
    setIsPaymentReceivedDialogOpen(false);
  };

  // ←—— where addInvoice is called
  const handleCreateInvoice = async (
    selectedItems: { costCode: string; itemLine: string; amount: number, invoiceNumber: string; }[]
  ) => {
    const first = selectedItems[0];
    if (!first) return;

    // map itemLine text to its id for item_line_id
    const target = estimatesActualsData.find((i) => i.itemLine === first.itemLine);
    if (!target?.id) return;

    await addInvoice({
      projectRef,
      item_line_id: Number(target.id),
      amount: first.amount,
      invoice_number: first.invoiceNumber
      // issue_date, due_date... can be added when your dialog collects them
    });

    setIsCreateInvoiceDialogOpen(false);
  };

  const handleCreateBill = async (
    selectedItems: { costCode: string; itemLine: string; amount: number, billNumber: string; }[]
  ) => {
    const first = selectedItems[0];
    if (!first) return;

    // map itemLine text to its id for item_line_id
    const target = estimatesActualsData.find((i) => i.itemLine === first.itemLine);
    if (!target?.id) return;

    await addBill({
      projectRef,
      item_line_id: Number(target.id),
      amount: first.amount,
      bill_number: first.billNumber
      // issue_date, due_date... can be added when your dialog collects them
    });

    setIsCreateBillDialogOpen(false);
  };
  
  const handleBillPaidSubmit = async (
    billRef: string,
    amount: number,
    paymentDate: string
  ) => {
    await addBillPayment(projectRef, billRef, {
      amount,
      payment_date: paymentDate,
    });
    setIsBillPaidDialogOpen(false);
  };

  return (
    <div className="space-y-6 min-h-screen pb-8 px-6">
      <CashFlowGraph documents={documents} />

      <Card className="border border-border bg-card shadow-sm">
        <div className="p-4 space-y-4">
          <FinancialOverviewBlocks
            estimatesActualsData={estimatesActualsData}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            teamCostTotal={teamCostTotal}
          />

          {viewMode === "team-cost" ? (
            <TeamCostsTable 
              projectRef={projectRef}
            />
          ) : viewMode === "contract-amounts" ||
            viewMode === "invoiced-paid" ||
            viewMode === "cost-tracking" ? (
            <HierarchicalFinancialTable
              viewMode={viewMode}
              data={estimatesActualsData}
              onAddItemLine={() => setIsItemLineDialogOpen(true)}
              onAddInvoice={handleAddInvoice}                 // ← add
              onPaymentReceived={handlePaymentReceived} 
              onItemLineAction={handleItemLineActionInternal}
              tableSettings={tableSettings}
              onTableSettingsChange={onTableSettingsChange}
              onAddBill={handleAddBill}                 // ← add
              onBillPaymentReceived={handleBillPaid} 
            />
          ) : (
            <ConsistentFinancialTable
              viewMode={viewMode}
              data={estimatesActualsData}
              onAddItemLine={() => setIsItemLineDialogOpen(true)}
              onAddInvoice={handleAddInvoice}                 // ← add
              onPaymentReceived={handlePaymentReceived} 
              onItemLineAction={handleItemLineActionInternal}
              tableSettings={tableSettings}
              onTableSettingsChange={onTableSettingsChange}
              onAddBill={handleAddBill}                 // ← add
              onBillPaymentReceived={handleBillPaid} 
            />
          )}
        </div>
      </Card>

      {/* Item line CRUD + history */}
      <FinancialsDialogs
        projectRef={projectRef}
        isItemLineDialogOpen={isItemLineDialogOpen}
        onCloseItemLineDialog={handleCloseItemLineDialog}
        onSaveItemLine={handleAddItemLineInternal}
        existingItemLines={estimatesActualsData}
        editingItem={editingItem}
        isAddInvoicePaymentDialogOpen={isAddInvoicePaymentDialogOpen}
        onCloseAddInvoicePaymentDialog={() => setIsAddInvoicePaymentDialogOpen(false)}
        selectedItemLine={selectedItemLine}
        actionType={actionType}
        isHistoryDialogOpen={isHistoryDialogOpen}
        onCloseHistoryDialog={() => setIsHistoryDialogOpen(false)}
        documents={getDocumentsForItemLine(selectedItemLine)}
        onDeleteDocument={onDeleteDocument}
        onRenameDocument={onRenameDocument}
        onAfterMutation={() => refetch()}   // <— ensure invoiced/paid totals update
      />


      {/* Upload (optional) */}
      <UploadInvoiceDialog
        isOpen={isUploadInvoiceDialogOpen}
        onClose={() => setIsUploadInvoiceDialogOpen(false)}
        onUpload={handleUploadInvoice}
        itemLines={estimatesActualsData.map((item) => item.itemLine)}
      />

      {/* Payment Received — loads invoices via prop & calls addPayment */}
      <PaymentReceivedDialog
        isOpen={isPaymentReceivedDialogOpen}
        onClose={() => setIsPaymentReceivedDialogOpen(false)}
        projectRef={projectRef}
        loadInvoices={loadProjectInvoices}
        onPayment={handlePaymentReceivedSubmit}
        // If you want to pre-filter to the selected row:
        // itemLineIdFilter={estimatesActualsData.find(i => i.itemLine === selectedItemLine)?.id as number}
      />

      {/* Create Invoice — maps selected item line → item_line_id & calls addInvoice */}
      <CreateInvoiceDialog
        isOpen={isCreateInvoiceDialogOpen}
        onClose={() => setIsCreateInvoiceDialogOpen(false)}
        onCreateInvoice={handleCreateInvoice}
        estimatesActualsData={estimatesActualsData}
      />

      <CreateBillDialog
        isOpen={isCreateBillDialogOpen}
        onClose={() => setIsCreateBillDialogOpen(false)}
        onCreateBill={handleCreateBill}
        estimatesActualsData={estimatesActualsData}
      />

      <BillPaidDialog
        isOpen={isBillPaidDialogOpen}
        onClose={() => setIsBillPaidDialogOpen(false)}
        projectRef={projectRef}
        loadBills={loadProjectBills}
        onPayment={(billRef, amount, date) => handleBillPaidSubmit(billRef, amount, date)}
      />
    </div>
  );
};
