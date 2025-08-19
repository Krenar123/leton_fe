import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { ParticipantsDisplay } from "./ParticipantsDisplay";
import { TaskActions } from "./TaskActions";
import { StatusIcon } from "./StatusIcon";

interface ColumnVisibility {
  start_date: boolean;
  due_date: boolean;
  participants: boolean;
  status: boolean;
}

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (ref: string) => void;
  onStatusChange: (ref: string, status: Task['status']) => void;
  columnVisibility?: ColumnVisibility;
}

export const TasksTable = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  columnVisibility = {
    start_date: true,
    due_date: true,
    participants: true,
    status: true,
  }
}: TasksTableProps) => {
  const handleStatusToggle = (taskRef: string) => {
    const task = tasks.find(t => t.ref === taskRef);
    if (task) {
      const newStatus: Task['status'] =
        task.status === 'completed' ? 'in_progress' : 'completed';
      onStatusChange(task.ref, newStatus);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center bg-gray-50">
        <p className="text-gray-500">Select an objective to view its tasks</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-semibold text-gray-700">Task</TableHead>
            {columnVisibility.start_date && (
              <TableHead className="font-semibold text-gray-700">Start</TableHead>
            )}
            {columnVisibility.due_date && (
              <TableHead className="font-semibold text-gray-700">Due</TableHead>
            )}
            {columnVisibility.participants && (
              <TableHead className="font-semibold text-gray-700">Participants</TableHead>
            )}
            {columnVisibility.status && (
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            )}
            <TableHead className="font-semibold text-gray-700 w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.ref} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900">{task.title}</TableCell>
              {columnVisibility.start_date && (
                <TableCell className="text-gray-700">
                  {format(new Date(task.start_date), 'dd/MM/yyyy')}
                </TableCell>
              )}
              {columnVisibility.due_date && (
                <TableCell className="text-gray-700">
                  {format(new Date(task.due_date), 'dd/MM/yyyy')}
                </TableCell>
              )}
              {columnVisibility.participants && (
                <TableCell>
                  <ParticipantsDisplay participants={task.participants} />
                </TableCell>
              )}
              {columnVisibility.status && (
                <TableCell>
                  <StatusIcon status={task.status} />
                </TableCell>
              )}
              <TableCell>
                <TaskActions
                  task={task}
                  onEdit={onEdit}
                  onDelete={() => onDelete(task.ref)}
                  onStatusToggle={() => handleStatusToggle(task.ref)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
