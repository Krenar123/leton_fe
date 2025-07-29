
import { useState } from "react";
import { useTableSettings } from "./useTableSettings";
import { useDocumentsData } from "./useDocumentsData";
import { useEstimatesActualsData } from "./useEstimatesActualsData";

export const useFinancialsData = () => {
  const [isAddInvoicePaymentDialogOpen, setIsAddInvoicePaymentDialogOpen] = useState(false);
  const [selectedItemLine, setSelectedItemLine] = useState<string>("");
  const [actionType, setActionType] = useState<string>("");

  const { tableSettings, setTableSettings } = useTableSettings();
  const { 
    documents, 
    handleDeleteDocument, 
    handleRenameDocument, 
    getDocumentsForItemLine,
    addDocument 
  } = useDocumentsData();
  const { 
    estimatesActualsData, 
    handleAddItemLine, 
    handleAddInvoicePayment, 
    handleItemLineAction 
  } = useEstimatesActualsData(addDocument);

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
