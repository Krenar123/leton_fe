
import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { ItemLineSelectionDialog } from "./ItemLineSelectionDialog";
import { ObjectiveSelectionDialog } from "./ObjectiveSelectionDialog";
import { TaskSelectionDialog } from "./TaskSelectionDialog";
import { createBackstop } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useProjectData } from "@/hooks/useProjectData";
import { useStrategyData } from "@/hooks/useStrategyData";

interface AddBackstopDialogProps {
  projectRef: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBackstopDialog = ({ projectRef, onClose, onSuccess }: AddBackstopDialogProps) => {
  const [scopeType, setScopeType] = useState<"item_line" | "objective" | "task" | "project_profit" | "projected_cashflow" | "">("");
  const [scopeRef, setScopeRef] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [thresholdDate, setThresholdDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isItemLineDialogOpen, setIsItemLineDialogOpen] = useState(false);
  const [isObjectiveDialogOpen, setIsObjectiveDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const { project } = useProjectData(projectRef);
  const { objectives } = useStrategyData(projectRef, null);

  // Reset form when scope type changes
  useEffect(() => {
    setScopeRef("");
    setThresholdValue("");
    setThresholdDate("");
    setErrors({});
  }, [scopeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    const newErrors: Record<string, string> = {};

    // Validation
    if (!scopeType) {
      newErrors.scopeType = "Please select a scope type";
    }

    if (!scopeRef && scopeType !== "project_profit" && scopeType !== "projected_cashflow") {
      newErrors.scopeRef = "Please select a scope";
    }

    if (scopeType === "item_line") {
      if (!thresholdValue || parseFloat(thresholdValue) < 0) {
        newErrors.threshold = "Please enter a valid amount (≥ 0)";
      }
    } else if (scopeType === "objective" || scopeType === "task") {
      if (!thresholdDate) {
        newErrors.threshold = "Please select a date";
      } else {
        const selectedDate = new Date(thresholdDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          newErrors.threshold = "Date cannot be in the past";
        }
      }
    } else if (scopeType === "project_profit") {
      if (!thresholdValue || parseFloat(thresholdValue) < 0) {
        newErrors.threshold = "Please enter a valid percentage (≥ 0)";
      }
    } else if (scopeType === "projected_cashflow") {
      if (!thresholdValue || parseFloat(thresholdValue) < 0 || parseFloat(thresholdValue) > 100) {
        newErrors.threshold = "Please enter a valid percentage (0-100)";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const backstopData: any = {
        scope_type: scopeType,
        scope_ref: scopeRef || "project", // For project-level scopes, use "project" as scope_ref
      };

      if (scopeType === "item_line") {
        backstopData.threshold_type = "amount";
        backstopData.threshold_value_cents = Math.round(parseFloat(thresholdValue) * 100);
      } else if (scopeType === "objective" || scopeType === "task") {
        backstopData.threshold_type = "date";
        backstopData.threshold_date = thresholdDate;
      } else if (scopeType === "project_profit") {
        backstopData.threshold_type = "percentage";
        backstopData.threshold_value = parseFloat(thresholdValue);
      } else if (scopeType === "projected_cashflow") {
        backstopData.threshold_type = "percentage";
        backstopData.threshold_value = parseFloat(thresholdValue);
      }

      await createBackstop(projectRef, backstopData);
      
      toast({
        title: "Success",
        description: "Backstop added successfully",
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create backstop",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThresholdLabel = () => {
    if (scopeType === "item_line") {
      return "Amount ($)";
    } else if (scopeType === "objective" || scopeType === "task") {
      return "Date";
    } else if (scopeType === "project_profit") {
      return "Minimum Profitability (%)";
    } else if (scopeType === "projected_cashflow") {
      return "Threshold (% of outflow vs inflow)";
    }
    return "Threshold";
  };

  const getScopeLabel = () => {
    if (scopeType === "item_line") return "Item Line";
    if (scopeType === "objective") return "Objective";
    if (scopeType === "task") return "Task";
    if (scopeType === "project_profit") return "Project Profit";
    if (scopeType === "projected_cashflow") return "Projected Cash Flow";
    return "Scope";
  };

  const handleItemLineSelect = (selectedItemLine: string) => {
    setScopeRef(selectedItemLine);
    setIsItemLineDialogOpen(false);
  };

  const handleObjectiveSelect = (selectedObjective: string) => {
    setScopeRef(selectedObjective);
    setIsObjectiveDialogOpen(false);
  };

  const handleTaskSelect = (selectedTask: string) => {
    setScopeRef(selectedTask);
    setIsTaskDialogOpen(false);
  };

  const getSelectedScopeDisplay = () => {
    if (scopeType === "project_profit" || scopeType === "projected_cashflow") {
      return "Overall Project"; // These are project-level scopes
    }
    
    if (!scopeRef) return `Select ${getScopeLabel().toLowerCase()}...`;
    
    if (scopeType === "item_line") {
      return scopeRef; // Item line name
    } else if (scopeType === "objective") {
      const objective = objectives.find(obj => obj.ref === scopeRef);
      return objective ? objective.title : scopeRef;
    } else if (scopeType === "task") {
      return scopeRef; // Task title
    }
    
    return scopeRef;
  };

  const isProjectLoaded = !!project;

  return (
    <>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Backstop</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="scopeType">Scope Type</Label>
            <Select value={scopeType} onValueChange={(value: any) => setScopeType(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select scope type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="item_line">Item Line</SelectItem>
                <SelectItem value="objective">Objective</SelectItem>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="project_profit">Project Profit</SelectItem>
                <SelectItem value="projected_cashflow">Projected Cash Flow</SelectItem>
              </SelectContent>
            </Select>
            {errors.scopeType && (
              <p className="text-sm text-red-600 mt-1">{errors.scopeType}</p>
            )}
          </div>

          {scopeType && (
            <div>
              <Label htmlFor="scopeRef">{getScopeLabel()}</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-10 px-3 py-2"
                  onClick={() => {
                    if (scopeType === "item_line") setIsItemLineDialogOpen(true);
                    else if (scopeType === "objective") setIsObjectiveDialogOpen(true);
                    else if (scopeType === "task") setIsTaskDialogOpen(true);
                    // For project_profit and projected_cashflow, no dialog needed
                  }}
                  disabled={!isProjectLoaded || scopeType === "project_profit" || scopeType === "projected_cashflow"}
                >
                  {getSelectedScopeDisplay()}
                </Button>
              </div>
              {errors.scopeRef && scopeType !== "project_profit" && scopeType !== "projected_cashflow" && (
                <p className="text-sm text-red-600 mt-1">{errors.scopeRef}</p>
              )}
              {!isProjectLoaded && (
                <p className="text-sm text-gray-500 mt-1">Please wait for project to load</p>
              )}
            </div>
          )}

          {scopeType && (
            <div>
              <Label htmlFor="threshold">{getThresholdLabel()}</Label>
              {scopeType === "item_line" ? (
                <Input
                  id="threshold"
                  type="number"
                  step="0.01"
                  min="0"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(e.target.value)}
                  placeholder="Enter amount in USD"
                  required
                />
              ) : scopeType === "objective" || scopeType === "task" ? (
                <Input
                  id="threshold"
                  type="date"
                  value={thresholdDate}
                  onChange={(e) => setThresholdDate(e.target.value)}
                  required
                />
              ) : (
                <Input
                  id="threshold"
                  type="number"
                  step="0.01"
                  min="0"
                  max={scopeType === "projected_cashflow" ? "100" : undefined}
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(e.target.value)}
                  placeholder={scopeType === "project_profit" ? "Enter minimum profitability %" : "Enter percentage (0-100)"}
                  required
                />
              )}
              {errors.threshold && (
                <p className="text-sm text-red-600 mt-1">{errors.threshold}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Backstop"}
            </Button>
          </div>
        </form>
      </DialogContent>

      <Dialog open={isItemLineDialogOpen} onOpenChange={setIsItemLineDialogOpen}>
        <ItemLineSelectionDialog
          onSelect={handleItemLineSelect}
          onClose={() => setIsItemLineDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isObjectiveDialogOpen} onOpenChange={setIsObjectiveDialogOpen}>
        <ObjectiveSelectionDialog
          projectRef={projectRef}
          onSelect={handleObjectiveSelect}
          onClose={() => setIsObjectiveDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <TaskSelectionDialog
          projectRef={projectRef}
          onSelect={handleTaskSelect}
          onClose={() => setIsTaskDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};
