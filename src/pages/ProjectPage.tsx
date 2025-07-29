import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectDialogs } from "@/components/projects/ProjectDialogs";
import { ProjectContent } from "@/components/projects/ProjectContent";
import { useProjectData } from "@/hooks/useProjectData";
import { useProjectDialogs } from "@/hooks/useProjectDialogs";
const ProjectPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    project,
    actionItems,
    handleProjectUpdate
  } = useProjectData(id || "");
  const {
    isProjectDialogOpen,
    setIsProjectDialogOpen,
    isBackstopsDialogOpen,
    setIsBackstopsDialogOpen,
    isMeetingsDialogOpen,
    setIsMeetingsDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    isDocumentsDialogOpen,
    setIsDocumentsDialogOpen,
    isContactsDialogOpen,
    setIsContactsDialogOpen,
    hasNewBackstops,
    hasNewNotes,
    hasNewDocuments,
    hasNewContacts,
    viewedNotes,
    viewedDocuments,
    viewedContacts,
    handleNotesCardClick,
    handleDocumentsCardClick,
    handleBackstopsCardClick,
    handleMeetingsCardClick,
    handleContactsCardClick
  } = useProjectDialogs();

  // Handle quick actions from navigation state
  useEffect(() => {
    const state = location.state as any;
    if (state?.openDialog) {
      switch (state.openDialog) {
        case 'notes':
          setIsNotesDialogOpen(true);
          break;
        case 'documents':
          setIsDocumentsDialogOpen(true);
          break;
      }

      // Clear the state to prevent reopening
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setIsNotesDialogOpen, setIsDocumentsDialogOpen]);
  if (!project) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>;
  }
  return <div className="space-y-6 min-h-screen pb-8 py-[16px] px-[16px]">
      {/* Project Information Header */}
      <ProjectHeader project={project} isProjectDialogOpen={isProjectDialogOpen} setIsProjectDialogOpen={setIsProjectDialogOpen} onProjectUpdate={handleProjectUpdate} />

      {/* Dialogs */}
      <ProjectDialogs project={project} isBackstopsDialogOpen={isBackstopsDialogOpen} setIsBackstopsDialogOpen={setIsBackstopsDialogOpen} isMeetingsDialogOpen={isMeetingsDialogOpen} setIsMeetingsDialogOpen={setIsMeetingsDialogOpen} isNotesDialogOpen={isNotesDialogOpen} setIsNotesDialogOpen={setIsNotesDialogOpen} isDocumentsDialogOpen={isDocumentsDialogOpen} setIsDocumentsDialogOpen={setIsDocumentsDialogOpen} isContactsDialogOpen={isContactsDialogOpen} setIsContactsDialogOpen={setIsContactsDialogOpen} />

      {/* Main Content Grid */}
      <ProjectContent project={project} actionItems={actionItems} hasNewBackstops={hasNewBackstops} hasNewNotes={hasNewNotes} hasNewDocuments={hasNewDocuments} hasNewContacts={hasNewContacts} viewedNotes={viewedNotes} viewedDocuments={viewedDocuments} viewedContacts={viewedContacts} onBackstopsClick={handleBackstopsCardClick} onMeetingsClick={handleMeetingsCardClick} onNotesClick={handleNotesCardClick} onDocumentsClick={handleDocumentsCardClick} onContactsClick={handleContactsCardClick} />
    </div>;
};
export default ProjectPage;