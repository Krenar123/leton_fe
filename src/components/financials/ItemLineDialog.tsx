
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
    itemLine: string;
    contractor?: string;
    estimatedCost: number;
    estimatedRevenue: number;
    startDate?: string;
    dueDate?: string;
    dependsOn?: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
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
    estimatedRevenue: string;
    startDate?: Date;
    dueDate?: Date;
    dependsOn: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
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
      unit: "",
      quantity: "",
      pricePerUnit: "",
      estimatedRevenue: editingItem?.estimatedRevenue?.toString() || "",
      startDate: editingItem?.startDate ? new Date(editingItem.startDate) : undefined,
      dueDate: editingItem?.dueDate ? new Date(editingItem.dueDate) : undefined,
      dependsOn: editingItem?.dependsOn || "none",
      status: editingItem?.status || 'not-started',
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
        estimatedRevenue: "",
        startDate: undefined,
        dueDate: undefined,
        dependsOn: "none",
        status: 'not-started',
      }
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleActionSelect = (actionType: ActionType) => {
    setDialogState(prev => ({ ...prev, actionType }));
    
    // Skip location step for main category
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

  // Skip steps for editing existing items
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
