import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListHeader } from "@/components/common/ListHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AddTeamCostDialog } from "./AddTeamCostDialog";
interface TeamMember {
  name: string;
  workingHours: number;
  costPerHour: number;
}
interface TeamCostEntry {
  date: string;
  numberOfTeam: number;
  workingHours: number;
  totalCost: number;
  teamMembers: TeamMember[];
}
interface FilterState {
  dateFrom: string;
  dateTo: string;
  teamMin: string;
  teamMax: string;
  hoursMin: string;
  hoursMax: string;
  costMin: string;
  costMax: string;
}
export const TeamCostsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Initial mock data
  const initialTeamCostData: TeamCostEntry[] = [{
    date: '2024-01-15',
    numberOfTeam: 8,
    workingHours: 64,
    totalCost: 3200,
    teamMembers: [{
      name: "John Smith",
      workingHours: 8,
      costPerHour: 50
    }, {
      name: "Sarah Johnson",
      workingHours: 8,
      costPerHour: 55
    }, {
      name: "Mike Davis",
      workingHours: 8,
      costPerHour: 45
    }, {
      name: "Lisa Chen",
      workingHours: 8,
      costPerHour: 60
    }, {
      name: "Robert Wilson",
      workingHours: 8,
      costPerHour: 40
    }, {
      name: "Emily Brown",
      workingHours: 8,
      costPerHour: 42
    }, {
      name: "David Lee",
      workingHours: 8,
      costPerHour: 48
    }, {
      name: "Maria Garcia",
      workingHours: 8,
      costPerHour: 52
    }]
  }, {
    date: '2024-01-16',
    numberOfTeam: 10,
    workingHours: 80,
    totalCost: 4000,
    teamMembers: [{
      name: "John Smith",
      workingHours: 8,
      costPerHour: 50
    }, {
      name: "Sarah Johnson",
      workingHours: 8,
      costPerHour: 55
    }, {
      name: "Mike Davis",
      workingHours: 8,
      costPerHour: 45
    }, {
      name: "Lisa Chen",
      workingHours: 8,
      costPerHour: 60
    }, {
      name: "Robert Wilson",
      workingHours: 8,
      costPerHour: 40
    }, {
      name: "Emily Brown",
      workingHours: 8,
      costPerHour: 42
    }, {
      name: "David Lee",
      workingHours: 8,
      costPerHour: 48
    }, {
      name: "Maria Garcia",
      workingHours: 8,
      costPerHour: 52
    }, {
      name: "James Taylor",
      workingHours: 8,
      costPerHour: 46
    }, {
      name: "Anna Martinez",
      workingHours: 8,
      costPerHour: 54
    }]
  }, {
    date: '2024-01-17',
    numberOfTeam: 12,
    workingHours: 96,
    totalCost: 4800,
    teamMembers: [{
      name: "John Smith",
      workingHours: 8,
      costPerHour: 50
    }, {
      name: "Sarah Johnson",
      workingHours: 8,
      costPerHour: 55
    }, {
      name: "Mike Davis",
      workingHours: 8,
      costPerHour: 45
    }, {
      name: "Lisa Chen",
      workingHours: 8,
      costPerHour: 60
    }, {
      name: "Robert Wilson",
      workingHours: 8,
      costPerHour: 40
    }, {
      name: "Emily Brown",
      workingHours: 8,
      costPerHour: 42
    }, {
      name: "David Lee",
      workingHours: 8,
      costPerHour: 48
    }, {
      name: "Maria Garcia",
      workingHours: 8,
      costPerHour: 52
    }, {
      name: "James Taylor",
      workingHours: 8,
      costPerHour: 46
    }, {
      name: "Anna Martinez",
      workingHours: 8,
      costPerHour: 54
    }, {
      name: "Kevin Brown",
      workingHours: 8,
      costPerHour: 44
    }, {
      name: "Sophie Wilson",
      workingHours: 8,
      costPerHour: 58
    }]
  }, {
    date: '2024-01-18',
    numberOfTeam: 9,
    workingHours: 72,
    totalCost: 3600,
    teamMembers: [{
      name: "John Smith",
      workingHours: 8,
      costPerHour: 50
    }, {
      name: "Sarah Johnson",
      workingHours: 8,
      costPerHour: 55
    }, {
      name: "Mike Davis",
      workingHours: 8,
      costPerHour: 45
    }, {
      name: "Lisa Chen",
      workingHours: 8,
      costPerHour: 60
    }, {
      name: "Robert Wilson",
      workingHours: 8,
      costPerHour: 40
    }, {
      name: "Emily Brown",
      workingHours: 8,
      costPerHour: 42
    }, {
      name: "David Lee",
      workingHours: 8,
      costPerHour: 48
    }, {
      name: "Maria Garcia",
      workingHours: 8,
      costPerHour: 52
    }, {
      name: "James Taylor",
      workingHours: 8,
      costPerHour: 46
    }]
  }, {
    date: '2024-01-19',
    numberOfTeam: 11,
    workingHours: 88,
    totalCost: 4400,
    teamMembers: [{
      name: "John Smith",
      workingHours: 8,
      costPerHour: 50
    }, {
      name: "Sarah Johnson",
      workingHours: 8,
      costPerHour: 55
    }, {
      name: "Mike Davis",
      workingHours: 8,
      costPerHour: 45
    }, {
      name: "Lisa Chen",
      workingHours: 8,
      costPerHour: 60
    }, {
      name: "Robert Wilson",
      workingHours: 8,
      costPerHour: 40
    }, {
      name: "Emily Brown",
      workingHours: 8,
      costPerHour: 42
    }, {
      name: "David Lee",
      workingHours: 8,
      costPerHour: 48
    }, {
      name: "Maria Garcia",
      workingHours: 8,
      costPerHour: 52
    }, {
      name: "James Taylor",
      workingHours: 8,
      costPerHour: 46
    }, {
      name: "Anna Martinez",
      workingHours: 8,
      costPerHour: 54
    }, {
      name: "Kevin Brown",
      workingHours: 8,
      costPerHour: 44
    }]
  }];
  const [teamCostData, setTeamCostData] = useState<TeamCostEntry[]>(initialTeamCostData);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    teamMin: '',
    teamMax: '',
    hoursMin: '',
    hoursMax: '',
    costMin: '',
    costMax: ''
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };
  const handleAddTeamCost = () => {
    setIsAddDialogOpen(true);
  };
  const handleSaveTeamCost = (date: string, teamMembers: any[]) => {
    // Create new team cost entry
    const newEntry: TeamCostEntry = {
      date,
      numberOfTeam: teamMembers.length,
      workingHours: teamMembers.reduce((sum, member) => sum + member.workedHours, 0),
      totalCost: teamMembers.reduce((sum, member) => sum + member.totalCost, 0),
      teamMembers: teamMembers.map(member => ({
        name: member.name,
        workingHours: member.workedHours,
        costPerHour: member.costPerHour
      }))
    };

    // Add new entry to the beginning of the list (most recent first)
    setTeamCostData(prev => [newEntry, ...prev]);
    console.log("New team cost entry added:", newEntry);
  };
  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      teamMin: '',
      teamMax: '',
      hoursMin: '',
      hoursMax: '',
      costMin: '',
      costMax: ''
    });
  };
  const hasActiveFilters = filters.dateFrom !== '' || filters.dateTo !== '' || filters.teamMin !== '' || filters.teamMax !== '' || filters.hoursMin !== '' || filters.hoursMax !== '' || filters.costMin !== '' || filters.costMax !== '';
  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };
  const filteredData = teamCostData.filter(entry => {
    const matchesSearch = formatDate(entry.date).toLowerCase().includes(searchTerm.toLowerCase()) || entry.numberOfTeam.toString().includes(searchTerm) || entry.workingHours.toString().includes(searchTerm) || entry.totalCost.toString().includes(searchTerm);
    if (!matchesSearch) return false;
    const entryDate = new Date(entry.date);
    if (filters.dateFrom && entryDate < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && entryDate > new Date(filters.dateTo)) return false;
    if (filters.teamMin && entry.numberOfTeam < parseInt(filters.teamMin)) return false;
    if (filters.teamMax && entry.numberOfTeam > parseInt(filters.teamMax)) return false;
    if (filters.hoursMin && entry.workingHours < parseInt(filters.hoursMin)) return false;
    if (filters.hoursMax && entry.workingHours > parseInt(filters.hoursMax)) return false;
    if (filters.costMin && entry.totalCost < parseInt(filters.costMin)) return false;
    if (filters.costMax && entry.totalCost < parseInt(filters.costMax)) return false;
    return true;
  });
  const filterContent = <div className="p-4 space-y-4 w-80">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Date Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">From</Label>
            <Input type="date" value={filters.dateFrom} onChange={e => setFilters(prev => ({
            ...prev,
            dateFrom: e.target.value
          }))} className="text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">To</Label>
            <Input type="date" value={filters.dateTo} onChange={e => setFilters(prev => ({
            ...prev,
            dateTo: e.target.value
          }))} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Number of Team</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Min</Label>
            <Input type="number" value={filters.teamMin} onChange={e => setFilters(prev => ({
            ...prev,
            teamMin: e.target.value
          }))} className="text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max</Label>
            <Input type="number" value={filters.teamMax} onChange={e => setFilters(prev => ({
            ...prev,
            teamMax: e.target.value
          }))} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Working Hours</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Min</Label>
            <Input type="number" value={filters.hoursMin} onChange={e => setFilters(prev => ({
            ...prev,
            hoursMin: e.target.value
          }))} className="text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max</Label>
            <Input type="number" value={filters.hoursMax} onChange={e => setFilters(prev => ({
            ...prev,
            hoursMax: e.target.value
          }))} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Total Cost</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Min</Label>
            <Input type="number" value={filters.costMin} onChange={e => setFilters(prev => ({
            ...prev,
            costMin: e.target.value
          }))} className="text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max</Label>
            <Input type="number" value={filters.costMax} onChange={e => setFilters(prev => ({
            ...prev,
            costMax: e.target.value
          }))} className="text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>;
  return <>
      <Card>
        
        <CardContent>
          <ListHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search team costs..." filterContent={filterContent} hasActiveFilters={hasActiveFilters} createButton={{
          label: "Add Team Cost",
          onClick: handleAddTeamCost
        }} />
          
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
              {filteredData.map((entry, index) => <>
                  <TableRow key={`${entry.date}-${index}`} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRowExpansion(index)}>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={e => {
                    e.stopPropagation();
                    toggleRowExpansion(index);
                  }} className="p-1 h-6 w-6">
                        {expandedRows.has(index) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.numberOfTeam}</TableCell>
                    <TableCell>{entry.workingHours}</TableCell>
                    <TableCell>{formatCurrency(entry.totalCost)}</TableCell>
                  </TableRow>
                  {expandedRows.has(index) && <TableRow key={`${entry.date}-${index}-expanded`}>
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
                              {entry.teamMembers.map((member, memberIndex) => <TableRow key={memberIndex} className="text-sm">
                                  <TableCell>{member.name}</TableCell>
                                  <TableCell>{formatCurrency(member.costPerHour)}</TableCell>
                                  <TableCell>{member.workingHours}</TableCell>
                                  <TableCell>{formatCurrency(member.costPerHour * member.workingHours)}</TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>}
                </>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddTeamCostDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onSave={handleSaveTeamCost} />
    </>;
};