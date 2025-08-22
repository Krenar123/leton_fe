
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Client, ClientColumnVisibility } from "@/types/client";
import { useNavigate } from "react-router-dom";

interface ClientTableProps {
  clients: Client[];
  columnVisibility: ClientColumnVisibility;
}

const ClientTable = ({ clients, columnVisibility }: ClientTableProps) => {
  
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleClientClick = (clientId: number) => {
    navigate(`/clients/${clientId}`);
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No clients found matching your criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Name</TableHead>
            {columnVisibility.company && <TableHead className="font-semibold">Company</TableHead>}
            {columnVisibility.email && <TableHead className="font-semibold">Email</TableHead>}
            {columnVisibility.phone && <TableHead className="font-semibold">Phone</TableHead>}
            {columnVisibility.address && <TableHead className="font-semibold">Address</TableHead>}
            <TableHead className="font-semibold">Current Projects</TableHead>
            <TableHead className="font-semibold">Total Projects</TableHead>
            {columnVisibility.totalValue && <TableHead className="font-semibold">Total Value</TableHead>}
            {columnVisibility.totalPaid && <TableHead className="font-semibold">Paid</TableHead>}
            {columnVisibility.totalOutstanding && <TableHead className="font-semibold">Outstanding</TableHead>}
            {columnVisibility.firstProject && <TableHead className="font-semibold">First Project</TableHead>}
            {columnVisibility.lastProject && <TableHead className="font-semibold">Last Project</TableHead>}
            {columnVisibility.profitability && <TableHead className="font-semibold">Profit %</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id} 
              className="hover:bg-gray-50/50 cursor-pointer"
              onClick={() => handleClientClick(client.id)}
            >
              <TableCell 
                className="font-medium"
                style={{ color: '#0a1f44' }}
              >
                {client.name}
              </TableCell>
              {columnVisibility.company && (
                <TableCell className="text-gray-600">{client.company}</TableCell>
              )}
              {columnVisibility.email && (
                <TableCell className="text-gray-600">{client.email}</TableCell>
              )}
              {columnVisibility.phone && (
                <TableCell className="text-gray-600">{client.phone}</TableCell>
              )}
              {columnVisibility.address && (
                <TableCell className="text-gray-600">{client.address}</TableCell>
              )}
              <TableCell className="text-gray-600">{client.currentProjects}</TableCell>
              <TableCell className="text-gray-600">{client.totalProjects}</TableCell>
              {columnVisibility.totalValue && (
                <TableCell className="text-gray-900">{formatCurrency(client.totalValue)}</TableCell>
              )}
              {columnVisibility.totalPaid && (
                <TableCell className="text-gray-900">{formatCurrency(client.totalPaid)}</TableCell>
              )}
              {columnVisibility.totalOutstanding && (
                <TableCell className="text-gray-900">{formatCurrency(client.totalOutstanding)}</TableCell>
              )}
              {columnVisibility.firstProject && (
                <TableCell className="text-gray-600">{formatDate(client.firstProject)}</TableCell>
              )}
              {columnVisibility.lastProject && (
                <TableCell className="text-gray-600">{formatDate(client.lastProject)}</TableCell>
              )}
              {columnVisibility.profitability && (
                <TableCell className="text-gray-600">
                  {client.profitability.toFixed(1)}%
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
