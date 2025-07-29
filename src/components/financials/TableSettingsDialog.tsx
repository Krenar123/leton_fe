
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TableDisplaySettings, ViewMode } from "@/types/financials";

interface TableSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TableDisplaySettings;
  onSettingsChange: (settings: TableDisplaySettings) => void;
  viewMode: ViewMode;
}

export const TableSettingsDialog = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  viewMode 
}: TableSettingsDialogProps) => {
  // Map viewMode to TableDisplaySettings keys
  const getViewModeKey = (viewMode: ViewMode): keyof TableDisplaySettings => {
    switch (viewMode) {
      case 'contract-amounts':
        return 'contractAmounts';
      case 'invoiced-paid':
        return 'invoicedPaid';
      case 'costs-bills':
        return 'costsBills';
      case 'cost-tracking':
        return 'costTracking';
      default:
        return 'contractAmounts';
    }
  };

  const handleSettingChange = (settingKey: string, value: boolean) => {
    const viewModeKey = getViewModeKey(viewMode);
    onSettingsChange({
      ...settings,
      [viewModeKey]: {
        ...settings[viewModeKey],
        [settingKey]: value
      }
    });
  };

  const getSettingsForViewMode = () => {
    switch (viewMode) {
      case 'contract-amounts':
        return [
          { key: 'showContractor', label: 'Show Contractor' },
          { key: 'showStartDate', label: 'Show Start Date' },
          { key: 'showDueDate', label: 'Show Due Date' },
          { key: 'showDependencies', label: 'Show Dependencies' },
          { key: 'showChangeOrders', label: 'Show Number of Change Orders' },
        ];
      case 'invoiced-paid':
        return [
          { key: 'showContractor', label: 'Show Contractor' },
          { key: 'showBalance', label: 'Show Balance' },
          { key: 'showStartDate', label: 'Show Start Date' },
          { key: 'showDueDate', label: 'Show Due Date' },
          { key: 'showDependencies', label: 'Show Dependencies' },
          { key: 'showChangeOrders', label: 'Show Change Orders' },
        ];
      case 'costs-bills':
      case 'cost-tracking':
        return [
          { key: 'showContractor', label: 'Show Contractor' },
          { key: 'showVendor', label: 'Show Vendor' },
          { key: 'showUnit', label: 'Show Unit' },
          { key: 'showQuantity', label: 'Show Quantity' },
          { key: 'showUnitPrice', label: 'Show Unit Price' },
          { key: 'showBalance', label: 'Show Balance' },
          { key: 'showStartDate', label: 'Show Start Date' },
          { key: 'showDueDate', label: 'Show Due Date' },
          { key: 'showDependencies', label: 'Show Dependencies' },
          { key: 'showChangeOrders', label: 'Show Change Orders' },
        ];
      default:
        return [];
    }
  };

  const viewModeKey = getViewModeKey(viewMode);
  const currentViewModeSettings = settings[viewModeKey];
  const availableSettings = getSettingsForViewMode();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Column Display Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {availableSettings.map((setting) => (
            <div key={setting.key} className="flex items-center justify-between">
              <Label htmlFor={setting.key} className="text-sm font-medium">
                {setting.label}
              </Label>
              <Switch
                id={setting.key}
                checked={currentViewModeSettings[setting.key] || false}
                onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
