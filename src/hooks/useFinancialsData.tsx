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

export const useFinancialsData = () => {
  const { id: projectId } = useParams();
  const { tableSettings, setTableSettings } = useTableSettings();

  const {
    data: rawItemLines = [],
    refetch,
  } = useGetItemLines(projectId || "");
  

  console.log(rawItemLines);

  // Flatten the item line data
  const estimatesActualsData = rawItemLines.map((item) => {
    const attr = item.attributes;
    return {
      id: item.id,
      ref: attr.ref,
      costCode: attr.cost_code, // you can change this to attr.cost_code if available
      itemLine: attr.item_line,
      contractor: attr.contractor,
      estimatedCost: Number(attr.estimated_cost),
      estimatedRevenue: Number(attr.estimated_revenue),
      startDate: attr.start_date,
      dueDate: attr.due_date,
      dependsOn: attr.depends_on,
      status: attr.status,
      level: attr.level,
      quantity: Number(attr.quantity),
      unitPrice: Number(attr.unit_price),
      actualCost: attr.actual_cost ? Number(attr.actual_cost) : 0,
      paid: attr.paid || 0,
      invoiced: attr.invoiced || 0,
      unit: attr.unit,
      parentId: attr.parent_id,
      isCategory: attr.level === 1 || attr.level === 2,
    };
  });
  
  console.log("estimates");
  console.log(estimatesActualsData);

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

  const handleAddItemLine = async (newItem: any, editingItem?: any) => {
    if (editingItem?.ref) {
      await updateMutation.mutateAsync({ ref: editingItem.ref, data: newItem });
    } else {
      await createMutation.mutateAsync(newItem);
    }
  };

  const handleItemLineAction = (itemLine: string, action: string) => {
    const item = estimatesActualsData.find(i => i.itemLine === itemLine);
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
  };
};
