
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Objective } from "@/types/objective";
import { StatusIcon } from "./StatusIcon";
import { ObjectiveActions } from "./ObjectiveActions";
import { ParticipantsDisplay } from "./ParticipantsDisplay";
import { format } from "date-fns";

interface ColumnVisibility {
  start_date?: boolean;
  end_date?: boolean;
  participants?: boolean;
  status?: boolean;
}

interface ObjectivesTableProps {
  objectives: Objective[];
  selectedObjectiveId: string | null;
  onObjectiveSelect: (id: string) => void;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Objective['status']) => void;
  columnVisibility?: ColumnVisibility;
}

export const ObjectivesTable = ({
  objectives,
  selectedObjectiveId,
  onObjectiveSelect,
  onEdit,
  onDelete,
  onStatusChange,
  columnVisibility = { start_date: true, end_date: true, participants: true, status: true }
}: ObjectivesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Field</TableHead>
          {columnVisibility.start_date && <TableHead>Start</TableHead>}
          {columnVisibility.end_date && <TableHead className="font-bold">Due</TableHead>}
          {columnVisibility.participants && <TableHead>Participants</TableHead>}
          {columnVisibility.status && <TableHead>Status</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {objectives
          .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
          .map((objective) => (
            <TableRow
              key={objective.ref}
              className={`cursor-pointer ${
                selectedObjectiveId === objective.ref
                  ? 'bg-blue-600 text-white hover:bg-blue-600'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onObjectiveSelect(objective.ref)}
            >
              <TableCell className="font-medium">{objective.title}</TableCell>
              {columnVisibility.start_date && (
                <TableCell>
                  {objective.start_date && !isNaN(new Date(objective.start_date).getTime())
                    ? format(new Date(objective.start_date), 'dd/MM/yyyy')
                    : '—'}
                </TableCell>
              )}

              {columnVisibility.end_date && (
                <TableCell className="font-bold">
                  {objective.end_date && !isNaN(new Date(objective.end_date).getTime())
                    ? format(new Date(objective.end_date), 'dd/MM/yyyy')
                    : '—'}
                </TableCell>
              )}
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
              <TableCell>
                <ObjectiveActions
                  objective={objective}
                  onEdit={onEdit}
                  onDelete={() => onDelete(objective.ref)} 
                  onStatusChange={onStatusChange}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
