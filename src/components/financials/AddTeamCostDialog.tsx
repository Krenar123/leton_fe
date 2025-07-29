
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TeamMemberEntry {
  id: number;
  name: string;
  costPerHour: number;
  workedHours: number;
  totalCost: number;
}

interface AddTeamCostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, teamMembers: TeamMemberEntry[]) => void;
}

export const AddTeamCostDialog = ({ isOpen, onClose, onSave }: AddTeamCostDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [teamEntries, setTeamEntries] = useState<TeamMemberEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock cost per hour data - in a real app this would come from team member profiles
  const teamMembersCosts = [
    { id: 1, name: "John Smith", costPerHour: 50 },
    { id: 2, name: "Sarah Johnson", costPerHour: 55 },
    { id: 3, name: "Mike Davis", costPerHour: 45 },
    { id: 4, name: "Lisa Chen", costPerHour: 60 },
    { id: 5, name: "Robert Wilson", costPerHour: 40 },
    { id: 6, name: "Emily Brown", costPerHour: 42 },
    { id: 7, name: "David Lee", costPerHour: 48 },
    { id: 8, name: "Maria Garcia", costPerHour: 52 },
    { id: 9, name: "James Taylor", costPerHour: 46 },
    { id: 10, name: "Anna Martinez", costPerHour: 54 },
    { id: 11, name: "Kevin Brown", costPerHour: 44 },
    { id: 12, name: "Sophie Wilson", costPerHour: 58 }
  ];

  useEffect(() => {
    if (isOpen) {
      // Reset all state when dialog opens
      setTeamEntries([]);
      setSelectedDate(undefined);
      setSearchTerm("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedDate) {
      // Initialize team entries when date is selected
      const initialEntries = teamMembersCosts.map(member => ({
        id: member.id,
        name: member.name,
        costPerHour: member.costPerHour,
        workedHours: 0,
        totalCost: 0
      }));
      setTeamEntries(initialEntries);
    }
  }, [selectedDate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleWorkedHoursChange = (memberId: number, hours: string) => {
    const numericHours = parseFloat(hours) || 0;
    setTeamEntries(prev => prev.map(entry => 
      entry.id === memberId 
        ? { ...entry, workedHours: numericHours, totalCost: numericHours * entry.costPerHour }
        : entry
    ));
  };

  const getTotalCost = () => {
    return teamEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
  };

  const getActiveTeamMembers = () => {
    return teamEntries.filter(entry => entry.workedHours > 0);
  };

  const filteredTeamEntries = teamEntries.filter(entry =>
    entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedDate) return;
    
    const activeMembers = getActiveTeamMembers();
    if (activeMembers.length === 0) return;

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    onSave(formattedDate, activeMembers);
    onClose();
  };

  const canSave = selectedDate && getActiveTeamMembers().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Team Cost Entry</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Team Members Section - Only show when date is selected */}
          {selectedDate && (
            <>
              {/* Summary */}
              <div className="bg-muted/50 p-3 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-sm">
                      Date: {format(selectedDate, "MMMM d, yyyy")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Active team members: {getActiveTeamMembers().length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      Total: {formatCurrency(getTotalCost())}
                    </p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Team Members</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>

              {/* Team Members Table */}
              <div className="flex-1 overflow-auto border rounded-lg">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="h-10 text-xs">Team Member</TableHead>
                      <TableHead className="h-10 text-xs">Cost/Hour</TableHead>
                      <TableHead className="h-10 text-xs">Hours</TableHead>
                      <TableHead className="h-10 text-xs">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeamEntries.map((entry) => (
                      <TableRow key={entry.id} className="h-12">
                        <TableCell className="py-2 font-medium text-sm">{entry.name}</TableCell>
                        <TableCell className="py-2 text-sm">{formatCurrency(entry.costPerHour)}</TableCell>
                        <TableCell className="py-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={entry.workedHours || ''}
                            onChange={(e) => handleWorkedHoursChange(entry.id, e.target.value)}
                            className="w-20 h-8 text-sm"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell className="py-2 text-sm font-medium">{formatCurrency(entry.totalCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!canSave}
              className="bg-primary"
            >
              Save Team Cost Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
