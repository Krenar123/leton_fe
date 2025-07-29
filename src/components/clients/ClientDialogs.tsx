
import { Dialog } from "@/components/ui/dialog";
import { ClientNotesDialog } from "./ClientNotesDialog";
import { ClientDocumentsDialog } from "./ClientDocumentsDialog";
import { ClientMeetingsDialog } from "./ClientMeetingsDialog";
import { Client } from "@/types/client";

interface ClientDialogsProps {
  client: Client;
  isNotesDialogOpen: boolean;
  setIsNotesDialogOpen: (open: boolean) => void;
  isDocumentsDialogOpen: boolean;
  setIsDocumentsDialogOpen: (open: boolean) => void;
  isMeetingsDialogOpen: boolean;
  setIsMeetingsDialogOpen: (open: boolean) => void;
}

export const ClientDialogs = ({
  client,
  isNotesDialogOpen,
  setIsNotesDialogOpen,
  isDocumentsDialogOpen,
  setIsDocumentsDialogOpen,
  isMeetingsDialogOpen,
  setIsMeetingsDialogOpen
}: ClientDialogsProps) => {
  return (
    <>
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <ClientNotesDialog 
          clientName={client.name}
          onClose={() => setIsNotesDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <ClientDocumentsDialog 
          clientName={client.name}
          onClose={() => setIsDocumentsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isMeetingsDialogOpen} onOpenChange={setIsMeetingsDialogOpen}>
        <ClientMeetingsDialog 
          clientName={client.company}
          onClose={() => setIsMeetingsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
