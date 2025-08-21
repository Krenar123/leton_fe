
import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useProjectData } from "@/hooks/useProjectData";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { FinancialsPageContent } from "@/components/financials/FinancialsPageContent";

const FinancialsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { project } = useProjectData(id || "");
  const {
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
    // We need to access the dialog state controls
    isAddInvoicePaymentDialogOpen,
    setIsAddInvoicePaymentDialogOpen,
    selectedItemLine,
    setSelectedItemLine,
    actionType,
    setActionType,
  } = useFinancialsData();

  // Handle quick actions from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.openDialog === 'addInvoicePayment' && state?.actionType) {
      // For quick actions, we'll use the first item line or create a default one
      const firstItemLine = estimatesActualsData[0]?.itemLine || "Quick Action";
      setSelectedItemLine(firstItemLine);
      setActionType(state.actionType);
      setIsAddInvoicePaymentDialogOpen(true);
      
      // Clear the state to prevent reopening
      window.history.replaceState({}, document.title);
    }
  }, [location.state, estimatesActualsData, setSelectedItemLine, setActionType, setIsAddInvoicePaymentDialogOpen]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <FinancialsPageContent
      projectRef={project.ref}
      estimatesActualsData={estimatesActualsData}
      documents={documents}
      tableSettings={tableSettings}
      onTableSettingsChange={setTableSettings}
      onAddItemLine={handleAddItemLine}
      onAddInvoicePayment={handleAddInvoicePayment}
      onItemLineAction={handleItemLineAction}
      getDocumentsForItemLine={getDocumentsForItemLine}
      onDeleteDocument={handleDeleteDocument}
      onRenameDocument={handleRenameDocument}
    />
  );
};

export default FinancialsPage;
