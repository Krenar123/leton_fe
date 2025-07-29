
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Backstop } from "./types";

interface BackstopsTableProps {
  backstops: Backstop[];
  onClose: () => void;
}

export const BackstopsTable = ({ backstops, onClose }: BackstopsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (backstop: Backstop) => {
    navigate(`/projects/${backstop.projectId}`);
    onClose();
  };

  const getStatusBadgeColor = (backstop: Backstop) => {
    if (backstop.isReached) {
      if (backstop.severity === "high") return "bg-red-100 text-red-800 border-red-200";
      if (backstop.severity === "medium") return "bg-yellow-100 text-yellow-800 border-yellow-200";
      return "bg-orange-100 text-orange-800 border-orange-200";
    }
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">What</TableHead>
            <TableHead className="font-semibold">Where</TableHead>
            <TableHead className="font-semibold">Project</TableHead>
            <TableHead className="font-semibold">Threshold</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {backstops.map((backstop) => (
            <TableRow 
              key={backstop.id} 
              className="hover:bg-gray-50/50 cursor-pointer"
              onClick={() => handleRowClick(backstop)}
            >
              <TableCell className="font-medium">{backstop.what}</TableCell>
              <TableCell className="text-gray-600">{backstop.where}</TableCell>
              <TableCell className="text-gray-600">{backstop.projectName}</TableCell>
              <TableCell className="font-medium">{backstop.backstopValue}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline"
                  className={getStatusBadgeColor(backstop)}
                >
                  {backstop.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
