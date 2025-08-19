
import { MoreHorizontal, Edit, Trash2, CheckCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Objective } from "@/types/objective";

interface ObjectiveActionsProps {
  objective: Objective;
  onEdit: (objective: Objective) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Objective['status']) => void;
}

export const ObjectiveActions = ({ objective, onEdit, onDelete, onStatusChange }: ObjectiveActionsProps) => {
  const handleStatusToggle = () => {
    const newStatus = objective.status === 'Finished' ? 'In Progress' : 'Finished';
    onStatusChange(objective.ref, newStatus);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600/50">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onEdit(objective)} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleStatusToggle} className="cursor-pointer">
          {objective.status === 'Finished' ? (
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
          onClick={() => onDelete(objective.ref)} 
          className="cursor-pointer text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
