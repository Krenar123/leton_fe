
import { Supplier } from "@/types/supplier";
import { SupplierNotesDialog } from "./SupplierNotesDialog";
import { SupplierDocumentsDialog } from "./SupplierDocumentsDialog";
import { SupplierMeetingsDialog } from "./SupplierMeetingsDialog";
import { Dialog } from "@/components/ui/dialog";

interface SupplierDialogsProps {
  supplier: Supplier;
  isNotesDialogOpen: boolean;
  setIsNotesDialogOpen: (open: boolean) => void;
  isDocumentsDialogOpen: boolean;
  setIsDocumentsDialogOpen: (open: boolean) => void;
  isMeetingsDialogOpen: boolean;
  setIsMeetingsDialogOpen: (open: boolean) => void;
}

export const SupplierDialogs = ({
  supplier,
  isNotesDialogOpen,
  setIsNotesDialogOpen,
  isDocumentsDialogOpen,
  setIsDocumentsDialogOpen,
  isMeetingsDialogOpen,
  setIsMeetingsDialogOpen
}: SupplierDialogsProps) => {
  return (
    <>
      <SupplierNotesDialog
        supplier={supplier}
        isOpen={isNotesDialogOpen}
        onClose={() => setIsNotesDialogOpen(false)}
      />

      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <SupplierDocumentsDialog
          supplierName={supplier.company}
          onClose={() => setIsDocumentsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isMeetingsDialogOpen} onOpenChange={setIsMeetingsDialogOpen}>
        <SupplierMeetingsDialog
          supplierName={supplier.company}
          onClose={() => setIsMeetingsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
