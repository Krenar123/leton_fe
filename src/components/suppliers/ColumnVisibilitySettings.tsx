
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SupplierColumnVisibility } from "@/types/supplier";

interface ColumnVisibilitySettingsProps {
  columnVisibility: SupplierColumnVisibility;
  onColumnVisibilityChange: (visibility: SupplierColumnVisibility) => void;
}

const ColumnVisibilitySettings = ({
  columnVisibility,
  onColumnVisibilityChange
}: ColumnVisibilitySettingsProps) => {
  const handleColumnVisibilityChange = (key: keyof SupplierColumnVisibility, value: boolean) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [key]: value
    });
  };

  const columnOptions = [
    { key: 'company' as const, label: 'Company' },
    { key: 'email' as const, label: 'Email' },
    { key: 'phone' as const, label: 'Phone' },
    { key: 'address' as const, label: 'Address' },
    { key: 'totalValue' as const, label: 'Total Value' },
    { key: 'totalPaid' as const, label: 'Paid' },
    { key: 'totalOutstanding' as const, label: 'Outstanding' },
    { key: 'firstProject' as const, label: 'First Project' },
    { key: 'lastProject' as const, label: 'Last Project' },
    { key: 'profitability' as const, label: 'Profitability' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Column Visibility</div>
      
      <div className="space-y-2">
        {columnOptions.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={columnVisibility[key]}
              onCheckedChange={(checked) => handleColumnVisibilityChange(key, !!checked)}
            />
            <Label htmlFor={key} className="text-sm">{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColumnVisibilitySettings;
