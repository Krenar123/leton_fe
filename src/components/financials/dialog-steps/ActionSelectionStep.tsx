
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ActionType } from "../ItemLineDialog";

interface ActionSelectionStepProps {
  onSelect: (actionType: ActionType) => void;
}

export const ActionSelectionStep = ({ onSelect }: ActionSelectionStepProps) => {
  const actions = [
    {
      type: 'add-main-category' as ActionType,
      title: 'Add Main Category',
      description: 'Create a new top-level cost code (Level 1)',
      example: 'e.g., "1 - Site Preparation & Earthworks"'
    },
    {
      type: 'add-category' as ActionType,
      title: 'Add Category',
      description: 'Create a subcategory under existing main category (Level 2)',
      example: 'e.g., "1.1 - Site Clearing"'
    },
    {
      type: 'add-item-line' as ActionType,
      title: 'Add Item Line',
      description: 'Create a new work item under existing category (Level 3)',
      example: 'e.g., "1.1.1 - Tree Removal"'
    },
    {
      type: 'add-vendor' as ActionType,
      title: 'Add Vendor to Item Line',
      description: 'Split existing item line by adding a new vendor',
      example: 'e.g., Add "ABC Construction" to existing "Tree Removal"'
    }
  ];

  return (
    <div className="space-y-3 py-6">
      {actions.map((action) => (
        <Card 
          key={action.type}
          className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200 w-full"
          onClick={() => onSelect(action.type)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 bg-[#0a1f44] text-white rounded-full">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-left">{action.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground text-left">
                    {action.description}
                  </CardDescription>
                </div>
              </div>
              <div className="text-xs text-muted-foreground italic ml-4">
                {action.example}
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
