
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Task } from "@/types/strategy";
import { format } from "date-fns";
import { ParticipantsDisplay } from "./ParticipantsDisplay";
import { TaskActions } from "./TaskActions";
import { StatusIcon } from "./StatusIcon";

interface ColumnVisibility {
  start: boolean;
  due: boolean;
  participants: boolean;
  status: boolean;
}

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  columnVisibility?: ColumnVisibility;
}

export const TasksTable = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onStatusChange,
  columnVisibility = {
    start: true,
    due: true,
    participants: true,
    status: true,
  }
}: TasksTableProps) => {
  const handleStatusToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'Finished' ? 'In Progress' : 'Finished';
      onStatusChange(taskId, newStatus);
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
            {columnVisibility.start && <TableHead className="font-semibold text-gray-700">Start</TableHead>}
            {columnVisibility.due && <TableHead className="font-semibold text-gray-700">Due</TableHead>}
            {columnVisibility.participants && <TableHead className="font-semibold text-gray-700">Participants</TableHead>}
            {columnVisibility.status && <TableHead className="font-semibold text-gray-700">Status</TableHead>}
            <TableHead className="font-semibold text-gray-700 w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium text-gray-900">{task.task}</TableCell>
              {columnVisibility.start && <TableCell className="text-gray-700">{format(new Date(task.start), 'dd/MM/yyyy')}</TableCell>}
              {columnVisibility.due && <TableCell className="text-gray-700">{format(new Date(task.due), 'dd/MM/yyyy')}</TableCell>}
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
                  onDelete={onDelete}
                  onStatusToggle={handleStatusToggle}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
