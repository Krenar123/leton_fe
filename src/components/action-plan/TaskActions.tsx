
import { MoreHorizontal, Edit, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/types/task";

interface TaskActionsProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusToggle: (id: string) => void;
}

export const TaskActions = ({ task, onEdit, onDelete, onStatusToggle }: TaskActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onEdit(task)} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onStatusToggle(task.ref)} className="cursor-pointer">
          {task.status === 'completed' ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              Mark as Unfinished
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Finished
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(task.ref)} 
          className="cursor-pointer text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
