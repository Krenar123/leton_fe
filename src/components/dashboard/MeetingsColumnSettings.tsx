
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MeetingsTableSettings } from "./types/meetings";

interface MeetingsColumnSettingsProps {
  settings: MeetingsTableSettings;
  onSettingsChange: (settings: MeetingsTableSettings) => void;
}

export const MeetingsColumnSettings = ({
  settings,
  onSettingsChange
}: MeetingsColumnSettingsProps) => {
  const handleSettingChange = (key: keyof MeetingsTableSettings, value: boolean) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Column Visibility</div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showName"
            checked={settings.showName}
            onCheckedChange={(checked) => handleSettingChange("showName", !!checked)}
          />
          <Label htmlFor="showName" className="text-sm">Person</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showOurPersons"
            checked={settings.showOurPersons}
            onCheckedChange={(checked) => handleSettingChange("showOurPersons", !!checked)}
          />
          <Label htmlFor="showOurPersons" className="text-sm">Our Persons</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showDescription"
            checked={settings.showDescription}
            onCheckedChange={(checked) => handleSettingChange("showDescription", !!checked)}
          />
          <Label htmlFor="showDescription" className="text-sm">Description</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showProject"
            checked={settings.showProject}
            onCheckedChange={(checked) => handleSettingChange("showProject", !!checked)}
          />
          <Label htmlFor="showProject" className="text-sm">Project</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showLocation"
            checked={settings.showLocation}
            onCheckedChange={(checked) => handleSettingChange("showLocation", !!checked)}
          />
          <Label htmlFor="showLocation" className="text-sm">Location</Label>
        </div>
      </div>
    </div>
  );
};
