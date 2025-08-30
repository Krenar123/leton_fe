import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, ChevronDown, ChevronRight, MoreHorizontal, Eye, Download, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientPaymentsDocumentsDialog } from "./ClientPaymentsDocumentsDialog";

interface ClientInvoice {
  id: number;
  reference: string;
  date: string;
  amount: number;
  status: string;
  project: string;
  payments: number;
  outstanding: number;
}

interface ClientInvoicesTableProps {
  invoices: ClientInvoice[];
  searchTerm: string;
  invoiceColumns: {
    billed: boolean;
    payments: boolean;
    outstanding: boolean;
    dueDate: boolean;
    status: boolean;
  };
}

export const ClientInvoicesTable = ({
  invoices,
  searchTerm,
  invoiceColumns
}: ClientInvoicesTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isPaymentsDialogOpen, setIsPaymentsDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
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

  // Calculate due date (30 days from invoice date for this example)
  const getDueDate = (invoiceDate: string) => {
    const date = new Date(invoiceDate);
    date.setDate(date.getDate() + 30);
    return date;
  };

  const toggleRowExpansion = (invoiceId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(invoiceId)) {
      newExpandedRows.delete(invoiceId);
    } else {
      newExpandedRows.add(invoiceId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleRowClick = (invoice: ClientInvoice) => {
    // Convert ClientInvoice to the format expected by ClientPaymentsDocumentsDialog
    const invoiceFormat = {
      id: invoice.id,
      invoiceNr: `INV-${invoice.id.toString().padStart(4, '0')}`,
      invoiceSubject: invoice.reference,
      project: invoice.project,
      billed: invoice.amount,
      paid: invoice.payments,
      outstanding: invoice.outstanding,
      invoiceDate: invoice.date,
      dueDate: getDueDate(invoice.date).toISOString().split('T')[0],
      status: invoice.status
    };
    setSelectedInvoice(invoiceFormat);
    setIsPaymentsDialogOpen(true);
  };

  // Mock payment transactions for demonstration
  const getPaymentTransactions = (invoiceId: number) => [
    { id: 1, amount: 2500, date: '2024-01-15', method: 'Bank Transfer' },
    { id: 2, amount: 1500, date: '2024-02-10', method: 'Check' },
  ];

  const handleSeeInvoice = (invoice: ClientInvoice) => {
    const invoiceUrl = `/api/invoices/${invoice.id}/pdf`;
    window.open(invoiceUrl, '_blank');
    console.log('Opening invoice PDF for:', `INV-${invoice.id.toString().padStart(4, '0')}`);
  };

  const handleDownloadInvoice = (invoice: ClientInvoice) => {
    const invoiceUrl = `/api/invoices/${invoice.id}/pdf`;
    const link = document.createElement('a');
    link.href = invoiceUrl;
    link.download = `Invoice-${invoice.id.toString().padStart(4, '0')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading invoice PDF for:', `INV-${invoice.id.toString().padStart(4, '0')}`);
  };

  const handleSeePayments = (invoice: ClientInvoice) => {
    // Convert ClientInvoice to SupplierInvoice format for the dialog
    const supplierInvoiceFormat = {
      id: invoice.id,
      invoiceNr: `INV-${invoice.id.toString().padStart(4, '0')}`,
      invoiceSubject: invoice.reference,
      project: invoice.project,
      billed: invoice.amount,
      paid: invoice.payments,
      outstanding: invoice.outstanding,
      invoiceDate: invoice.date,
      dueDate: getDueDate(invoice.date).toISOString().split('T')[0],
      status: invoice.status
    };
    setSelectedInvoice(supplierInvoiceFormat);
    setIsPaymentsDialogOpen(true);
  };

  const handleGoToProject = (invoice: ClientInvoice) => {
    // Navigate to the financials page of the project
    // Using project name to derive project ID (in real app, you'd have project ID)
    const projectId = invoice.project.toLowerCase().replace(/\s+/g, '-');
    navigate(`/projects/${projectId}/financials`);
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRowShadowClass = (invoiceId: number, index: number) => {
    const isExpanded = expandedRows.has(invoiceId);
    const nextInvoice = filteredInvoices[index + 1];
    const isNextExpanded = nextInvoice ? expandedRows.has(nextInvoice.id) : false;
    
    if (isExpanded) {
      return "shadow-[0_2px_4px_rgba(0,0,0,0.1)]";
    }
    if (isNextExpanded) {
      return "shadow-[0_-2px_4px_rgba(0,0,0,0.1)]";
    }
    return "";
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-sm w-[120px]">Invoice Nr.</TableHead>
              <TableHead className="font-semibold text-sm w-[200px]">Invoice Subject</TableHead>
              <TableHead className="font-semibold text-sm w-[150px]">Project</TableHead>
              <TableHead className="font-semibold text-sm w-[150px] text-right">Revised Contract Amount</TableHead>
              {invoiceColumns.billed && <TableHead className="font-semibold text-sm w-[120px] text-right">Invoiced</TableHead>}
              {invoiceColumns.payments && <TableHead className="font-semibold text-sm w-[120px] text-right">Payments Received</TableHead>}
              {invoiceColumns.outstanding && <TableHead className="font-semibold text-sm w-[120px] text-right">Outstanding</TableHead>}
              <TableHead className="font-semibold text-sm w-[100px]">Date</TableHead>
              {invoiceColumns.dueDate && <TableHead className="font-semibold text-sm w-[100px]">Due Date</TableHead>}
              {invoiceColumns.status && <TableHead className="font-semibold text-sm w-[80px] text-center">Status</TableHead>}
              <TableHead className="font-semibold text-sm w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice, index) => (
              <>
                <TableRow 
                  key={invoice.id} 
                  className={`hover:bg-slate-50 cursor-pointer transition-all duration-200 ${getRowShadowClass(invoice.id, index)}`}
                  onClick={() => handleRowClick(invoice)}
                >
                  <TableCell className="font-medium text-sm">INV-{invoice.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="font-medium text-sm">{invoice.reference}</TableCell>
                  <TableCell className="text-sm text-gray-600">{invoice.project}</TableCell>
                  <TableCell className="text-right font-medium text-sm">{formatCurrency(invoice.amount)}</TableCell>
                  {invoiceColumns.billed && <TableCell className="text-right font-medium text-sm">{formatCurrency(invoice.amount)}</TableCell>}
                  {invoiceColumns.payments && (
                    <TableCell className="text-right text-sm text-gray-600">
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatCurrency(invoice.payments)}</span>
                        {expandedRows.has(invoice.id) ? (
                          <ChevronDown className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                  )}
                  {invoiceColumns.outstanding && (
                    <TableCell className="text-right font-medium text-sm">
                      <span className={invoice.outstanding > 0 ? "text-yellow-600 font-bold" : "text-green-600"}>
                        {formatCurrency(invoice.outstanding)}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-600">{formatDate(invoice.date)}</TableCell>
                  {invoiceColumns.dueDate && <TableCell className="text-sm text-gray-600">{formatDate(getDueDate(invoice.date).toISOString())}</TableCell>}
                  {invoiceColumns.status && (
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {invoice.outstanding === 0 ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                    </TableCell>
                  )}
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSeeInvoice(invoice)}>
                          <Eye className="mr-2 h-4 w-4" />
                          See Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSeePayments(invoice)}>
                          <FileText className="mr-2 h-4 w-4" />
                          See Payments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGoToProject(invoice)}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Go to Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRows.has(invoice.id) && (
                  <TableRow key={`${invoice.id}-expanded`} className="bg-blue-50 border-none">
                    <TableCell colSpan={12} className="p-0 bg-blue-50">
                      <div className="px-4 py-3 bg-blue-50">
                        <div className="bg-white rounded border border-blue-100 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-blue-100 bg-blue-25">
                                <TableHead className="text-xs font-medium text-gray-700 h-8 border-blue-100">Payment Date</TableHead>
                                <TableHead className="text-xs font-medium text-gray-700 h-8 border-blue-100">Method</TableHead>
                                <TableHead className="text-xs font-medium text-gray-700 h-8 text-right border-blue-100">Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getPaymentTransactions(invoice.id).map((transaction) => (
                                <TableRow key={transaction.id} className="border-blue-100 hover:bg-white">
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{formatDate(transaction.date)}</TableCell>
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{transaction.method}</TableCell>
                                  <TableCell className="text-xs text-green-600 font-medium py-2 text-right border-blue-100">{formatCurrency(transaction.amount)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="border-t-2 border-blue-200 bg-blue-25">
                                <TableCell className="text-xs font-semibold text-gray-700 py-2 border-blue-100" colSpan={2}>Total Payments:</TableCell>
                                <TableCell className="text-xs font-semibold text-green-600 py-2 text-right border-blue-100">{formatCurrency(invoice.payments)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <ClientPaymentsDocumentsDialog
        isOpen={isPaymentsDialogOpen}
        onClose={() => setIsPaymentsDialogOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
};
