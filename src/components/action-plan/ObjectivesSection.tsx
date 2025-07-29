
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Objective } from "@/types/strategy";
import { ObjectivesTable } from "./ObjectivesTable";
import { ObjectivesFilter } from "./ObjectivesFilter";

interface ObjectivesSectionProps {
  objectives: Objective[];
  selectedObjectiveId: string | null;
  selectedObjective: Objective | undefined;
  completedObjectives: number;
  totalObjectives: number;
  searchValue: string;
  onObjectiveSelect: (id: string) => void;
  onFilterChange: (filters: {
    field?: string;
    status?: string;
    participant?: string;
  }) => void;
  onSearchChange: (search: string) => void;
  onAddObjective: () => void;
  onEditObjective: (objective: Objective) => void;
  onDeleteObjective: (id: string) => void;
  onStatusChange: (id: string, status: Objective['status']) => void;
}

export const ObjectivesSection = ({
  objectives,
  selectedObjectiveId,
  selectedObjective,
  completedObjectives,
  totalObjectives,
  searchValue,
  onObjectiveSelect,
  onFilterChange,
  onSearchChange,
  onAddObjective,
  onEditObjective,
  onDeleteObjective,
  onStatusChange
}: ObjectivesSectionProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-slate-800">Objectives</h3>
            <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
              {completedObjectives}/{totalObjectives}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <ObjectivesFilter 
            onFilterChange={onFilterChange} 
            onSearchChange={onSearchChange} 
            searchValue={searchValue} 
          />
          <Button size="sm" onClick={onAddObjective} className="text-white bg-[#0a1f44]">
            <Plus className="w-4 h-4 mr-2" />
            Add Objective
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <ObjectivesTable 
          objectives={objectives} 
          selectedObjectiveId={selectedObjectiveId} 
          onObjectiveSelect={onObjectiveSelect} 
          onEdit={onEditObjective} 
          onDelete={onDeleteObjective} 
          onStatusChange={onStatusChange} 
        />
      </div>
    </Card>
  );
};
