
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ClientListSettingsContentProps {
  activeTab: string;
  currentColumns: any;
  onColumnVisibilityChange: (column: string, value: boolean) => void;
}

export const ClientListSettingsContent = ({
  activeTab,
  currentColumns,
  onColumnVisibilityChange
}: ClientListSettingsContentProps) => {
  const getColumnOptions = () => {
    switch (activeTab) {
      case 'projects':
        return [
          { key: 'location', label: 'Location' },
          { key: 'start', label: 'Start Date' },
          { key: 'due', label: 'Due Date' },
          { key: 'value', label: 'Value' },
          { key: 'profitability', label: 'Profitability' },
          { key: 'status', label: 'Status' }
        ];
      case 'bills':
        return [
          { key: 'billed', label: 'Billed Amount' },
          { key: 'payments', label: 'Payments' },
          { key: 'outstanding', label: 'Outstanding' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'status', label: 'Status' }
        ];
      case 'meetings':
        return [
          { key: 'project', label: 'Project' },
          { key: 'ourPersons', label: 'Our Persons' },
          { key: 'description', label: 'Description' },
          { key: 'location', label: 'Location' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' }
        ];
      default:
        return [];
    }
  };

  const columnOptions = getColumnOptions();

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Column Visibility</div>
      
      <div className="space-y-2">
        {columnOptions.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox 
              id={key} 
              checked={currentColumns[key]} 
              onCheckedChange={(checked) => onColumnVisibilityChange(key, !!checked)} 
            />
            <Label htmlFor={key} className="text-sm">{label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
