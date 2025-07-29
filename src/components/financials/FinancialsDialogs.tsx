
import { ItemLineDialog } from "./ItemLineDialog";
import { AddInvoicePaymentDialog } from "./AddInvoicePaymentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { EstimateActualItem, FinancialDocument } from "@/types/financials";

interface FinancialsDialogsProps {
  isItemLineDialogOpen: boolean;
  onCloseItemLineDialog: () => void;
  onSaveItemLine: (itemLine: {
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
  }) => void;
  existingItemLines: EstimateActualItem[];
  editingItem?: EstimateActualItem;
  
  isAddInvoicePaymentDialogOpen: boolean;
  onCloseAddInvoicePaymentDialog: () => void;
  selectedItemLine: string;
  actionType: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill';
  onSaveInvoicePayment: (itemLine: string, type: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill', amount: number, expectedDate: string, file?: File) => void;
  
  isHistoryDialogOpen: boolean;
  onCloseHistoryDialog: () => void;
  documents: FinancialDocument[];
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;
}

export const FinancialsDialogs = ({
  isItemLineDialogOpen,
  onCloseItemLineDialog,
  onSaveItemLine,
  existingItemLines,
  editingItem,
  isAddInvoicePaymentDialogOpen,
  onCloseAddInvoicePaymentDialog,
  selectedItemLine,
  actionType,
  onSaveInvoicePayment,
  isHistoryDialogOpen,
  onCloseHistoryDialog,
  documents,
  onDeleteDocument,
  onRenameDocument,
}: FinancialsDialogsProps) => {
  return (
    <>
      <ItemLineDialog
        isOpen={isItemLineDialogOpen}
        onClose={onCloseItemLineDialog}
        onSave={onSaveItemLine}
        existingItemLines={existingItemLines}
        editingItem={editingItem}
      />

      <AddInvoicePaymentDialog
        isOpen={isAddInvoicePaymentDialogOpen}
        onClose={onCloseAddInvoicePaymentDialog}
        itemLine={selectedItemLine}
        type={actionType}
        onSave={onSaveInvoicePayment}
      />

      <HistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={onCloseHistoryDialog}
        itemLine={selectedItemLine}
        documents={documents}
        onDeleteDocument={onDeleteDocument}
        onRenameDocument={onRenameDocument}
      />
    </>
  );
};
