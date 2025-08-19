
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ListHeader } from "@/components/common/ListHeader";
import { ObjectivesTable } from "@/components/action-plan/ObjectivesTable";
import { Objective } from "@/types/objective";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TeamMemberObjectivesProps {
  objectives: {
    completed: number;
    total: number;
    data: Objective[];
  };
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onObjectiveSelect: (objectiveId: string) => void;
  onEdit: (objective: Objective) => void;
  onDelete: (objectiveId: string) => void;
  onStatusChange: (objectiveId: string, status: Objective['status']) => void;
  selectedObjectiveId: string | null;
}

interface ColumnVisibility {
  start: boolean;
  due: boolean;
  participants: boolean;
  status: boolean;
}

export const TeamMemberObjectives = ({
  objectives,
  searchTerm,
  onSearchChange,
  onObjectiveSelect,
  onEdit,
  onDelete,
  onStatusChange,
  selectedObjectiveId
}: TeamMemberObjectivesProps) => {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    start: true,
    due: true,
    participants: true,
    status: true,
  });

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const settingsContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Columns</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="start"
              checked={columnVisibility.start}
              onCheckedChange={() => toggleColumn('start')}
            />
            <Label htmlFor="start" className="text-sm">Start Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="due"
              checked={columnVisibility.due}
              onCheckedChange={() => toggleColumn('due')}
            />
            <Label htmlFor="due" className="text-sm">Due Date</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="participants"
              checked={columnVisibility.participants}
              onCheckedChange={() => toggleColumn('participants')}
            />
            <Label htmlFor="participants" className="text-sm">Participants</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status"
              checked={columnVisibility.status}
              onCheckedChange={() => toggleColumn('status')}
            />
            <Label htmlFor="status" className="text-sm">Status</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const filterContent = (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filter by Status</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="planned" />
            <Label htmlFor="planned" className="text-sm">Planned</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="in-progress" />
            <Label htmlFor="in-progress" className="text-sm">In Progress</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="finished" />
            <Label htmlFor="finished" className="text-sm">Finished</Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <ListHeader
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          searchPlaceholder="Search objectives..."
          filterContent={filterContent}
          settingsContent={settingsContent}
        />
        <ObjectivesTable
          objectives={objectives.data}
          selectedObjectiveId={selectedObjectiveId}
          onObjectiveSelect={onObjectiveSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          columnVisibility={columnVisibility}
        />
      </CardContent>
    </Card>
  );
};
