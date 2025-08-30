import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTableSettings } from "./useTableSettings";
import { useDocumentsData } from "./useDocumentsData";
import {
  useGetItemLines,
  useCreateItemLine,
  useUpdateItemLine,
  useDeleteItemLine,
  useCompleteItemLine,
} from "@/hooks/queries/itemLines";
import { createInvoice, createPaymentForInvoice, fetchProjectInvoices, fetchProjectBills, createBill, createPaymentForBill} from "@/services/api";
import { EstimateActualItem } from "@/types/financials";

/** ensure safe number or undefined */
const toNum = (v: any): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** dates → yyyy-mm-dd (string) or undefined */
const toYMD = (d?: string | Date | null): string | undefined => {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return undefined;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Convert FE dialog payload to API data; ensures depends_on is an integer (or null),
 * forwards supplier_ref when present, and normalizes dates.
 */
const normalizeForApi = (newItem: any) => {
  const dependsInt =
    newItem.depends_on && newItem.depends_on !== "none"
      ? Number(newItem.depends_on)
      : undefined;

  return {
    // naming compatibility
    item_line: newItem.item_line ?? newItem.itemLine,
    // vendor as string (free-typed) if no supplier_ref
    contractor: newItem.contractor ?? newItem.vendor ?? null,
    // selected existing supplier
    supplier_id: newItem.supplier_ref ?? null,

    // hierarchy
    parent_id:
      newItem.parent_id ??
      newItem.parentId ??
      newItem.selectedLevel1 ??
      newItem.selectedLevel2 ??
      newItem.selectedLevel3 ??
      null,
    level: newItem.level ?? undefined,
    cost_code: newItem.cost_code ?? newItem.costCode ?? undefined,
    parent_cost_code:
      newItem.parent_cost_code ?? newItem.parentCostCode ?? undefined,

    // money
    unit: newItem.unit ?? null,
    quantity:
      newItem.quantity !== undefined && newItem.quantity !== null
        ? Number(newItem.quantity)
        : null,
    unit_price:
      newItem.unit_price !== undefined && newItem.unit_price !== null
        ? Number(newItem.unit_price)
        : null,
    estimated_cost:
      newItem.estimated_cost !== undefined && newItem.estimated_cost !== null
        ? Number(newItem.estimated_cost)
        : null,
    estimated_revenue:
      newItem.estimated_revenue !== undefined &&
      newItem.estimated_revenue !== null
        ? Number(newItem.estimated_revenue)
        : null,

    // dates (yyyy-mm-dd)
    start_date: toYMD(newItem.start_date ?? newItem.startDate) ?? null,
    due_date: toYMD(newItem.due_date ?? newItem.dueDate) ?? null,

    // relations / status
    depends_on_id: dependsInt,
    status: newItem.status ?? "not_started",

    // passthrough for server-side level calc (if your controller uses it)
    actionType: newItem.actionType,
    selectedLevel1: newItem.selectedLevel1,
    selectedLevel2: newItem.selectedLevel2,
    selectedLevel3: newItem.selectedLevel3,
  };
};

export const useFinancialsData = () => {
  const { id: projectId } = useParams();
  const { tableSettings, setTableSettings } = useTableSettings();

  const { data: rawItemLines = [], refetch } = useGetItemLines(projectId || "");

  // API → UI flat mapping for the table
  const estimatesActualsData: EstimateActualItem[] = rawItemLines.map((item: any) => {
    const attr = item.attributes;
    return {
      id: item.id,
      ref: attr.ref,
      costCode: attr.cost_code,
      itemLine: attr.item_line,
      contractor: attr.contractor,
      estimatedCost: toNum(attr.estimated_cost) ?? 0,
      estimatedRevenue: toNum(attr.estimated_revenue) ?? 0,
      startDate: attr.start_date,
      dueDate: attr.due_date,
      dependsOn:
        typeof attr.depends_on === "number"
          ? attr.depends_on
          : toNum(attr.depends_on),
      status: attr.status,
      level: attr.level,
      quantity: toNum(attr.quantity) ?? 0,
      unitPrice: toNum(attr.unit_price) ?? 0,
      actualCost: toNum(attr.actual_cost) ?? 0,
      paid: toNum(attr.paid) ?? 0,
      invoiced: toNum(attr.invoiced) ?? 0,
      billed: toNum(attr.billed) ?? 0,
      payments: toNum(attr.payments) ?? 0,
      unit: attr.unit,
      parentId: attr.parent_id,
      isCategory: attr.level === 1 || attr.level === 2,
      // optional convenience for searching vendor text
      vendor: attr.contractor ?? undefined,
    };
  });

  // Mutations with automatic refetch
  const createMutation = useCreateItemLine(projectId || "", {
    onSuccess: () => refetch(),
  });
  const updateMutation = useUpdateItemLine(projectId || "", {
    onSuccess: () => refetch(),
  });
  const deleteMutation = useDeleteItemLine(projectId || "", {
    onSuccess: () => refetch(),
  });
  const completeMutation = useCompleteItemLine(projectId || "", {
    onSuccess: () => refetch(),
  });

  // Called by FinancialsDialogs -> ItemLineDialog.onSave
  const handleAddItemLine = async (newItem: any, editingItem?: any) => {
    const payload = normalizeForApi(newItem);

    if (editingItem?.ref) {
      await updateMutation.mutateAsync({ ref: editingItem.ref, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  // Row actions
  const handleItemLineAction = (itemLine: string, action: string) => {
    const item = estimatesActualsData.find((i) => i.itemLine === itemLine);
    if (!item) return null;

    if (action === "delete" && item.ref) {
      deleteMutation.mutate(item.ref);
    } else if (action === "complete" && item.ref) {
      completeMutation.mutate(item.ref);
    } else if (action === "edit") {
      return item;
    }
    return null;
  };

  // Invoice/Docs hooks (unchanged)
  const [isAddInvoicePaymentDialogOpen, setIsAddInvoicePaymentDialogOpen] = useState(false);
  const [selectedItemLine, setSelectedItemLine] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");

  const {
    documents,
    handleDeleteDocument,
    handleRenameDocument,
    getDocumentsForItemLine,
    addDocument,
  } = useDocumentsData();

  const handleAddInvoicePayment = () => {
    // future implementation
  };

  // ---- INVOICES & PAYMENTS ----

  // Create a new invoice for an item line, then refetch item lines so "invoiced/paid" columns update
  const addInvoice = async (opts: {
    projectRef: string;
    item_line_id: number;
    amount: number;
    issue_date?: string; // yyyy-mm-dd
    due_date?: string;   // yyyy-mm-dd
    tax_amount?: number;
    total_amount?: number;
    invoice_number?: string;
    status?: string;
  }) => {
    await createInvoice(opts.projectRef, {
      item_line_id: opts.item_line_id,
      amount: opts.amount,
      issue_date: opts.issue_date,
      due_date: opts.due_date,
      tax_amount: opts.tax_amount,
      total_amount: opts.total_amount,
      invoice_number: opts.invoice_number,
      status: opts.status,
    });
    await refetch(); // refresh invoiced/paid on item lines
  };

  // somewhere in your data hooks / services
  const loadProjectInvoices = async (projectRef: string) => {
    const res = await fetchProjectInvoices(projectRef);

    // allow either raw array or {data:[...]} (JSON:API-ish)
    const rows = Array.isArray(res) ? res : (res?.data ?? []);

    const list = rows.map((row: any) => {
      // support both flat and attributes
      const r = row.attributes ?? row;

      // the invoice reference MUST come from the invoice row, not the project
      const invoiceRef = r.ref ?? row.ref; // prefer attributes.ref if present

      // item_line_id: some serializers nest it under item_line
      const itemLineId =
        r.item_line_id ??
        r.item_line?.id ??
        row.item_line_id ??
        row.item_line?.id ??
        null;

      // numeric helpers
      const toNum = (v: any) => (Number.isFinite(Number(v)) ? Number(v) : undefined);

      const amount = toNum(r.amount);
      const total = toNum(r.total_amount) ?? amount;
      const paidTotal = toNum(r.paid_total) ?? 0;

      // try to use server-provided outstanding; otherwise derive it
      const outstanding =
        toNum(r.outstanding) ?? (typeof total === "number" ? total - paidTotal : undefined);

      return {
        id: row.id ?? r.id,
        ref: String(invoiceRef),                     // ← THIS must be the invoice ref
        invoice_number: r.invoice_number ?? null,
        amount: amount ?? 0,
        total_amount: total ?? 0,
        outstanding,
        item_line_id: itemLineId ? Number(itemLineId) : undefined,
      };
    });

    return list;
  };


  // Record a payment against an invoice (by invoice ref in the URL), then refetch item lines
  const addPayment = async (projectRef: string, invoiceRef: string, data: {
    amount: number;
    payment_date?: string;       // yyyy-mm-dd
    payment_method?: string;
    reference_number?: string;
    notes?: string;
  }) => {
    await createPaymentForInvoice(projectRef, invoiceRef, data);
    await refetch(); // refresh invoiced/paid on item lines
  };

  const addBill = async (opts: {
    projectRef: string;
    item_line_id: number;
    amount: number;
    issue_date?: string; // yyyy-mm-dd
    due_date?: string;   // yyyy-mm-dd
    tax_amount?: number;
    total_amount?: number;
    bill_number?: string;
    status?: string;
  }) => {
    await createBill(opts.projectRef, {
      item_line_id: opts.item_line_id,
      amount: opts.amount,
      issue_date: opts.issue_date,
      due_date: opts.due_date,
      tax_amount: opts.tax_amount,
      total_amount: opts.total_amount,
      bill_number: opts.bill_number,
      status: opts.status,
    });
    await refetch(); // refresh invoiced/paid on item lines
  };

  const loadProjectBills = async (projectRef: string) => {
    const res = await fetchProjectBills(projectRef);
    const arr = Array.isArray(res) ? res : (res?.data || []);
    return arr.map((row: any) => ({
      ref: row.ref ?? row.attributes?.ref,
      bill_number: row.bill_number ?? row.attributes?.bill_number,
      amount: Number(row.amount ?? row.attributes?.amount) || 0,
      total_amount: Number(row.total_amount ?? row.attributes?.total_amount) || 0,
      outstanding: Number(row.outstanding ?? row.attributes?.outstanding) || 0,
      item_line_id: row.item_line?.id ?? row.attributes?.item_line_id,
    }));
  };

  const addBillPayment = async (projectRef: string, billRef: string, data: {
    amount: number;
    payment_date?: string;       // yyyy-mm-dd
    payment_method?: string;
    reference_number?: string;
    notes?: string;
  }) => {
    await createPaymentForBill(projectRef, billRef, data);
    await refetch(); // refresh invoiced/paid on item lines
  };

  return {
    tableSettings,
    setTableSettings,
    estimatesActualsData,
    documents,
    handleAddItemLine,
    handleAddInvoicePayment,
    handleItemLineAction,
    handleDeleteDocument,
    handleRenameDocument,
    getDocumentsForItemLine,
    isAddInvoicePaymentDialogOpen,
    setIsAddInvoicePaymentDialogOpen,
    selectedItemLine,
    setSelectedItemLine,
    actionType,
    setActionType,
    addInvoice,
    loadProjectInvoices,
    addPayment,
    refetch,
    addBill,
    loadProjectBills,
    addBillPayment,
  };
};
