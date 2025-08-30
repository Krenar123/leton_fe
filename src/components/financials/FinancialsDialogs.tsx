import { useEffect, useMemo, useState } from "react";
import { ItemLineDialog } from "./ItemLineDialog";
import { AddInvoicePaymentDialog } from "./AddInvoicePaymentDialog";
import { HistoryDialog } from "./HistoryDialog";
import { EstimateActualItem, FinancialDocument } from "@/types/financials";
import {
  createInvoice,
  createPaymentForInvoice,
  fetchProjectInvoices,
} from "@/services/api";

interface FinancialsDialogsProps {
  projectRef: string;

  /** Item Line dialog */
  isItemLineDialogOpen: boolean;
  onCloseItemLineDialog: () => void;
  onSaveItemLine: (itemLine: any, editingItem?: EstimateActualItem) => Promise<void> | void;
  existingItemLines: EstimateActualItem[];
  editingItem?: EstimateActualItem;

  /** Add Invoice / Payment dialog (unified) */
  isAddInvoicePaymentDialogOpen: boolean;
  onCloseAddInvoicePaymentDialog: () => void;
  selectedItemLine: string; // comes from row action; can be empty when opened from toolbar
  actionType: "invoice" | "bill-paid" | "invoice-paid" | "bill";

  /** Optional: if you want to keep parent informed. Not required anymore. */
  onSaveInvoicePayment?: (
    itemLine: string,
    type: "invoice" | "bill-paid" | "invoice-paid" | "bill",
    amount: number,
    expectedDate: string,
    file?: File
  ) => void;

  /** History dialog */
  isHistoryDialogOpen: boolean;
  onCloseHistoryDialog: () => void;
  documents: FinancialDocument[];
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;

  /** Ask parent to refetch item lines after invoice/payment so totals update */
  onAfterMutation?: () => Promise<void> | void;
}

type Option = { value: string; label: string };

export const FinancialsDialogs = ({
  projectRef,
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

  onAfterMutation,
}: FinancialsDialogsProps) => {
  /** Build item line options for the Invoice flow (only non-category lines, but you can relax this) */
  const itemLineOptions: Option[] = useMemo(() => {
    return existingItemLines
      .filter(l => !l.isCategory) // invoice per item-line; tweak if needed
      .map(l => ({
        value: String(l.id),                 // we will send this to BE as item_line_id
        label: l.itemLine,
      }));
  }, [existingItemLines]);

  /** Preselect option if dialog was opened from a specific row */
  const defaultItemLineValue = useMemo(() => {
    const found = existingItemLines.find(l => l.itemLine === selectedItemLine);
    return found ? String(found.id) : "";
  }, [existingItemLines, selectedItemLine]);

  /** When the dialog is in "payment received" mode, we lazily load invoices to show in the dropdown */
  const [invoiceOptions, setInvoiceOptions] = useState<Option[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    const loadInvoicesIfNeeded = async () => {
      if (!isAddInvoicePaymentDialogOpen || actionType !== "invoice-paid") return;
      setLoadingInvoices(true);
      try {
        const resp = await fetchProjectInvoices(projectRef);
        // resp.data -> JSON:API; adapt if your shape differs
        const items = (resp?.data ?? []).map((d: any) => d.attributes);
        // Optional: narrow to selected item line if you opened from a row
        const itemLineIdFilter = existingItemLines.find(l => l.itemLine === selectedItemLine)?.id;
        const filtered = itemLineIdFilter
          ? items.filter((inv: any) => String(inv.item_line_id) === String(itemLineIdFilter))
          : items;

        setInvoiceOptions(
          filtered.map((inv: any) => ({
            value: inv.ref, // BE expects invoiceRef in the URL for payment creation
            label: inv.invoice_number ? `${inv.invoice_number} — ${inv.total_amount ?? inv.amount}` : inv.ref,
          }))
        );
      } finally {
        setLoadingInvoices(false);
      }
    };

    loadInvoicesIfNeeded();
  }, [isAddInvoicePaymentDialogOpen, actionType, projectRef, existingItemLines, selectedItemLine]);

  /**
   * Unified handler coming from the AddInvoicePaymentDialog.
   * - When type === "invoice", it expects a selected item_line_id (as string) and creates an invoice.
   * - When type === "invoice-paid", it expects a selected invoiceRef and creates a payment.
   */
  const handleAddInvoiceOrPayment = async (
    selectorValue: string,    // item_line_id (for invoice) OR invoiceRef (for payment)
    type: "invoice" | "invoice-paid" | "bill" | "bill-paid",
    amount: number,
    date: string,
    _file?: File
  ) => {
    if (type === "invoice") {
      const itemLineId = Number(selectorValue);
      if (!itemLineId || Number.isNaN(itemLineId)) return;

      await createInvoice(projectRef, {
        item_line_id: itemLineId,
        amount,
        issue_date: date || undefined, // optional
        // due_date: undefined,
        // tax_amount: undefined,
        // total_amount: undefined,
        // invoice_number: undefined,
        // status: undefined,
      });
    } else if (type === "invoice-paid") {
      const invoiceRef = selectorValue;
      if (!invoiceRef) return;

      await createPaymentForInvoice(projectRef, invoiceRef, {
        amount,
        payment_date: date || undefined,
        // payment_method, reference_number, notes are optional
      });
    } else {
      // Future: "bill" / "bill-paid" flows for costs. No-ops for now.
      return;
    }

    onCloseAddInvoicePaymentDialog();
    await onAfterMutation?.(); // refetch item lines so invoiced/paid totals update
    // Optional: still call the parent callback to keep old contract
    onSaveInvoicePayment?.(selectedItemLine, type as any, amount, date);
  };

  return (
    <>
      {/* Item line CRUD */}
      <ItemLineDialog
        isOpen={isItemLineDialogOpen}
        onClose={onCloseItemLineDialog}
        onSave={(payload) => onSaveItemLine(payload, editingItem)}
        existingItemLines={existingItemLines}
        editingItem={editingItem}
      />

      {/* Add invoice / Payment received */}
      {isAddInvoicePaymentDialogOpen && (
        <AddInvoicePaymentDialog
          isOpen={isAddInvoicePaymentDialogOpen}
          onClose={onCloseAddInvoicePaymentDialog}
          type={actionType}
          // For "invoice": provide item line options
          itemLineOptions={itemLineOptions}
          defaultItemLineValue={defaultItemLineValue}
          // For "invoice-paid": provide invoice options (lazy loaded)
          invoiceOptions={invoiceOptions}
          loadingInvoices={loadingInvoices}
          // One handler for both flows
          onSave={handleAddInvoiceOrPayment}
        />
      )}

      {/* History */}
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
