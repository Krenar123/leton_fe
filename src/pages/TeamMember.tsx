import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
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
import { Objective, Task } from "@/types/strategy";
import { format } from "date-fns";

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "Project Manager",
    department: "Management",
    email: "john.smith@company.com",
    phone: "+1 234 567 8901",
    address: "123 Main St, New York, NY 10001",
    avatar: "JS",
    wagePerHour: 55
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Engineer",
    department: "Engineering",
    email: "sarah.johnson@company.com",
    phone: "+1 234 567 8902",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    avatar: "SJ"
  },
  {
    id: 3,
    name: "Mike Davis",
    position: "Construction Manager",
    department: "Construction",
    email: "mike.davis@company.com",
    phone: "+1 234 567 8903",
    address: "789 Pine Rd, Chicago, IL 60601",
    avatar: "MD"
  },
  {
    id: 4,
    name: "Lisa Chen",
    position: "Architect",
    department: "Design",
    email: "lisa.chen@company.com",
    phone: "+1 234 567 8904",
    address: "321 Elm St, Miami, FL 33101",
    avatar: "LC"
  },
  {
    id: 5,
    name: "Robert Wilson",
    position: "Site Supervisor",
    department: "Construction",
    email: "robert.wilson@company.com",
    phone: "+1 234 567 8905",
    address: "654 Maple Dr, Seattle, WA 98101",
    avatar: "RW"
  },
  {
    id: 6,
    name: "Emily Brown",
    position: "Quality Inspector",
    department: "Quality Assurance",
    email: "emily.brown@company.com",
    phone: "+1 234 567 8906",
    address: "987 Cedar Ln, Boston, MA 02101",
    avatar: "EB"
  }
];

const TeamMember = () => {
  const { id } = useParams();
  const [objectivesSearch, setObjectivesSearch] = useState("");
  const [tasksSearch, setTasksSearch] = useState("");
  const [meetingsSearch, setMeetingsSearch] = useState("");
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(() => 
    teamMembers.find(m => m.id === parseInt(id || "")) || teamMembers[0]
  );
  
  const data = useTeamMemberData(currentMember.id);

  if (!currentMember) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Team member not found</h3>
      </div>
    );
  }

  const handleMemberUpdate = (updatedMember: typeof currentMember) => {
    setCurrentMember(updatedMember);
  };

  const handleObjectiveSelect = (objectiveId: string) => {
    // Handle objective selection
  };

  const handleObjectiveEdit = (objective: Objective) => {
    // Handle objective edit
  };

  const handleObjectiveDelete = (objectiveId: string) => {
    // Handle objective delete
  };

  const handleObjectiveStatusChange = (objectiveId: string, status: Objective['status']) => {
    // Handle objective status change
  };

  const handleTaskEdit = (task: Task) => {
    // Handle task edit
  };

  const handleTaskDelete = (taskId: string) => {
    // Handle task delete
  };

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    // Handle task status change
  };

  // Get next meeting
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

      <TeamMemberDetailsDialog
        isOpen={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        member={currentMember}
        onMemberUpdate={handleMemberUpdate}
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

        <TabsContent value="objectives" className="space-y-4">
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

        <TabsContent value="tasks" className="space-y-4">
          <TeamMemberTasks
            tasks={data.tasks}
            searchTerm={tasksSearch}
            onSearchChange={setTasksSearch}
            onEdit={() => {}}
            onDelete={() => {}}
            onStatusChange={() => {}}
          />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <TeamMemberMeetings
            meetings={data.meetings}
            searchTerm={meetingsSearch}
            onSearchChange={setMeetingsSearch}
          />
        </TabsContent>

        <TabsContent value="wage-payments" className="space-y-4">
          <TeamMemberWagePayments memberId={currentMember.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamMember;
