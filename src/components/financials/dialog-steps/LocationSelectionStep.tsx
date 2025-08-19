import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { ActionType } from "../ItemLineDialog";
import { EstimateActualItem } from "@/types/financials";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface LocationSelectionStepProps {
  actionType: ActionType;
  existingItemLines: EstimateActualItem[];
  onSelect: (level1?: string, level2?: string, level3?: string) => void;
  onBack: () => void;
}

export const LocationSelectionStep = ({
  actionType,
  existingItemLines,
  onSelect,
  onBack
}: LocationSelectionStepProps) => {
  const [selectedLevel1, setSelectedLevel1] = useState<string>("");
  const [selectedLevel2, setSelectedLevel2] = useState<string>("");
  const [selectedLevel3, setSelectedLevel3] = useState<string>("");

  // Preserve ID when flattening attributes
  const itemLines = existingItemLines.map(item => ({
    ...item.attributes,
    id: item.id,
  }));

  const level1Items = existingItemLines.filter(item => item.level === 1);
  const level2Items = existingItemLines.filter(item =>
    item.level === 2 && String(item.parentId) === selectedLevel1
  );
  const level3Items = existingItemLines.filter(item =>
    item.level === 3 && String(item.parentId) === selectedLevel2
  );

  const canProceed = () => {
    switch (actionType) {
      case "add-category":
        return selectedLevel1 !== "";
      case "add-item-line":
        return selectedLevel1 !== "" && selectedLevel2 !== "";
      case "add-vendor":
        return selectedLevel1 !== "" && selectedLevel2 !== "" && selectedLevel3 !== "";
      default:
        return false;
    }
  };

  const handleProceed = () => {
    onSelect(
      selectedLevel1 || undefined,
      selectedLevel2 || undefined,
      selectedLevel3 || undefined
    );
  };

  const getInstructions = () => {
    switch (actionType) {
      case "add-category":
        return "Select the main category where you want to add a new subcategory:";
      case "add-item-line":
        return "Select the category where you want to add a new item line:";
      case "add-vendor":
        return "Select the item line where you want to add a new vendor:";
      default:
        return "Select the location:";
    }
  };

  const getCurrentPath = () => {
    const parts = [];
    if (selectedLevel1) {
      const level1Item = itemLines.find(item => String(item.id) === selectedLevel1);
      parts.push(level1Item?.itemLine || selectedLevel1);
    }
    if (selectedLevel2) {
      const level2Item = itemLines.find(item => String(item.id) === selectedLevel2);
      parts.push(level2Item?.itemLine || selectedLevel2);
    }
    if (selectedLevel3) {
      const level3Item = itemLines.find(item => String(item.id) === selectedLevel3);
      parts.push(level3Item?.itemLine || selectedLevel3);
    }
    return parts;
  };

  return (
    <div className="space-y-6 py-6">
      <div className="text-sm text-muted-foreground">{getInstructions()}</div>

      {/* Current Path Breadcrumb */}
      {getCurrentPath().length > 0 && (
        <div className="p-3 bg-muted/30 rounded-md">
          <Label className="text-sm font-medium mb-2 block">Current Path:</Label>
          <Breadcrumb>
            <BreadcrumbList>
              {getCurrentPath().map((path, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm">{path}</BreadcrumbPage>
                  </BreadcrumbItem>
                  {index < getCurrentPath().length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="space-y-4">
        {/* Level 1 Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Main Category (Level 1)</Label>
          <Select value={selectedLevel1} onValueChange={setSelectedLevel1}>
            <SelectTrigger>
              <SelectValue placeholder="Select main category" />
            </SelectTrigger>
            <SelectContent>
              {level1Items.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.costCode} - {item.itemLine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level 2 Selection */}
        {(actionType === "add-item-line" || actionType === "add-vendor") && selectedLevel1 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category (Level 2)</Label>
            <Select value={selectedLevel2} onValueChange={setSelectedLevel2}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {level2Items.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.costCode} - {item.itemLine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Level 3 Selection */}
        {actionType === "add-vendor" && selectedLevel2 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Item Line (Level 3)</Label>
            <Select value={selectedLevel3} onValueChange={setSelectedLevel3}>
              <SelectTrigger>
                <SelectValue placeholder="Select item line" />
              </SelectTrigger>
              <SelectContent>
                {level3Items.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.costCode} - {item.itemLine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={!canProceed()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
