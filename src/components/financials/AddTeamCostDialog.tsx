// src/components/projects/financials/AddTeamCostDialog.tsx
import { useState, useEffect, useMemo } from "react";
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
import { fetchUsers } from "@/services/api";

interface TeamMemberEntry {
  userRef: string;
  name: string;
  costPerHour: number;
  workedHours: number;
  totalCost: number;
}

interface AddTeamCostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, teamMembers: TeamMemberEntry[]) => void;
  projectRef: string; // in case you later need
}

export const AddTeamCostDialog = ({ isOpen, onClose, onSave }: AddTeamCostDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [teamEntries, setTeamEntries] = useState<TeamMemberEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load users from BE
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const resp = await fetchUsers();
      console.log(resp);
      const users = (resp?.data || []).map((u: any) => ({
        userRef: u.id || u.attributes?.ref,
        name: u.attributes?.fullName || "Unnamed",
        costPerHour: Number(u.attributes?.wagePerHour || 0),
      }));
      setTeamEntries(users.map((u: any) => ({
        userRef: u.userRef,
        name: u.name,
        costPerHour: u.costPerHour,
        workedHours: 0,
        totalCost: 0,
      })));
    })();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(undefined);
      setSearchTerm("");
    }
  }, [isOpen]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  const handleWorkedHoursChange = (userRef: string, hours: string) => {
    const h = parseFloat(hours) || 0;
    setTeamEntries(prev => prev.map(e =>
      e.userRef === userRef ? { ...e, workedHours: h, totalCost: h * e.costPerHour } : e
    ));
  };

  const totalCost = useMemo(() => teamEntries.reduce((s, e) => s + e.totalCost, 0), [teamEntries]);
  const activeMembers = useMemo(() => teamEntries.filter(e => e.workedHours > 0), [teamEntries]);
  const filtered = useMemo(() => teamEntries.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase())), [teamEntries, searchTerm]);



  const handleSave = () => {
    if (!selectedDate || activeMembers.length === 0) return;
    onSave(format(selectedDate, 'yyyy-MM-dd'), activeMembers);
  };

  const canSave = !!selectedDate && activeMembers.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Team Cost Entry</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-[280px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {selectedDate && (
            <>
              <div className="bg-muted/50 p-3 rounded-lg border flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">Date: {format(selectedDate, "MMMM d, yyyy")}</h3>
                  <p className="text-xs text-muted-foreground">Active team members: {activeMembers.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">Total: {formatCurrency(totalCost)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Team Members</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search team members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
                </div>
              </div>

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
                    {filtered.map((e) => (
                      <TableRow key={e.userRef} className="h-12">
                        <TableCell className="py-2 text-sm font-medium">{e.name}</TableCell>
                        <TableCell className="py-2 text-sm">{formatCurrency(e.costPerHour)}</TableCell>
                        <TableCell className="py-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            value={e.workedHours || ""}
                            onChange={(ev) => handleWorkedHoursChange(e.userRef, ev.target.value)}
                            className="w-20 h-8 text-sm"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell className="py-2 text-sm font-medium">{formatCurrency(e.totalCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={!canSave} className="bg-primary">Save Team Cost Entry</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
