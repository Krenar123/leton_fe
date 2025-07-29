
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Supplier, SupplierColumnVisibility } from "@/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  columnVisibility: SupplierColumnVisibility;
}

const SupplierTable = ({ suppliers, columnVisibility }: SupplierTableProps) => {
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

  const handleRowClick = (supplierId: number) => {
    navigate(`/suppliers/${supplierId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-sm w-[200px]">Name</TableHead>
            {columnVisibility.company && <TableHead className="font-semibold text-sm w-[200px]">Company</TableHead>}
            <TableHead className="font-semibold text-sm w-[150px]">Current Projects</TableHead>
            <TableHead className="font-semibold text-sm w-[120px]">Total Projects</TableHead>
            {columnVisibility.totalValue && <TableHead className="font-semibold text-sm w-[120px] text-right">Total Value</TableHead>}
            {columnVisibility.totalPaid && <TableHead className="font-semibold text-sm w-[120px] text-right">Paid</TableHead>}
            {columnVisibility.totalOutstanding && <TableHead className="font-semibold text-sm w-[120px] text-right">Outstanding</TableHead>}
            {columnVisibility.email && <TableHead className="font-semibold text-sm w-[200px]">Email</TableHead>}
            {columnVisibility.phone && <TableHead className="font-semibold text-sm w-[150px]">Phone</TableHead>}
            {columnVisibility.address && <TableHead className="font-semibold text-sm w-[250px]">Address</TableHead>}
            {columnVisibility.firstProject && <TableHead className="font-semibold text-sm w-[120px]">First Project</TableHead>}
            {columnVisibility.lastProject && <TableHead className="font-semibold text-sm w-[120px]">Last Project</TableHead>}
            {columnVisibility.profitability && <TableHead className="font-semibold text-sm w-[100px]">Profit %</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow 
              key={supplier.id} 
              className="hover:bg-slate-50 cursor-pointer transition-colors"
              onClick={() => handleRowClick(supplier.id)}
            >
              <TableCell className="font-medium cursor-pointer text-sm" style={{ color: '#0a1f44' }}>
                {supplier.name}
              </TableCell>
              {columnVisibility.company && <TableCell className="text-sm text-gray-600">{supplier.company}</TableCell>}
              <TableCell className="text-sm text-gray-600">{supplier.currentProjects}</TableCell>
              <TableCell className="text-sm text-gray-600">{supplier.totalProjects}</TableCell>
              {columnVisibility.totalValue && <TableCell className="font-medium text-sm text-right">{formatCurrency(supplier.totalValue)}</TableCell>}
              {columnVisibility.totalPaid && <TableCell className="text-sm text-gray-600 text-right">{formatCurrency(supplier.totalPaid)}</TableCell>}
              {columnVisibility.totalOutstanding && <TableCell className="text-sm text-gray-600 text-right">{formatCurrency(supplier.totalOutstanding)}</TableCell>}
              {columnVisibility.email && <TableCell className="text-sm text-gray-600">{supplier.email}</TableCell>}
              {columnVisibility.phone && <TableCell className="text-sm text-gray-600">{supplier.phone}</TableCell>}
              {columnVisibility.address && <TableCell className="text-sm text-gray-600">{supplier.address}</TableCell>}
              {columnVisibility.firstProject && <TableCell className="text-sm text-gray-600">{formatDate(supplier.firstProject)}</TableCell>}
              {columnVisibility.lastProject && <TableCell className="text-sm text-gray-600">{formatDate(supplier.lastProject)}</TableCell>}
              {columnVisibility.profitability && (
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    supplier.profitability >= 20 
                      ? 'bg-green-100 text-green-800'
                      : supplier.profitability >= 15 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.profitability}%
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierTable;
