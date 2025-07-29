
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EstimateActualItem, ViewMode } from "@/types/financials";

interface FinancialTableActionsProps {
  item: EstimateActualItem;
  viewMode: ViewMode;
  onItemLineAction: (itemLine: string, action: 'edit' | 'delete' | 'complete') => void;
}

export const FinancialTableActions = ({
  item,
  viewMode,
  onItemLineAction,
}: FinancialTableActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onItemLineAction(item.itemLine, 'edit')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onItemLineAction(item.itemLine, 'complete')}>
          {item.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onItemLineAction(item.itemLine, 'delete')} className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
