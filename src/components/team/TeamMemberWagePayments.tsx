import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search } from "lucide-react";

interface WagePaymentData {
  id: string;
  projectName: string;
  month: string;
  year: number;
  hoursWorked: number;
  wagePerHour: number;
  totalEarned: number;
  amountPaid: number;
  status: 'paid' | 'pending' | 'partial';
}

interface TeamMemberWagePaymentsProps {
  memberId: number;
}

const mockWageData: WagePaymentData[] = [
  {
    id: "1",
    projectName: "Downtown Office Complex",
    month: "December",
    year: 2024,
    hoursWorked: 160,
    wagePerHour: 45,
    totalEarned: 7200,
    amountPaid: 7200,
    status: 'paid'
  },
  {
    id: "2", 
    projectName: "Residential Tower",
    month: "December",
    year: 2024,
    hoursWorked: 80,
    wagePerHour: 45,
    totalEarned: 3600,
    amountPaid: 0,
    status: 'pending'
  },
  {
    id: "3",
    projectName: "Shopping Mall Renovation",
    month: "November",
    year: 2024,
    hoursWorked: 120,
    wagePerHour: 45,
    totalEarned: 5400,
    amountPaid: 2700,
    status: 'partial'
  }
];

export const TeamMemberWagePayments = ({ memberId }: TeamMemberWagePaymentsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("2024");

  const filteredData = mockWageData.filter(item => {
    const matchesSearch = item.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = selectedMonth === "all" || item.month.toLowerCase() === selectedMonth.toLowerCase();
    const matchesYear = item.year.toString() === selectedYear;
    return matchesSearch && matchesMonth && matchesYear;
  });

  const totals = filteredData.reduce((acc, item) => ({
    hours: acc.hours + item.hoursWorked,
    earned: acc.earned + item.totalEarned,
    paid: acc.paid + item.amountPaid
  }), { hours: 0, earned: 0, paid: 0 });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-red-100 text-red-800">Pending</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Hours</p>
              <p className="text-2xl font-bold">{totals.hours}h</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-2xl font-bold">${totals.earned.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-2xl font-bold">${totals.paid.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="august">August</SelectItem>
                <SelectItem value="september">September</SelectItem>
                <SelectItem value="october">October</SelectItem>
                <SelectItem value="november">November</SelectItem>
                <SelectItem value="december">December</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Rate/Hour</TableHead>
                  <TableHead className="text-right">Total Earned</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.projectName}</TableCell>
                    <TableCell>{item.month} {item.year}</TableCell>
                    <TableCell className="text-right">{item.hoursWorked}h</TableCell>
                    <TableCell className="text-right">${item.wagePerHour}</TableCell>
                    <TableCell className="text-right font-medium">${item.totalEarned.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.amountPaid.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No wage records found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};