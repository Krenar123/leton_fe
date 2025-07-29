
import { Dialog } from "@/components/ui/dialog";
import { SupplierEditDialog } from "./SupplierEditDialog";
import { SupplierDialogs } from "./SupplierDialogs";
import { Supplier } from "@/types/supplier";

interface SupplierDialogManagerProps {
  supplier: Supplier;
  isSupplierDialogOpen: boolean;
  setIsSupplierDialogOpen: (open: boolean) => void;
  isNotesDialogOpen: boolean;
  setIsNotesDialogOpen: (open: boolean) => void;
  isDocumentsDialogOpen: boolean;
  setIsDocumentsDialogOpen: (open: boolean) => void;
  isMeetingsDialogOpen: boolean;
  setIsMeetingsDialogOpen: (open: boolean) => void;
  onSupplierUpdate: (supplier: Supplier) => void;
}

export const SupplierDialogManager = ({
  supplier,
  isSupplierDialogOpen,
  setIsSupplierDialogOpen,
  isNotesDialogOpen,
  setIsNotesDialogOpen,
  isDocumentsDialogOpen,
  setIsDocumentsDialogOpen,
  isMeetingsDialogOpen,
  setIsMeetingsDialogOpen,
  onSupplierUpdate
}: SupplierDialogManagerProps) => {
  return (
    <>
      {/* Edit Supplier Dialog */}
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <SupplierEditDialog 
          supplier={supplier}
          onClose={() => setIsSupplierDialogOpen(false)}
          onUpdate={onSupplierUpdate}
        />
      </Dialog>

      {/* Other Dialogs */}
      <SupplierDialogs
        supplier={supplier}
        isNotesDialogOpen={isNotesDialogOpen}
        setIsNotesDialogOpen={setIsNotesDialogOpen}
        isDocumentsDialogOpen={isDocumentsDialogOpen}
        setIsDocumentsDialogOpen={setIsDocumentsDialogOpen}
        isMeetingsDialogOpen={isMeetingsDialogOpen}
        setIsMeetingsDialogOpen={setIsMeetingsDialogOpen}
      />
    </>
  );
};
