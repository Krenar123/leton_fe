
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { ColumnVisibility } from "./types";

interface DueDatesColumnSettingsProps {
  columnVisibility: ColumnVisibility;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
}

export const DueDatesColumnSettings = ({
  columnVisibility,
  onColumnVisibilityChange
}: DueDatesColumnSettingsProps) => {
  return (
    <>
      <DropdownMenuCheckboxItem
        checked={columnVisibility.projectName}
        onCheckedChange={(checked) => 
          onColumnVisibilityChange({ ...columnVisibility, projectName: checked })
        }
      >
        Project
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={columnVisibility.start}
        onCheckedChange={(checked) => 
          onColumnVisibilityChange({ ...columnVisibility, start: checked })
        }
      >
        Start
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={columnVisibility.due}
        onCheckedChange={(checked) => 
          onColumnVisibilityChange({ ...columnVisibility, due: checked })
        }
      >
        Due
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={columnVisibility.participants}
        onCheckedChange={(checked) => 
          onColumnVisibilityChange({ ...columnVisibility, participants: checked })
        }
      >
        Participants
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={columnVisibility.status}
        onCheckedChange={(checked) => 
          onColumnVisibilityChange({ ...columnVisibility, status: checked })
        }
      >
        Status
      </DropdownMenuCheckboxItem>
    </>
  );
};
