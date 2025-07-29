
import { useParams, useNavigate } from "react-router-dom";
import { SupplierHeader } from "@/components/suppliers/SupplierHeader";
import { SupplierContent } from "@/components/suppliers/SupplierContent";
import { SupplierDetailsHeader } from "@/components/suppliers/SupplierDetailsHeader";
import { SupplierNotFoundMessage } from "@/components/suppliers/SupplierNotFoundMessage";
import { SupplierDetailsLayout } from "@/components/suppliers/SupplierDetailsLayout";
import { SupplierDialogManager } from "@/components/suppliers/SupplierDialogManager";
import { useSupplierData } from "@/hooks/useSupplierData";
import { useSupplierDialogs } from "@/hooks/useSupplierDialogs";

const SupplierPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { supplier, projects, invoices, bills, meetings, handleSupplierUpdate } = useSupplierData(id || "");
  const {
    isSupplierDialogOpen,
    setIsSupplierDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    isDocumentsDialogOpen,
    setIsDocumentsDialogOpen,
    isMeetingsDialogOpen,
    setIsMeetingsDialogOpen,
    hasNewNotes,
    viewedNotes,
    handleNotesCardClick,
    handleDocumentsClick,
    handleMeetingsClick
  } = useSupplierDialogs();

  const handleBack = () => {
    navigate(-1);
  };

  if (!supplier) {
    return (
      <SupplierDetailsLayout>
        <SupplierNotFoundMessage onBack={handleBack} />
      </SupplierDetailsLayout>
    );
  }

  return (
    <SupplierDetailsLayout>
      <SupplierDetailsHeader onBack={handleBack} />

      <SupplierHeader
        supplier={supplier}
        isSupplierDialogOpen={isSupplierDialogOpen}
        setIsSupplierDialogOpen={setIsSupplierDialogOpen}
        onSupplierUpdate={handleSupplierUpdate}
        onNotesClick={handleNotesCardClick}
        onDocumentsClick={handleDocumentsClick}
        onMeetingsClick={handleMeetingsClick}
      />

      <SupplierDialogManager
        supplier={supplier}
        isSupplierDialogOpen={isSupplierDialogOpen}
        setIsSupplierDialogOpen={setIsSupplierDialogOpen}
        isNotesDialogOpen={isNotesDialogOpen}
        setIsNotesDialogOpen={setIsNotesDialogOpen}
        isDocumentsDialogOpen={isDocumentsDialogOpen}
        setIsDocumentsDialogOpen={setIsDocumentsDialogOpen}
        isMeetingsDialogOpen={isMeetingsDialogOpen}
        setIsMeetingsDialogOpen={setIsMeetingsDialogOpen}
        onSupplierUpdate={handleSupplierUpdate}
      />

      <SupplierContent
        supplier={supplier}
        projects={projects}
        invoices={invoices}
        bills={bills}
        meetings={meetings}
        hasNewNotes={hasNewNotes}
        viewedNotes={viewedNotes}
        onNotesClick={handleNotesCardClick}
        onContactClick={() => setIsSupplierDialogOpen(true)}
      />
    </SupplierDetailsLayout>
  );
};

export default SupplierPage;
