
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { ItemLineSelectionDialog } from "./ItemLineSelectionDialog";

interface AddBackstopDialogProps {
  onClose: () => void;
  onAdd: (backstop: {
    field: string;
    itemLine?: string;
    type: string;
    threshold: number;
  }) => void;
}

export const AddBackstopDialog = ({ onClose, onAdd }: AddBackstopDialogProps) => {
  const [field, setField] = useState("");
  const [itemLine, setItemLine] = useState("");
  const [threshold, setThreshold] = useState("");
  const [isItemLineDialogOpen, setIsItemLineDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!field || !threshold) {
      return;
    }

    if (field === "item_line" && !itemLine) {
      return;
    }

    // Auto-determine type based on field
    const type = getTypeFromField(field);

    onAdd({
      field,
      itemLine: field === "item_line" ? itemLine : undefined,
      type,
      threshold: parseFloat(threshold)
    });

    onClose();
  };

  const getFieldOptions = () => {
    return [
      { value: "item_line", label: "Item Line" },
      { value: "project_profit", label: "Project Profit" },
      { value: "projected_cashflow", label: "Projected Cash Flow" }
    ];
  };

  const getTypeFromField = (fieldValue: string) => {
    if (fieldValue === "item_line") return "cost";
    if (fieldValue === "project_profit") return "profitability";
    if (fieldValue === "projected_cashflow") return "outflow_ratio";
    return "cost";
  };

  const getThresholdLabel = () => {
    if (field === "projected_cashflow") {
      return "Threshold (% of outflow vs inflow)";
    } else if (field === "project_profit") {
      return "Minimum Profitability %";
    } else if (field === "item_line") {
      return "Maximum Amount ($)";
    }
    return "Threshold Value";
  };

  const handleItemLineSelect = (selectedItemLine: string) => {
    setItemLine(selectedItemLine);
    setIsItemLineDialogOpen(false);
  };

  return (
    <>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Backstop</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="field">Field</Label>
            <Select value={field} onValueChange={setField} required>
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {getFieldOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {field === "item_line" && (
            <div>
              <Label htmlFor="itemLine">Item Line</Label>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start h-10 px-3 py-2"
                  onClick={() => setIsItemLineDialogOpen(true)}
                >
                  {itemLine || "Select item line..."}
                </Button>
              </div>
            </div>
          )}

          {field && (
            <div>
              <Label htmlFor="threshold">{getThresholdLabel()}</Label>
              <Input
                id="threshold"
                type="number"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                placeholder="Enter threshold value"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Backstop
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
    </>
  );
};
