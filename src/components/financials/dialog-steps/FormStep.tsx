
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EstimateActualItem } from "@/types/financials";
import { DialogState } from "../ItemLineDialog";

interface FormStepProps {
  dialogState: DialogState;
  setDialogState: (state: DialogState | ((prev: DialogState) => DialogState)) => void;
  existingItemLines: EstimateActualItem[];
  editingItem?: EstimateActualItem;
  onSave: (itemLine: any) => void;
  onBack: () => void;
  onClose: () => void;
}

export const FormStep = ({
  dialogState,
  setDialogState,
  existingItemLines,
  editingItem,
  onSave,
  onBack,
  onClose
}: FormStepProps) => {
  const { formData, actionType, selectedLevel1, selectedLevel2, selectedLevel3 } = dialogState;

  const calculateEstimatedCost = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    return qty * price;
  };

  const estimatedCost = calculateEstimatedCost();

  // Helper function to check if parent level has a vendor
  const hasParentVendor = () => {
    if (actionType === 'add-main-category' || actionType === 'add-vendor') return false;
    
    if (actionType === 'add-category' && selectedLevel1) {
      const parentItem = existingItemLines.find(item => item.parent_id === selectedLevel1);
      return !!(parentItem?.contractor || parentItem?.vendor);
    }
    
    if (actionType === 'add-item-line' && selectedLevel2) {
      const parentItem = existingItemLines.find(item => item.parent_id === selectedLevel2);
      return !!(parentItem?.contractor || parentItem?.vendor);
    }
    
    return false;
  };

  const updateFormData = (field: string, value: any) => {
    setDialogState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    updateFormData('startDate', date);
    // If due date is before the new start date, clear it
    if (date && formData.dueDate && formData.dueDate < date) {
      updateFormData('dueDate', undefined);
    }
  };

  const handleDueDateChange = (date: Date | undefined) => {
    // Only allow due date if it's after start date
    if (date && formData.startDate && date < formData.startDate) {
      return; // Don't update if due date is before start date
    }
    updateFormData('dueDate', date);
  };

  const handleSave = () => {
    if (!formData.description || estimatedCost <= 0 || !formData.estimatedRevenue) return;
    
    const getParentId = (): string | undefined => {
      switch (actionType) {
        case "add-category":
          return selectedLevel1;
        case "add-item-line":
          return selectedLevel2;
        case "add-vendor":
          return selectedLevel3;
        default:
          return undefined;
      }
    }

    // Check if vendor is required but missing
    const parentHasVendor = hasParentVendor();
    const isVendorRequired = actionType === 'add-vendor' || !parentHasVendor;
    if (isVendorRequired && !formData.vendor.trim()) return;

    // Date validation
    if (formData.startDate && formData.dueDate && formData.dueDate < formData.startDate) {
      return;
    }
    
    onSave({
      item_line: formData.description,
      contractor: formData.vendor || undefined,
      estimated_cost: estimatedCost,
      estimated_revenue: parseFloat(formData.estimatedRevenue),
      start_date: formData.startDate ? formData.startDate.toISOString() : undefined,
      due_date: formData.dueDate ? formData.dueDate.toISOString() : undefined,
      depends_on: formData.dependsOn === "none" ? undefined : formData.dependsOn,
      status: formData.status,
      actionType,
      selectedLevel1,
      selectedLevel2,
      selectedLevel3,
      unit: formData.unit,
      quantity: parseFloat(formData.quantity) || 0,
      unit_price: parseFloat(formData.pricePerUnit) || 0,
      parent_id: getParentId(),
    });
    
    onClose();
  };

  const parentHasVendor = hasParentVendor();
  const isVendorRequired = actionType === 'add-vendor' || !parentHasVendor;
  const isFormValid = formData.description.trim() && 
                     estimatedCost > 0 && 
                     formData.estimatedRevenue &&
                     (!isVendorRequired || formData.vendor.trim()) &&
                     (!formData.startDate || !formData.dueDate || formData.dueDate >= formData.startDate);

  const showDescriptionField = actionType !== 'add-vendor';
  const showDependenciesField = actionType === 'add-item-line';
  const showVendorField = actionType === 'add-vendor' || !parentHasVendor;
  const showDatesFields = actionType !== 'add-vendor';

  const getVendorFieldLabel = () => {
    if (actionType === 'add-vendor') return 'Vendor Name *';
    return parentHasVendor ? 'Vendor (Optional - inherited from parent)' : 'Vendor *';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
      {/* General Section */}
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="pb-4 border-b border-blue-200 mb-4">
            <h3 className="text-lg font-semibold text-blue-900">General Information</h3>
          </div>

          {/* Description */}
          {showDescriptionField && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="description" className="text-sm font-medium text-blue-900">
                Description *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Detailed description of the work item"
                className="w-full min-h-[80px] bg-white"
              />
            </div>
          )}

          {/* Vendor */}
          {showVendorField && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="vendor" className="text-sm font-medium text-blue-900">
                {getVendorFieldLabel()}
              </Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => updateFormData('vendor', e.target.value)}
                placeholder="e.g., ABC Construction, ElectroMax Ltd"
                className="w-full bg-white"
              />
              {parentHasVendor && actionType !== 'add-vendor' && (
                <p className="text-xs text-blue-700">
                  Vendor will be inherited from parent level if left empty
                </p>
              )}
            </div>
          )}

          {/* Dependencies */}
          {showDependenciesField && (
            <div className="space-y-2 mb-4">
              <Label className="text-sm font-medium text-blue-900">Dependencies</Label>
              <Select value={formData.dependsOn} onValueChange={(value) => updateFormData('dependsOn', value)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select dependency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No dependency</SelectItem>
                  {existingItemLines
                    .filter(item => item.itemLine !== formData.description)
                    .map((item) => (
                      <SelectItem key={item.itemLine} value={item.itemLine}>
                        {item.itemLine}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Dates */}
          {showDatesFields && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-900">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Select start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-blue-900">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white",
                        !formData.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Select due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={handleDueDateChange}
                      disabled={(date) => formData.startDate ? date < formData.startDate : false}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {formData.startDate && (
                  <p className="text-xs text-blue-700">
                    Due date must be after start date
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="pb-4 border-b border-gray-200 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium text-gray-900">
                Unit
              </Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => updateFormData('unit', e.target.value)}
                placeholder="e.g., m³, pieces, hours, m²"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => updateFormData('quantity', e.target.value)}
                placeholder="e.g., 20"
                className="w-full"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerUnit" className="text-sm font-medium text-gray-900">
                Price per Unit (EUR) *
              </Label>
              <Input
                id="pricePerUnit"
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) => updateFormData('pricePerUnit', e.target.value)}
                placeholder="e.g., 80.00"
                className="w-full"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Estimated Cost (Calculated)
              </Label>
              <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-lg font-bold text-blue-600">
                  {estimatedCost.toFixed(2)} EUR
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Automatically calculated from quantity × price per unit
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedRevenue" className="text-sm font-medium text-gray-900">
                Estimated Revenue (Contract Amount) * (EUR)
              </Label>
              <Input
                id="estimatedRevenue"
                type="number"
                value={formData.estimatedRevenue}
                onChange={(e) => updateFormData('estimatedRevenue', e.target.value)}
                placeholder="0.00"
                className="w-full"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-600">
                Enter the contract amount for this item line
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => updateFormData('status', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
              <p>* Required fields. {isVendorRequired && 'Vendor is required when parent level has no vendor assigned.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex justify-between pt-4 border-t">
        {!editingItem && (
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {editingItem ? 'Update' : 'Create'} Item Line
          </Button>
        </div>
      </div>
    </div>
  );
};
