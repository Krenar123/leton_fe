
import { MoreHorizontal, Edit, Trash2, CheckCircle, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EstimateActualItem } from "@/types/financials";
import { useNavigate } from "react-router-dom";

interface ItemLineActionsProps {
  item: EstimateActualItem;
  onStatusChange: (itemLine: string, status: 'not_started' | 'in_progress' | 'completed' | 'on-hold') => void;
  onEdit: (item: EstimateActualItem) => void;
  onDelete: (itemLine: string) => void;
}

export const ItemLineActions = ({ item, onStatusChange, onEdit, onDelete }: ItemLineActionsProps) => {
  const navigate = useNavigate();

  const handleGoToFinancials = () => {
    navigate(`/projects/1/financials`);
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'not_started': return 'in_progress';
      case 'in_progress': return 'completed';
      case 'completed': return 'not_started';
      case 'on-hold': return 'in_progress';
      default: return 'in_progress';
    }
  };

  const getStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'not_started': return 'Mark as In Progress';
      case 'in_progress': return 'Mark as Completed';
      case 'completed': return 'Mark as Not Started';
      case 'on-hold': return 'Mark as In Progress';
      default: return 'Change Status';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white z-50">
        <DropdownMenuItem onClick={() => onEdit(item)} className="cursor-pointer">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleGoToFinancials} className="cursor-pointer">
          <ExternalLink className="w-4 h-4 mr-2" />
          Go to Financials
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onStatusChange(item.itemLine, getNextStatus(item.status))} 
          className="cursor-pointer"
        >
          {item.status === 'completed' ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              {getStatusLabel(item.status)}
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              {getStatusLabel(item.status)}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(item.itemLine)} 
          className="cursor-pointer text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
