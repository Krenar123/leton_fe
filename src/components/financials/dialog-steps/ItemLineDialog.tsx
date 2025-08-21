import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EstimateActualItem } from "@/types/financials";
import { ActionSelectionStep } from "./dialog-steps/ActionSelectionStep";
import { LocationSelectionStep } from "./dialog-steps/LocationSelectionStep";
import { FormStep } from "./dialog-steps/FormStep";

interface ItemLineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemLine: {
    ref?: string;
    item_line: string;
    contractor?: string;
    estimated_cost: number;
    estimated_revenue: number;
    start_date?: string;
    due_date?: string;
    depends_on?: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
    actionType?: string;
    selectedLevel1?: string;
    selectedLevel2?: string;
    selectedLevel3?: string;
    unit?: string;
    quantity?: number;
    unit_price?: number;
  }) => void;
  existingItemLines?: EstimateActualItem[];
  editingItem?: EstimateActualItem;
}

export type ActionType = 'add-main-category' | 'add-category' | 'add-item-line' | 'add-vendor';
export type StepType = 'action' | 'location' | 'form';

export interface DialogState {
  actionType: ActionType | null;
  selectedLevel1?: string;
  selectedLevel2?: string;
  selectedLevel3?: string;
  formData: {
    description: string;
    vendor: string;
    unit: string;
    quantity: string;
    pricePerUnit: string;
    estimated_revenue: string;
    start_date?: Date;
    due_date?: Date;
    depends_on: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  };
}

export const ItemLineDialog = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingItemLines = [],
  editingItem 
}: ItemLineDialogProps) => {
  const [currentStep, setCurrentStep] = useState<StepType>('action');
  const [dialogState, setDialogState] = useState<DialogState>({
    actionType: null,
    formData: {
      description: editingItem?.itemLine || "",
      vendor: editingItem?.contractor || "",
      unit: editingItem?.unit || "",
      quantity: editingItem?.quantity?.toString() || "",
      pricePerUnit: editingItem?.unitPrice?.toString() || "",
      estimated_revenue: editingItem?.estimatedRevenue?.toString() || "",
      start_date: editingItem?.startDate ? new Date(editingItem.startDate) : undefined,
      due_date: editingItem?.dueDate ? new Date(editingItem.dueDate) : undefined,
      depends_on: editingItem?.dependsOn || "none",
      status: editingItem?.status || 'not_started',
    }
  });

  const handleReset = () => {
    setCurrentStep('action');
    setDialogState({
      actionType: null,
      formData: {
        description: "",
        vendor: "",
        unit: "",
        quantity: "",
        pricePerUnit: "",
        estimated_revenue: "",
        start_date: undefined,
        due_date: undefined,
        depends_on: "none",
        status: 'not_started',
      }
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleActionSelect = (actionType: ActionType) => {
    setDialogState(prev => ({ ...prev, actionType }));

    if (actionType === 'add-main-category') {
      setCurrentStep('form');
    } else {
      setCurrentStep('location');
    }
  };

  const handleLocationSelect = (level1?: string, level2?: string, level3?: string) => {
    setDialogState(prev => ({
      ...prev,
      selectedLevel1: level1,
      selectedLevel2: level2,
      selectedLevel3: level3
    }));
    setCurrentStep('form');
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep(dialogState.actionType === 'add-main-category' ? 'action' : 'location');
    } else if (currentStep === 'location') {
      setCurrentStep('action');
    }
  };

  const getDialogTitle = () => {
    if (editingItem) return 'Edit Item Line';

    switch (currentStep) {
      case 'action':
        return 'What would you like to add?';
      case 'location':
        return 'Where would you like to add it?';
      case 'form':
        switch (dialogState.actionType) {
          case 'add-main-category':
            return 'Add Main Category';
          case 'add-category':
            return 'Add Category';
          case 'add-item-line':
            return 'Add Item Line';
          case 'add-vendor':
            return 'Add Vendor to Item Line';
          default:
            return 'Add New Item';
        }
      default:
        return 'Add New Item';
    }
  };

  if (editingItem && currentStep !== 'form') {
    setCurrentStep('form');
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'action' && !editingItem && (
          <ActionSelectionStep onSelect={handleActionSelect} />
        )}

        {currentStep === 'location' && (
          <LocationSelectionStep 
            actionType={dialogState.actionType!}
            existingItemLines={existingItemLines}
            onSelect={handleLocationSelect}
            onBack={handleBack}
          />
        )}

        {currentStep === 'form' && (
          <FormStep
            dialogState={dialogState}
            setDialogState={setDialogState}
            existingItemLines={existingItemLines}
            editingItem={editingItem}
            onSave={onSave}
            onBack={handleBack}
            onClose={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
