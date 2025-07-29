
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ListHeader } from "@/components/common/ListHeader";
import { MeetingsTable } from "./MeetingsTable";
import { MeetingsFilter } from "./MeetingsFilter";
import { MeetingsColumnSettings } from "./MeetingsColumnSettings";
import { useMeetingsData } from "./useMeetingsData";
import { MeetingsTableSettings } from "./types/meetings";

interface MeetingsListDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeetingsListDialog = ({ isOpen, onClose }: MeetingsListDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [personFilter, setPersonFilter] = useState("all");
  const [ourPersonsFilter, setOurPersonsFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [tableSettings, setTableSettings] = useState<MeetingsTableSettings>({
    showName: true,
    showOurPersons: true,
    showDescription: true,
    showProject: true,
    showLocation: true,
  });

  const { meetings, filteredMeetings, uniqueProjects, uniquePersons, uniqueOurPersons } = useMeetingsData();

  const filtered = filteredMeetings(searchTerm, personFilter, ourPersonsFilter, projectFilter, dateFilter);
  const hasActiveFilters = personFilter !== "all" || ourPersonsFilter !== "all" || projectFilter !== "all" || dateFilter !== "all";

  const handleResetFilters = () => {
    setPersonFilter("all");
    setOurPersonsFilter("all");
    setProjectFilter("all");
    setDateFilter("all");
    setSearchTerm("");
  };

  const filterContent = (
    <MeetingsFilter
      personFilter={personFilter}
      setPersonFilter={setPersonFilter}
      ourPersonsFilter={ourPersonsFilter}
      setOurPersonsFilter={setOurPersonsFilter}
      projectFilter={projectFilter}
      setProjectFilter={setProjectFilter}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      uniquePersons={uniquePersons}
      uniqueOurPersons={uniqueOurPersons}
      uniqueProjects={uniqueProjects}
      onReset={handleResetFilters}
    />
  );

  const settingsContent = (
    <MeetingsColumnSettings
      settings={tableSettings}
      onSettingsChange={setTableSettings}
    />
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>All Meetings</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <ListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search meetings..."
            filterContent={filterContent}
            hasActiveFilters={hasActiveFilters}
            settingsContent={settingsContent}
          />

          <div className="flex-1 overflow-auto">
            <MeetingsTable 
              meetings={filtered}
              settings={tableSettings}
              onClose={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
