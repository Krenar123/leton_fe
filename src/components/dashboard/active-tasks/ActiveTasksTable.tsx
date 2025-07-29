
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActiveTask } from "./types";

interface ActiveTasksTableProps {
  tasks: ActiveTask[];
  onTaskClick: (projectId: number, taskId: number) => void;
}

export const ActiveTasksTable = ({ tasks, onTaskClick }: ActiveTasksTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Task</TableHead>
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold">Start</TableHead>
            <TableHead className="font-semibold">Due</TableHead>
            <TableHead className="font-semibold">Who</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No tasks found matching your filters
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow 
                key={task.id} 
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onTaskClick(task.projectId, task.id)}
              >
                <TableCell className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                  {task.task}
                </TableCell>
                <TableCell>{task.project}</TableCell>
                <TableCell>{formatDate(task.start)}</TableCell>
                <TableCell>{formatDate(task.due)}</TableCell>
                <TableCell>{task.assignees.join(", ")}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' 
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : task.status === 'On Hold'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
