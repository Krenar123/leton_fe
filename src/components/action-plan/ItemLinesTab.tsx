
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Clock, AlertCircle, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Project } from "@/types/project";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { StatusIcon } from "@/components/action-plan/StatusIcon";
import { ItemLineActions } from "@/components/action-plan/ItemLineActions";
import { calculateStatusFromDates } from "@/utils/statusCalculator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ItemLinesTabProps {
  project: Project;
}

export const ItemLinesTab = ({ project }: ItemLinesTabProps) => {
  const { estimatesActualsData, handleItemLineAction } = useFinancialsData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Map financial status to action plan status
  const mapFinancialToActionStatus = (financialStatus: string, startDate?: string, dueDate?: string): 'Planned' | 'In Progress' | 'Finished' | 'Already Due' => {
    if (financialStatus === 'completed') {
      return 'Finished';
    }
    
    if (startDate && dueDate) {
      return calculateStatusFromDates(startDate, dueDate);
    }
    
    return 'Planned';
  };

  const handleStatusChange = (itemLine: string, status: 'not-started' | 'in-progress' | 'completed' | 'on-hold') => {
    handleItemLineAction(itemLine, status === 'completed' ? 'complete' : 'edit');
  };

  const handleEdit = (item: any) => {
    handleItemLineAction(item.itemLine, 'edit');
  };

  const handleDelete = (itemLine: string) => {
    handleItemLineAction(itemLine, 'delete');
  };

  const handleItemClick = (itemLine: string) => {
    // Navigate to financials when clicking on item line
    window.location.href = `/projects/${project.id}/financials`;
  };

  // Filter item lines based on search and status
  const filteredItems = estimatesActualsData.filter(item => {
    const matchesSearch = item.itemLine.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") {
      return matchesSearch;
    }
    
    const itemStatus = mapFinancialToActionStatus(item.status, item.startDate, item.dueDate);
    return matchesSearch && itemStatus === statusFilter;
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Planned", label: "Planned" },
    { value: "In Progress", label: "In Progress" },
    { value: "Finished", label: "Finished" },
    { value: "Already Due", label: "Already Due" }
  ];

  const hasActiveFilter = statusFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
              className={hasActiveFilter ? "text-yellow-600 border-yellow-600 bg-yellow-50" : ""}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white z-50">
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

      {/* Item Lines Grid */}
      <div className="grid gap-4">
        {filteredItems.map((item, index) => {
          const itemStatus = mapFinancialToActionStatus(item.status, item.startDate, item.dueDate);
          
          return (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleItemClick(item.itemLine)}>
                  <div className="flex items-center gap-3 mb-2">
                    <StatusIcon status={itemStatus} />
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {item.itemLine}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    {item.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Start: {format(new Date(item.startDate), 'dd/MM/yyyy')}</span>
                      </div>
                    )}
                    
                    {item.dueDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Due: {format(new Date(item.dueDate), 'dd/MM/yyyy')}</span>
                      </div>
                    )}
                    
                    {item.dependsOn && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>Depends on: {item.dependsOn}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-gray-600">
                    <div>Est. Cost: ${item.estimatedCost.toLocaleString()}</div>
                    <div>Est. Revenue: ${item.estimatedRevenue.toLocaleString()}</div>
                  </div>
                  
                  <ItemLineActions
                    item={item}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </Card>
          );
        })}
        
        {filteredItems.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h4 className="font-medium mb-2">No Item Lines Found</h4>
              <p className="text-sm">
                {searchTerm || statusFilter !== "all" 
                  ? "No item lines match your current filters." 
                  : "No item lines have been created yet in the financials section."
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
