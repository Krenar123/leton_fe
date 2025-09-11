import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStrategyData } from "@/hooks/useStrategyData";
import { format } from "date-fns";

interface TaskSelectionDialogProps {
  projectRef: string;
  onSelect: (taskRef: string) => void;
  onClose: () => void;
}

export const TaskSelectionDialog = ({ projectRef, onSelect, onClose }: TaskSelectionDialogProps) => {
  const { objectives, tasks } = useStrategyData(projectRef, null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>("all");

  // Filter tasks based on search and objective selection
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesObjective = selectedObjectiveId === "all" || task.objective_id === selectedObjectiveId;
    return matchesSearch && matchesObjective;
  });

  const handleRowClick = (taskRef: string) => {
    onSelect(taskRef);
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

  const getObjectiveTitle = (objectiveId: string) => {
    const objective = objectives.find(obj => obj.ref === objectiveId);
    return objective ? objective.title : "Unknown Objective";
  };

  return (
    <DialogContent className="sm:max-w-[1400px] max-h-[85vh]">
      <DialogHeader>
        <DialogTitle>Select Task</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="w-64">
            <Select value={selectedObjectiveId} onValueChange={setSelectedObjectiveId}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by objective" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Objectives</SelectItem>
                {objectives.map((objective) => (
                  <SelectItem key={objective.ref} value={objective.ref}>
                    {objective.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Task Title</TableHead>
                <TableHead className="font-semibold">Objective</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow 
                  key={task.ref} 
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleRowClick(task.ref)}
                >
                  <TableCell className="font-medium text-blue-600">
                    {task.title}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {getObjectiveTitle(task.objective_id)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {task.description || "-"}
                  </TableCell>
                  <TableCell>
                    {task.start_date ? format(new Date(task.start_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No tasks found</div>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
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
