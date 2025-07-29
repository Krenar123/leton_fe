
import { Checkbox } from "@/components/ui/checkbox";
import { ReportColumnVisibility } from "./types";

interface ReportsColumnSettingsProps {
  columnVisibility: ReportColumnVisibility;
  onColumnVisibilityChange: (visibility: ReportColumnVisibility) => void;
}

export const ReportsColumnSettings = ({
  columnVisibility,
  onColumnVisibilityChange
}: ReportsColumnSettingsProps) => {
  const handleColumnToggle = (key: keyof ReportColumnVisibility, checked: boolean) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [key]: checked
    });
  };

  const getColumnLabel = (key: string) => {
    switch (key) {
      case 'createdAt':
        return 'Created Date';
      case 'lastRun':
        return 'Last Run';
      case 'createdBy':
        return 'Created By';
      case 'projectName':
        return 'Project Name';
      case 'includedSections':
        return 'Included Sections';
      default:
        return key;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Customize Columns</h4>
      <div className="space-y-3">
        {Object.entries(columnVisibility).map(([key, visible]) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox 
              id={key} 
              checked={Boolean(visible)} 
              onCheckedChange={(checked) => handleColumnToggle(key as keyof ReportColumnVisibility, Boolean(checked))} 
            />
            <label htmlFor={key} className="text-sm capitalize">
              {getColumnLabel(key)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
