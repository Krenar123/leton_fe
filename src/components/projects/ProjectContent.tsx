
import { useNavigate } from "react-router-dom";
import { ActionPlanCard } from "./ActionPlanCard";
import { MiddleColumnCards } from "./MiddleColumnCards";
import { FinancialsCard } from "./FinancialsCard";
import { Project, ActionItem } from "@/types/project";

interface ProjectContentProps {
  project: Project;
  actionItems: ActionItem[];
  hasNewBackstops: boolean;
  hasNewNotes: boolean;
  hasNewDocuments: boolean;
  hasNewContacts: boolean;
  viewedNotes: boolean;
  viewedDocuments: boolean;
  viewedContacts: boolean;
  onBackstopsClick: () => void;
  onMeetingsClick: () => void;
  onNotesClick: () => void;
  onDocumentsClick: () => void;
  onContactsClick: () => void;
}

export const ProjectContent = ({
  project,
  actionItems,
  hasNewBackstops,
  hasNewNotes,
  hasNewDocuments,
  hasNewContacts,
  viewedNotes,
  viewedDocuments,
  viewedContacts,
  onBackstopsClick,
  onMeetingsClick,
  onNotesClick,
  onDocumentsClick,
  onContactsClick
}: ProjectContentProps) => {
  const navigate = useNavigate();

  const handleActionPlanClick = () => {
    navigate(`/projects/${project.id}/action-plan`);
  };

  const handleFinancialsClick = () => {
    navigate(`/projects/${project.id}/financials`);
  };

  // Mock data
  const completedObjectives = 2;
  const totalObjectives = 5;
  const reachedBackstops = 2;
  const newDocumentsCount = 2;
  const totalDocumentsCount = 12;
  const newContactsCount = 2;
  const totalContactsCount = 8;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Action Plan (Left Column) */}
      <ActionPlanCard
        actionItems={actionItems}
        completedObjectives={completedObjectives}
        totalObjectives={totalObjectives}
        onClick={handleActionPlanClick}
      />

      {/* Middle Column - Cards */}
      <MiddleColumnCards
        hasNewBackstops={hasNewBackstops}
        reachedBackstops={reachedBackstops}
        hasNewNotes={hasNewNotes}
        viewedNotes={viewedNotes}
        hasNewDocuments={hasNewDocuments}
        viewedDocuments={viewedDocuments}
        newDocumentsCount={newDocumentsCount}
        totalDocumentsCount={totalDocumentsCount}
        hasNewContacts={hasNewContacts}
        viewedContacts={viewedContacts}
        newContactsCount={newContactsCount}
        totalContactsCount={totalContactsCount}
        onBackstopsClick={onBackstopsClick}
        onMeetingsClick={onMeetingsClick}
        onNotesClick={onNotesClick}
        onDocumentsClick={onDocumentsClick}
        onContactsClick={onContactsClick}
      />

      {/* Financials (Right Column) */}
      <FinancialsCard
        project={project}
        onClick={handleFinancialsClick}
      />
    </div>
  );
};
