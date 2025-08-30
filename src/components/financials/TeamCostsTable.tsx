// src/components/projects/financials/TeamCostsTable.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListHeader } from "@/components/common/ListHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AddTeamCostDialog } from "./AddTeamCostDialog";
import { useTeamCostsData } from "@/hooks/useTeamCostsData";

export const TeamCostsTable = ({ projectRef }: { projectRef: string }) => {
  const { groupedByDate, createForDate, refetch } = useTeamCostsData(projectRef);

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: "", dateTo: "",
    teamMin: "", teamMax: "",
    hoursMin: "", hoursMax: "",
    costMin: "", costMax: "",
  });

  const handleAddTeamCost = () => setIsAddDialogOpen(true);

  const handleSaveTeamCost = async (date: string, teamMembers: Array<{ name: string; workedHours: number; costPerHour: number; userRef: string }>) => {
    await createForDate(
      date,
      teamMembers.map(m => ({ user_ref: m.userRef, workedHours: m.workedHours, costPerHour: m.costPerHour }))
    );
    setIsAddDialogOpen(false);
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
  const formatDate = (s: string) => new Date(s).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const toggleRowExpansion = (i: number) => {
    const s = new Set(expandedRows);
    s.has(i) ? s.delete(i) : s.add(i);
    setExpandedRows(s);
  };

  const matchesFilters = (entry: any) => {
    const entryDate = new Date(entry.date);
    if (filters.dateFrom && entryDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && entryDate > new Date(filters.dateTo)) return false;
    if (filters.teamMin && entry.numberOfTeam < +filters.teamMin) return false;
    if (filters.teamMax && entry.numberOfTeam > +filters.teamMax) return false;
    if (filters.hoursMin && entry.workingHours < +filters.hoursMin) return false;
    if (filters.hoursMax && entry.workingHours > +filters.hoursMax) return false;
    if (filters.costMin && entry.totalCost < +filters.costMin) return false;
    if (filters.costMax && entry.totalCost > +filters.costMax) return false;
    return true;
  };

  const filteredData = groupedByDate
    .filter(e =>
      formatDate(e.date).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(e.numberOfTeam).includes(searchTerm) ||
      String(e.workingHours).includes(searchTerm) ||
      String(e.totalCost).includes(searchTerm)
    )
    .filter(matchesFilters);

  const clearFilters = () => setFilters({
    dateFrom: "", dateTo: "", teamMin: "", teamMax: "", hoursMin: "", hoursMax: "", costMin: "", costMax: "",
  });
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const filterContent = (
    <div className="p-4 space-y-4 w-80">
      {/* (same filter UI you already have) */}
      {/* … */}
      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={clearFilters}>Clear Filters</Button>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardContent>
          <ListHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search team costs..."
            filterContent={filterContent}
            hasActiveFilters={hasActiveFilters}
            createButton={{ label: "Add Team Cost", onClick: handleAddTeamCost }}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Number of Team</TableHead>
                <TableHead>Working Hours</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry, index) => (
                <>
                  <TableRow
                    key={`${entry.date}-${index}`}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRowExpansion(index)}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); toggleRowExpansion(index); }}
                        className="p-1 h-6 w-6"
                      >
                        {expandedRows.has(index) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.numberOfTeam}</TableCell>
                    <TableCell>{entry.workingHours}</TableCell>
                    <TableCell>{formatCurrency(entry.totalCost)}</TableCell>
                  </TableRow>

                  {expandedRows.has(index) && (
                    <TableRow key={`${entry.date}-${index}-expanded`}>
                      <TableCell colSpan={5} className="bg-gray-50 p-0">
                        <div className="p-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-sm">Team Member</TableHead>
                                <TableHead className="text-sm">Cost per Hour</TableHead>
                                <TableHead className="text-sm">Working Hours</TableHead>
                                <TableHead className="text-sm">Total Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {entry.teamMembers.map((m, i2) => (
                                <TableRow key={i2} className="text-sm">
                                  <TableCell>{m.name}</TableCell>
                                  <TableCell>{formatCurrency(m.costPerHour)}</TableCell>
                                  <TableCell>{m.workingHours}</TableCell>
                                  <TableCell>{formatCurrency(m.costPerHour * m.workingHours)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTeamCostDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleSaveTeamCost}
        projectRef={projectRef}
      />
    </>
  );
};
