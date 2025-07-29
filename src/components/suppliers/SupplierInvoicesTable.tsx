
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock } from "lucide-react";

interface SupplierInvoice {
  id: number;
  reference: string;
  date: string;
  amount: number;
  status: string;
  project: string;
  payments: number;
  outstanding: number;
}

interface SupplierInvoicesTableProps {
  invoices: SupplierInvoice[];
  searchTerm: string;
  invoiceColumns: {
    invoiced: boolean;
    payments: boolean;
    outstanding: boolean;
    dueDate: boolean;
    status: boolean;
  };
}

export const SupplierInvoicesTable = ({
  invoices,
  searchTerm,
  invoiceColumns
}: SupplierInvoicesTableProps) => {
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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-sm w-[200px]">Invoice Reference</TableHead>
            {invoiceColumns.invoiced && <TableHead className="font-semibold text-sm w-[120px] text-right">Invoiced</TableHead>}
            {invoiceColumns.payments && <TableHead className="font-semibold text-sm w-[120px] text-right">Payments</TableHead>}
            {invoiceColumns.outstanding && <TableHead className="font-semibold text-sm w-[120px] text-right">Outstanding</TableHead>}
            {invoiceColumns.dueDate && <TableHead className="font-semibold text-sm w-[120px]">Due Date</TableHead>}
            {invoiceColumns.status && <TableHead className="font-semibold text-sm w-[120px]">Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices
            .filter(invoice => 
              invoice.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
              invoice.project.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-slate-50">
              <TableCell className="font-medium text-sm">{invoice.reference}</TableCell>
              {invoiceColumns.invoiced && <TableCell className="text-right font-medium text-sm">{formatCurrency(invoice.amount)}</TableCell>}
              {invoiceColumns.payments && <TableCell className="text-right text-sm text-gray-600">{formatCurrency(invoice.payments)}</TableCell>}
              {invoiceColumns.outstanding && <TableCell className="text-right text-sm text-gray-600">{formatCurrency(invoice.outstanding)}</TableCell>}
              {invoiceColumns.dueDate && <TableCell className="text-sm text-gray-600">{formatDate(invoice.date)}</TableCell>}
              {invoiceColumns.status && (
                <TableCell>
                  <div className="flex items-center">
                    {invoice.outstanding === 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-green-600 font-medium text-sm">Complete</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-orange-600 font-medium text-sm">In Progress</span>
                      </>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
