import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EstimateActualItem } from "@/types/financials";
import { DialogState } from "../ItemLineDialog";
import { VendorCombobox } from "@/components/common/VendorCombobox";

interface FormStepProps {
  dialogState: DialogState;
  setDialogState: (state: DialogState | ((prev: DialogState) => DialogState)) => void;
  existingItemLines: EstimateActualItem[];
  editingItem?: EstimateActualItem;
  onSave: (itemLine: any) => void;
  onBack: () => void;
  onClose: () => void;
}

type VendorChoice =
  | string
  | {
      ref?: string;         // supplier ref when chosen from list
      label: string;        // supplier name
      value?: string;       // optional (some comboboxes use value)
      isNew?: boolean;      // created on the fly
    };

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

  // Does selected parent already carry a vendor?
  const hasParentVendor = () => {
    if (actionType === "add-main-category" || actionType === "add-vendor") return false;

    if (actionType === "add-category" && selectedLevel1) {
      const parentItem = existingItemLines.find((item) => item.parent_id === selectedLevel1);
      return !!(parentItem?.contractor || (parentItem as any)?.vendor);
    }

    if (actionType === "add-item-line" && selectedLevel2) {
      const parentItem = existingItemLines.find((item) => item.parent_id === selectedLevel2);
      return !!(parentItem?.contractor || (parentItem as any)?.vendor);
    }

    return false;
  };

  const updateFormData = (field: keyof DialogState["formData"], value: any) => {
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value
      }
    }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    updateFormData("start_date", date);
    if (date && formData.due_date && formData.due_date < date) {
      updateFormData("due_date", undefined);
    }
  };

  const handleDueDateChange = (date: Date | undefined) => {
    if (date && formData.start_date && date < formData.start_date) return;
    updateFormData("due_date", date);
  };

  const handleVendorChange = (choice: VendorChoice) => {
    if (typeof choice === "string") {
      // user typed a brand-new vendor
      updateFormData("vendor", choice);
      // clear supplier_ref; BE will create from name
      updateFormData("supplier_ref" as any, undefined);
    } else {
      // user selected from list
      updateFormData("vendor", choice.label);
      updateFormData("supplier_ref" as any, choice.ref || undefined);
    }
  };

  const handleSave = () => {
    if (!formData.description || estimatedCost <= 0 || !formData.estimated_revenue) return;

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
    };

    // vendor requirement (if parent doesn't have one and we're not in "add-vendor" we still need a vendor)
    const parentVendorExists = hasParentVendor();
    const isVendorRequired = actionType === "add-vendor" || !parentVendorExists;
    if (isVendorRequired && !formData.vendor.trim()) return;

    // final payload to BE
    onSave({
      ...(editingItem?.ref ? { ref: editingItem.ref } : {}),
      item_line: formData.description,
      contractor: formData.vendor || undefined,                     // string name (for create-on-the-fly)
      supplier_ref: (formData as any).supplier_ref || undefined,    // when existing supplier selected
      unit: formData.unit,
      quantity: parseFloat(formData.quantity) || 0,
      unit_price: parseFloat(formData.pricePerUnit) || 0,
      estimated_cost: estimatedCost,
      estimated_revenue: parseFloat(formData.estimated_revenue),
      start_date: formData.start_date ? formData.start_date.toISOString() : undefined,
      due_date: formData.due_date ? formData.due_date.toISOString() : undefined,
      depends_on: formData.depends_on === "none" ? undefined : formData.depends_on,
      status: formData.status,
      actionType,
      selectedLevel1,
      selectedLevel2,
      selectedLevel3,
      parent_id: getParentId()
    });

    onClose();
  };

  const parentHasVendor = hasParentVendor();
  const isVendorRequired = actionType === "add-vendor" || !parentHasVendor;
  const isFormValid =
    formData.description.trim() &&
    estimatedCost > 0 &&
    formData.estimated_revenue &&
    (!isVendorRequired || formData.vendor.trim()) &&
    (!formData.start_date || !formData.due_date || formData.due_date >= formData.start_date);

  const showDescriptionField = actionType !== "add-vendor";
  const showDependenciesField = actionType === "add-item-line";
  const showVendorField = actionType === "add-vendor" || !parentHasVendor;
  const showDatesFields = actionType !== "add-vendor";

  const getVendorFieldLabel = () => {
    if (actionType === "add-vendor") return "Vendor Name *";
    return parentHasVendor ? "Vendor (Optional - inherited from parent)" : "Vendor *";
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
                Title *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Detailed description of the work item"
                className="w-full min-h-[80px] bg-white"
              />
            </div>
          )}

          {/* Vendor (Creatable dropdown) */}
          {showVendorField && (
            <div className="space-y-2 mb-4">
              <Label htmlFor="vendor" className="text-sm font-medium text-blue-900">
                {getVendorFieldLabel()}
              </Label>

              <VendorCombobox
                value={formData.vendor}
                onChange={handleVendorChange}
                placeholder="e.g., ABC Construction, ElectroMax Ltd"
                autoCreate={true}
              />

              {parentHasVendor && actionType !== "add-vendor" && (
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
              <Select
                value={formData.depends_on}
                onValueChange={(value) => updateFormData("depends_on", value as any)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select dependency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No dependency</SelectItem>
                  {existingItemLines
                    .filter((item) => item.itemLine !== formData.description)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id as any}>
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
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? (
                        format(formData.start_date, "PPP")
                      ) : (
                        <span>Select start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
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
                        !formData.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? (
                        format(formData.due_date, "PPP")
                      ) : (
                        <span>Select due date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={handleDueDateChange}
                      disabled={(date) => (formData.start_date ? date < formData.start_date : false)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {formData.start_date && (
                  <p className="text-xs text-blue-700">Due date must be after start date</p>
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
                onChange={(e) => updateFormData("unit", e.target.value)}
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
                onChange={(e) => updateFormData("quantity", e.target.value)}
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
                onChange={(e) => updateFormData("pricePerUnit", e.target.value)}
                placeholder="e.g., 80.00"
                className="w-full"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Estimated Cost (Calculated)</Label>
              <div className="flex items-center p-3 bg-blue-50 rounded-md border border-blue-200">
                <span className="text-lg font-bold text-blue-600">{estimatedCost.toFixed(2)} EUR</span>
              </div>
              <p className="text-xs text-gray-600">Automatically calculated from quantity × price per unit</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_revenue" className="text-sm font-medium text-gray-900">
                Estimated Revenue (Contract Amount) * (EUR)
              </Label>
              <Input
                id="estimated_revenue"
                type="number"
                value={formData.estimated_revenue}
                onChange={(e) => updateFormData("estimated_revenue", e.target.value)}
                placeholder="0.00"
                className="w-full"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-600">Enter the contract amount for this item line</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => updateFormData("status", value)}
              >
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
              <p>
                * Required fields.{" "}
                {isVendorRequired && "Vendor is required when parent level has no vendor assigned."}
              </p>
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
            {editingItem ? "Update" : "Create"} Item Line
          </Button>
        </div>
      </div>
    </div>
  );
};
