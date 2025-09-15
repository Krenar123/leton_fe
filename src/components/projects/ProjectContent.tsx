
import { useNavigate } from "react-router-dom";
import { ActionPlanCard } from "./ActionPlanCard";
import { MiddleColumnCards } from "./MiddleColumnCards";
import { FinancialsCard } from "./FinancialsCard";
import { Project, ActionItem } from "@/types/project";

interface ProjectContentProps {
  project: Project;
  actionItems: ActionItem[];
  meetings: any[];
  documents: any[];
  notes: any[];
  contacts: any[];
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
  meetings,
  documents,
  notes,
  contacts,
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
    navigate(`/projects/${project.ref}/action-plan`);
  };

  const handleFinancialsClick = () => {
    navigate(`/projects/${project.ref}/financials`);
  };

  // Calculate dynamic data
  const completedObjectives = actionItems.filter(item => item.completed).length;
  const totalObjectives = actionItems.length;
  
  // Calculate backstops (objectives that are overdue or at risk)
  const now = new Date();
  const reachedBackstops = actionItems.filter(item => {
    const endDate = new Date(item.endDate);
    const isOverdue = endDate < now && !item.completed;
    // For ActionItem, we don't have priority, so we'll use a simple overdue check
    return isOverdue;
  }).length;

  // Calculate documents data
  const newDocumentsCount = documents.filter(doc => doc.is_new).length;
  const totalDocumentsCount = documents.length;

  // Calculate notes data - consider notes created in last 24 hours as "new"
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const newNotesCount = notes.filter(note => {
    const noteDate = new Date(note.created_at);
    return noteDate > twentyFourHoursAgo;
  }).length;
  const totalNotesCount = notes.length;

  // Calculate contacts data
  const newContactsCount = contacts.filter(contact => contact.is_new).length;
  const totalContactsCount = contacts.length;

  // Get upcoming meetings (next 2 meetings)
  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.start_at) >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .slice(0, 2);

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
        upcomingMeetings={upcomingMeetings}
        hasNewNotes={hasNewNotes}
        viewedNotes={viewedNotes}
        newNotesCount={newNotesCount}
        totalNotesCount={totalNotesCount}
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
        project={project as any}
        onClick={handleFinancialsClick}
      />
    </div>
  );
};
