
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Trash2, ExternalLink, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Backstop } from "./types";

interface BackstopsTableProps {
  backstops: Backstop[];
  onDeleteBackstop: (id: number) => void;
  onClose: () => void;
}

export const BackstopsTable = ({ backstops, onDeleteBackstop, onClose }: BackstopsTableProps) => {
  const navigate = useNavigate();

  const getStatusBadgeColor = (backstop: Backstop) => {
    if (backstop.isReached) {
      if (backstop.severity === "high") return "bg-red-100 text-red-800 border-red-200";
      if (backstop.severity === "medium") return "bg-yellow-100 text-yellow-800 border-yellow-200";
      return "bg-orange-100 text-orange-800 border-orange-200";
    }
    return "bg-green-100 text-green-800 border-green-200";
  };

  const handleGoToSource = (backstop: Backstop) => {
    // Don't navigate for project profit backstops as they are too general
    if (backstop.type === "job_profitability") {
      return;
    }
    
    if (backstop.type === "item_expense") {
      navigate(`/projects/1/financials`);
    } else if (backstop.type === "task_due") {
      navigate(`/projects/1/action-plan`);
    } else if (backstop.type === "cashflow") {
      navigate(`/projects/1/financials`);
    }
    onClose();
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">What</TableHead>
            <TableHead className="font-semibold">Where</TableHead>
            <TableHead className="font-semibold">Threshold</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backstops.map((backstop) => (
            <TableRow key={backstop.id} className="hover:bg-gray-50/50">
              <TableCell className="font-medium">
                {backstop.what}
              </TableCell>
              <TableCell className="text-gray-600">{backstop.where}</TableCell>
              <TableCell className="font-medium">{backstop.backstopValue}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={getStatusBadgeColor(backstop)}
                >
                  {backstop.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {/* Only show "Go to Source" for specific backstop types - exclude project profitability */}
                    {backstop.type !== "job_profitability" && (
                      <DropdownMenuItem onClick={() => handleGoToSource(backstop)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Go to Source
                      </DropdownMenuItem>
                    )}
                    {!backstop.isAutomatic && (
                      <DropdownMenuItem 
                        onClick={() => onDeleteBackstop(backstop.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
