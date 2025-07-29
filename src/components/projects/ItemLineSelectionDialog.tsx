
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { format } from "date-fns";

interface ItemLineSelectionDialogProps {
  onSelect: (itemLine: string) => void;
  onClose: () => void;
}

export const ItemLineSelectionDialog = ({ onSelect, onClose }: ItemLineSelectionDialogProps) => {
  const { estimatesActualsData } = useFinancialsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredData = estimatesActualsData.filter(item => {
    const matchesSearch = item.itemLine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const hasActiveFilters = statusFilter !== "all";

  const getStatusBadge = (status: string) => {
    const variants = {
      'not-started': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'on-hold': 'On Hold'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleRowClick = (itemLine: string) => {
    onSelect(itemLine);
    onClose();
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" }
  ];

  return (
    <DialogContent className="sm:max-w-[1400px] max-h-[85vh]">
      <DialogHeader>
        <DialogTitle>Select Item Line</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search item lines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={hasActiveFilters ? "text-yellow-600 border-yellow-300 bg-yellow-50" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statusOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={statusFilter === option.value ? "bg-accent" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Item Lines Table */}
        <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Item Line</TableHead>
                <TableHead className="text-right font-semibold">Estimated Cost</TableHead>
                <TableHead className="text-right font-semibold">Actual Cost</TableHead>
                <TableHead className="text-right font-semibold">Estimated Revenue</TableHead>
                <TableHead className="text-right font-semibold">Actual Revenue</TableHead>
                <TableHead className="text-right font-semibold">Profit</TableHead>
                <TableHead className="text-right font-semibold">Margin %</TableHead>
                <TableHead className="font-semibold">Start Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => {
                const profit = item.actualRevenue - item.actualCost;
                const margin = item.actualRevenue > 0 ? ((profit / item.actualRevenue) * 100) : 0;

                return (
                  <TableRow 
                    key={index} 
                    className="hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleRowClick(item.itemLine)}
                  >
                    <TableCell className="font-medium text-blue-600">
                      {item.itemLine}
                    </TableCell>
                    <TableCell className="text-right">${item.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.actualCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.estimatedRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.actualRevenue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">${profit.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        margin >= 20 
                          ? 'bg-green-100 text-green-800'
                          : margin >= 15 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {margin.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.startDate ? format(new Date(item.startDate), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {item.dueDate ? format(new Date(item.dueDate), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-lg font-medium mb-2">No item lines found</div>
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
