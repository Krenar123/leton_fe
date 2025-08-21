import { ItemLineDialog } from "./ItemLineDialog";
import { AddInvoicePaymentDialog } from "./AddInvoicePaymentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { EstimateActualItem, FinancialDocument } from "@/types/financials";
import {
  createItemLine as apiCreateItemLine,
  updateItemLine as apiUpdateItemLine,
  fetchItemLines as apiFetchItemLines,
} from "@/services/api";
// import { toast } from "@/hooks/use-toast"; // optional

interface FinancialsDialogsProps {
  projectRef: string;

  isItemLineDialogOpen: boolean;
  onCloseItemLineDialog: () => void;

  // Make this optional; we'll handle save here directly to avoid misrouting to POST.
  onSaveItemLine?: (itemLine: any) => void;

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

  onReloadItemLines?: (items: EstimateActualItem[]) => void;
}

export const FinancialsDialogs = ({
  projectRef,
  isItemLineDialogOpen,
  onCloseItemLineDialog,
  onSaveItemLine, // optional; we won't use it while fixing update
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
  onReloadItemLines,
}: FinancialsDialogsProps) => {

  function toApiPayload(fe: any) {
    return {
      item_line: fe.itemLine,
      contractor: fe.contractor ?? null,
      unit: fe.unit ?? null,
      quantity: fe.quantity ?? null,
      unit_price: fe.unitPrice ?? null,
      estimated_cost: fe.estimatedCost ?? null,
      estimated_revenue: fe.estimatedRevenue ?? null,
      start_date: fe.startDate ?? null, // already YYYY-MM-DD
      due_date: fe.dueDate ?? null,
      depends_on: fe.dependsOn ?? null,
      status: fe.status,
      parent_id: fe.parentId ?? null,
    };
  }

  const handleSaveHere = async (fePayload: any) => {
    const payload = fePayload;

    if (fePayload.ref) {
      // UPDATE (PATCH /projects/:project_ref/item_lines/:ref)
      await apiUpdateItemLine(projectRef, fePayload.ref, payload);
      // toast({ title: "Item updated" });
    } else {
      // CREATE (POST /projects/:project_ref/item_lines)
      await apiCreateItemLine(projectRef, payload);
      // toast({ title: "Item created" });
    }

    // refresh list for UI
    const fresh = await apiFetchItemLines(projectRef);
    onReloadItemLines?.(fresh as any);

    onCloseItemLineDialog();
  };

  return (
    <>
      <ItemLineDialog
        isOpen={isItemLineDialogOpen}
        onClose={onCloseItemLineDialog}
        onSave={handleSaveHere}
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
