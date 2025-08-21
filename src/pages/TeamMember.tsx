// src/pages/TeamMember.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeamMemberProfile } from "@/components/team/TeamMemberProfile";
import { TeamMemberDetailsDialog } from "@/components/team/TeamMemberDetailsDialog";
import { TeamMemberObjectives } from "@/components/team/TeamMemberObjectives";
import { TeamMemberTasks } from "@/components/team/TeamMemberTasks";
import { TeamMemberMeetings } from "@/components/team/TeamMemberMeetings";
import { TeamMemberWagePayments } from "@/components/team/TeamMemberWagePayments";
import { TeamMemberDocumentsDialog } from "@/components/team/TeamMemberDocumentsDialog";
import { TeamMemberNotesDialog } from "@/components/team/TeamMemberNotesDialog";
import { TeamMemberReportSelectionDialog } from "@/components/team/TeamMemberReportSelectionDialog";
import { useTeamMemberData } from "@/hooks/useTeamMemberData";
import { format } from "date-fns";

const TeamMember = () => {
  const { id } = useParams(); // id = userRef
  const [objectivesSearch, setObjectivesSearch] = useState("");
  const [tasksSearch, setTasksSearch] = useState("");
  const [meetingsSearch, setMeetingsSearch] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const data = useTeamMemberData(id || "");

  if (!data.user) {
    return <div className="text-center py-12">Loading team member…</div>;
  }

  const currentMember = {
    id: data.user.ref,
    name: data.user.name,
    position: data.user.position,
    department: data.user.department,
    email: data.user.email,
    phone: data.user.phone,
    address: data.user.address,
    avatar: data.user.avatar,
    wagePerHour: undefined, // if you store this somewhere else
  };

  const nextMeeting = data.meetings.length > 0 ? data.meetings[0] : null;

  return (
    <div className="space-y-6">
      <TeamMemberProfile
        member={currentMember}
        onEditClick={() => setIsDetailsDialogOpen(true)}
        onDocumentsClick={() => setIsDocumentsDialogOpen(true)}
        onNotesClick={() => setIsNotesDialogOpen(true)}
        onCreateReportClick={() => setIsReportDialogOpen(true)}
      />

      {/* dialogs */}
      <TeamMemberDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        member={currentMember}
        onMemberUpdate={(updated) => data.updateUser({
          full_name: updated.name,
          phone: updated.phone,
          address: updated.address,
          position: updated.position,
          department: updated.department,
        })}
      />
      <TeamMemberDocumentsDialog
        isOpen={isDocumentsDialogOpen}
        onOpenChange={setIsDocumentsDialogOpen}
        memberName={currentMember.name}
      />
      <TeamMemberNotesDialog
        isOpen={isNotesDialogOpen}
        onOpenChange={setIsNotesDialogOpen}
        memberName={currentMember.name}
      />
      <TeamMemberReportSelectionDialog
        isOpen={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        memberName={currentMember.name}
      />

      <Tabs defaultValue="objectives" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-16">
          <TabsTrigger value="objectives" className="flex flex-col items-center justify-center gap-1 h-full">
            <span>Objectives</span>
            <span className="text-xs px-2 py-0.5 rounded-full border">
              {data.objectives.completed}/{data.objectives.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex flex-col items-center justify-center gap-1 h-full">
            <span>Tasks</span>
            <span className="text-xs px-2 py-0.5 rounded-full border">
              {data.tasks.completed}/{data.tasks.total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex flex-col items-center justify-center gap-1 h-full">
            <span>Meetings</span>
            {nextMeeting && (
              <span className="text-xs px-2 py-0.5 rounded-full border">
                {nextMeeting.person} - {format(new Date(nextMeeting.date), 'dd/MM')}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="wage-payments" className="flex flex-col items-center justify-center gap-1 h-full">
            <span>Wage / Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="objectives">
          <TeamMemberObjectives
            objectives={data.objectives}
            searchTerm={objectivesSearch}
            onSearchChange={setObjectivesSearch}
            onObjectiveSelect={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            onStatusChange={() => {}}
            selectedObjectiveId={null}
          />
        </TabsContent>

        <TabsContent value="tasks">
          <TeamMemberTasks
            tasks={data.tasks}
            searchTerm={tasksSearch}
            onSearchChange={setTasksSearch}
            onEdit={() => {}}
            onDelete={() => {}}
            onStatusChange={() => {}}
          />
        </TabsContent>

        <TabsContent value="meetings">
          <TeamMemberMeetings
            meetings={data.meetings}
            searchTerm={meetingsSearch}
            onSearchChange={setMeetingsSearch}
          />
        </TabsContent>

        <TabsContent value="wage-payments">
          <TeamMemberWagePayments memberId={currentMember.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamMember;
