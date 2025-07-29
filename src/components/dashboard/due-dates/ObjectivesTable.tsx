
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ParticipantsDisplay } from "@/components/action-plan/ParticipantsDisplay";
import { StatusIcon } from "@/components/action-plan/StatusIcon";
import { ProjectObjective, ColumnVisibility } from "./types";

interface ObjectivesTableProps {
  objectives: ProjectObjective[];
  columnVisibility: ColumnVisibility;
  onObjectiveClick: (projectId: number) => void;
}

export const ObjectivesTable = ({
  objectives,
  columnVisibility,
  onObjectiveClick
}: ObjectivesTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Sort objectives by due date (earliest first)
  const sortedObjectives = [...objectives].sort((a, b) => 
    new Date(a.due).getTime() - new Date(b.due).getTime()
  );

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Objective Field</TableHead>
            {columnVisibility.projectName && <TableHead className="font-semibold">Project</TableHead>}
            {columnVisibility.start && <TableHead className="font-semibold">Start</TableHead>}
            {columnVisibility.due && <TableHead className="font-semibold">Due</TableHead>}
            {columnVisibility.participants && <TableHead className="font-semibold">Participants</TableHead>}
            {columnVisibility.status && <TableHead className="font-semibold">Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedObjectives.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No objectives found matching your filters
              </TableCell>
            </TableRow>
          ) : (
            sortedObjectives.map((objective) => (
              <TableRow 
                key={objective.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => onObjectiveClick(objective.projectId)}
              >
                <TableCell className="font-medium text-blue-600 hover:text-blue-800">
                  {objective.field}
                </TableCell>
                {columnVisibility.projectName && <TableCell>{objective.projectName}</TableCell>}
                {columnVisibility.start && <TableCell>{formatDate(objective.start)}</TableCell>}
                {columnVisibility.due && <TableCell className="font-bold">{formatDate(objective.due)}</TableCell>}
                {columnVisibility.participants && (
                  <TableCell>
                    <ParticipantsDisplay participants={objective.participants} />
                  </TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell>
                    <StatusIcon status={objective.status} />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
