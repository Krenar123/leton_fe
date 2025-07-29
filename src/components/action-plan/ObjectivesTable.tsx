
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Objective } from "@/types/strategy";
import { StatusIcon } from "./StatusIcon";
import { ObjectiveActions } from "./ObjectiveActions";
import { ParticipantsDisplay } from "./ParticipantsDisplay";
import { format } from "date-fns";

interface ColumnVisibility {
  start?: boolean;
  due?: boolean;
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
  columnVisibility = { start: true, due: true, participants: true, status: true }
}: ObjectivesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Field</TableHead>
          {columnVisibility.start && <TableHead>Start</TableHead>}
          {columnVisibility.due && <TableHead className="font-bold">Due</TableHead>}
          {columnVisibility.participants && <TableHead>Participants</TableHead>}
          {columnVisibility.status && <TableHead>Status</TableHead>}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {objectives
          .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
          .map((objective) => (
            <TableRow
              key={objective.id}
              className={`cursor-pointer ${
                selectedObjectiveId === objective.id
                  ? 'bg-blue-600 text-white hover:bg-blue-600'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onObjectiveSelect(objective.id)}
            >
              <TableCell className="font-medium">{objective.field}</TableCell>
              {columnVisibility.start && <TableCell>{format(new Date(objective.start), 'dd/MM/yyyy')}</TableCell>}
              {columnVisibility.due && <TableCell className="font-bold">{format(new Date(objective.due), 'dd/MM/yyyy')}</TableCell>}
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
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
