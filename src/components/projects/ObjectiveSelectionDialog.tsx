import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useStrategyData } from "@/hooks/useStrategyData";
import { format } from "date-fns";

interface ObjectiveSelectionDialogProps {
  projectRef: string;
  onSelect: (objectiveRef: string) => void;
  onClose: () => void;
}

export const ObjectiveSelectionDialog = ({ projectRef, onSelect, onClose }: ObjectiveSelectionDialogProps) => {
  const { objectives } = useStrategyData(projectRef, null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleRowClick = (objectiveRef: string) => {
    onSelect(objectiveRef);
    onClose();
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'not_started': 'bg-gray-100 text-gray-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'on_hold': 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      'not_started': 'Not Started',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'on_hold': 'On Hold'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <DialogContent className="sm:max-w-[1200px] max-h-[85vh]">
      <DialogHeader>
        <DialogTitle>Select Objective</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Search Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search objectives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Objectives Table */}
        <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">End Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObjectives.map((objective) => (
                <TableRow 
                  key={objective.ref} 
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleRowClick(objective.ref)}
                >
                  <TableCell className="font-medium text-blue-600">
                    {objective.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {objective.description || "-"}
                  </TableCell>
                  <TableCell>
                    {objective.start_date ? format(new Date(objective.start_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {objective.end_date ? format(new Date(objective.end_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(objective.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredObjectives.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No objectives found</div>
            <p className="text-sm">Try adjusting your search criteria.</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
