
import { Dialog } from "@/components/ui/dialog";
import { BackstopsDialog } from "./BackstopsDialog";
import { MeetingsDialog } from "./MeetingsDialog";
import { NotesDialog } from "./NotesDialog";
import { DocumentsDialog } from "./DocumentsDialog";
import { ContactsDialog } from "./ContactsDialog";
import { Project } from "@/types/project";

interface ProjectDialogsProps {
  project: Project;
  isBackstopsDialogOpen: boolean;
  setIsBackstopsDialogOpen: (open: boolean) => void;
  isMeetingsDialogOpen: boolean;
  setIsMeetingsDialogOpen: (open: boolean) => void;
  isNotesDialogOpen: boolean;
  setIsNotesDialogOpen: (open: boolean) => void;
  isDocumentsDialogOpen: boolean;
  setIsDocumentsDialogOpen: (open: boolean) => void;
  isContactsDialogOpen: boolean;
  setIsContactsDialogOpen: (open: boolean) => void;
}

export const ProjectDialogs = ({
  project,
  isBackstopsDialogOpen,
  setIsBackstopsDialogOpen,
  isMeetingsDialogOpen,
  setIsMeetingsDialogOpen,
  isNotesDialogOpen,
  setIsNotesDialogOpen,
  isDocumentsDialogOpen,
  setIsDocumentsDialogOpen,
  isContactsDialogOpen,
  setIsContactsDialogOpen
}: ProjectDialogsProps) => {
  return (
    <>
      <Dialog open={isBackstopsDialogOpen} onOpenChange={setIsBackstopsDialogOpen}>
        <BackstopsDialog 
          projectName={project.name}
          onClose={() => setIsBackstopsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isMeetingsDialogOpen} onOpenChange={setIsMeetingsDialogOpen}>
        <MeetingsDialog 
          projectName={project.name}
          onClose={() => setIsMeetingsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <NotesDialog 
          projectName={project.name}
          onClose={() => setIsNotesDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DocumentsDialog 
          projectName={project.name}
          onClose={() => setIsDocumentsDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isContactsDialogOpen} onOpenChange={setIsContactsDialogOpen}>
        <ContactsDialog 
          projectName={project.name}
          onClose={() => setIsContactsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
