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

interface ClientBill {
  id: number;
  reference: string;
  date: string;
  amount: number;
  status: string;
  project: string;
  payments: number;
  outstanding: number;
}

interface ClientBillsTableProps {
  bills: ClientBill[];
  searchTerm: string;
  billColumns: {
    billed: boolean;
    payments: boolean;
    outstanding: boolean;
    dueDate: boolean;
    status: boolean;
  };
}

export const ClientBillsTable = ({
  bills,
  searchTerm,
  billColumns
}: ClientBillsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isPaymentsDialogOpen, setIsPaymentsDialogOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
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

  const toggleRowExpansion = (billId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(billId)) {
      newExpandedRows.delete(billId);
    } else {
      newExpandedRows.add(billId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleRowClick = (bill: ClientBill) => {
    // Convert ClientBill to the format expected by ClientPaymentsDocumentsDialog
    const billFormat = {
      id: bill.id,
      billNr: `INV-${bill.id.toString().padStart(4, '0')}`,
      billSubject: bill.reference,
      project: bill.project,
      billed: bill.amount,
      paid: bill.payments,
      outstanding: bill.outstanding,
      billDate: bill.date,
      dueDate: getDueDate(bill.date).toISOString().split('T')[0],
      status: bill.status
    };
    setSelectedBill(billFormat);
    setIsPaymentsDialogOpen(true);
  };

  // Mock payment transactions for demonstration
  const getPaymentTransactions = (billId: number) => [
    { id: 1, amount: 2500, date: '2024-01-15', method: 'Bank Transfer' },
    { id: 2, amount: 1500, date: '2024-02-10', method: 'Check' },
  ];

  const handleSeeInvoice = (bill: ClientBill) => {
    const invoiceUrl = `/api/invoices/${bill.id}/pdf`;
    window.open(invoiceUrl, '_blank');
    console.log('Opening invoice PDF for:', `INV-${bill.id.toString().padStart(4, '0')}`);
  };

  const handleDownloadInvoice = (bill: ClientBill) => {
    const invoiceUrl = `/api/invoices/${bill.id}/pdf`;
    const link = document.createElement('a');
    link.href = invoiceUrl;
    link.download = `Invoice-${bill.id.toString().padStart(4, '0')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading invoice PDF for:', `INV-${bill.id.toString().padStart(4, '0')}`);
  };

  const handleSeePayments = (bill: ClientBill) => {
    // Convert ClientBill to SupplierBill format for the dialog
    const supplierBillFormat = {
      id: bill.id,
      billNr: `INV-${bill.id.toString().padStart(4, '0')}`,
      billSubject: bill.reference,
      project: bill.project,
      billed: bill.amount,
      paid: bill.payments,
      outstanding: bill.outstanding,
      billDate: bill.date,
      dueDate: getDueDate(bill.date).toISOString().split('T')[0],
      status: bill.status
    };
    setSelectedBill(supplierBillFormat);
    setIsPaymentsDialogOpen(true);
  };

  const handleGoToProject = (bill: ClientBill) => {
    // Navigate to the financials page of the project
    // Using project name to derive project ID (in real app, you'd have project ID)
    const projectId = bill.project.toLowerCase().replace(/\s+/g, '-');
    navigate(`/projects/${projectId}/financials`);
  };

  const filteredBills = bills.filter(bill => 
    bill.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRowShadowClass = (billId: number, index: number) => {
    const isExpanded = expandedRows.has(billId);
    const nextBill = filteredBills[index + 1];
    const isNextExpanded = nextBill ? expandedRows.has(nextBill.id) : false;
    
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
              {billColumns.billed && <TableHead className="font-semibold text-sm w-[120px] text-right">Invoiced</TableHead>}
              {billColumns.payments && <TableHead className="font-semibold text-sm w-[120px] text-right">Payments Received</TableHead>}
              {billColumns.outstanding && <TableHead className="font-semibold text-sm w-[120px] text-right">Outstanding</TableHead>}
              <TableHead className="font-semibold text-sm w-[100px]">Date</TableHead>
              {billColumns.dueDate && <TableHead className="font-semibold text-sm w-[100px]">Due Date</TableHead>}
              {billColumns.status && <TableHead className="font-semibold text-sm w-[80px] text-center">Status</TableHead>}
              <TableHead className="font-semibold text-sm w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill, index) => (
              <>
                <TableRow 
                  key={bill.id} 
                  className={`hover:bg-slate-50 cursor-pointer transition-all duration-200 ${getRowShadowClass(bill.id, index)}`}
                  onClick={() => handleRowClick(bill)}
                >
                  <TableCell className="font-medium text-sm">INV-{bill.id.toString().padStart(4, '0')}</TableCell>
                  <TableCell className="font-medium text-sm">{bill.reference}</TableCell>
                  <TableCell className="text-sm text-gray-600">{bill.project}</TableCell>
                  <TableCell className="text-right font-medium text-sm">{formatCurrency(bill.amount)}</TableCell>
                  {billColumns.billed && <TableCell className="text-right font-medium text-sm">{formatCurrency(bill.amount)}</TableCell>}
                  {billColumns.payments && (
                    <TableCell className="text-right text-sm text-gray-600">
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatCurrency(bill.payments)}</span>
                        {expandedRows.has(bill.id) ? (
                          <ChevronDown className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                  )}
                  {billColumns.outstanding && (
                    <TableCell className="text-right font-medium text-sm">
                      <span className={bill.outstanding > 0 ? "text-yellow-600 font-bold" : "text-green-600"}>
                        {formatCurrency(bill.outstanding)}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-gray-600">{formatDate(bill.date)}</TableCell>
                  {billColumns.dueDate && <TableCell className="text-sm text-gray-600">{formatDate(getDueDate(bill.date).toISOString())}</TableCell>}
                  {billColumns.status && (
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {bill.outstanding === 0 ? (
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
                        <DropdownMenuItem onClick={() => handleSeeInvoice(bill)}>
                          <Eye className="mr-2 h-4 w-4" />
                          See Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadInvoice(bill)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSeePayments(bill)}>
                          <FileText className="mr-2 h-4 w-4" />
                          See Payments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleGoToProject(bill)}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Go to Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                {expandedRows.has(bill.id) && (
                  <TableRow key={`${bill.id}-expanded`} className="bg-blue-50 border-none">
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
                              {getPaymentTransactions(bill.id).map((transaction) => (
                                <TableRow key={transaction.id} className="border-blue-100 hover:bg-white">
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{formatDate(transaction.date)}</TableCell>
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{transaction.method}</TableCell>
                                  <TableCell className="text-xs text-green-600 font-medium py-2 text-right border-blue-100">{formatCurrency(transaction.amount)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="border-t-2 border-blue-200 bg-blue-25">
                                <TableCell className="text-xs font-semibold text-gray-700 py-2 border-blue-100" colSpan={2}>Total Payments:</TableCell>
                                <TableCell className="text-xs font-semibold text-green-600 py-2 text-right border-blue-100">{formatCurrency(bill.payments)}</TableCell>
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
        bill={selectedBill}
      />
    </>
  );
};
