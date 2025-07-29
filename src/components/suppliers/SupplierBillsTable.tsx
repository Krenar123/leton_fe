import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, ChevronDown, ChevronRight, MoreHorizontal, Eye, Download, Receipt, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PaymentsDocumentsDialog } from "./PaymentsDocumentsDialog";

interface SupplierBill {
  id: number;
  billNr: string;
  billSubject: string;
  project: string;
  billed: number;
  paid: number;
  outstanding: number;
  billDate: string;
  dueDate: string;
  status: string;
}

interface SupplierBillsTableProps {
  bills: SupplierBill[];
  searchTerm: string;
  billColumns: {
    billNr: boolean;
    billSubject: boolean;
    project: boolean;
    billed: boolean;
    paid: boolean;
    outstanding: boolean;
    billDate: boolean;
    dueDate: boolean;
    status: boolean;
  };
}

export const SupplierBillsTable = ({
  bills,
  searchTerm,
  billColumns
}: SupplierBillsTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isPaymentsDialogOpen, setIsPaymentsDialogOpen] = useState(false);
  const [selectedBillForPayments, setSelectedBillForPayments] = useState<SupplierBill | null>(null);
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

  const toggleRowExpansion = (billId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(billId)) {
      newExpandedRows.delete(billId);
    } else {
      newExpandedRows.add(billId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSeeBill = (bill: SupplierBill) => {
    // Open the bill PDF in a new tab/window
    const billPdfUrl = `/api/bills/${bill.id}/pdf`; // This would be the actual API endpoint
    window.open(billPdfUrl, '_blank');
    console.log('Opening bill PDF for:', bill.billNr);
  };

  const handleDownloadBill = (bill: SupplierBill) => {
    // Create a download link for the bill PDF
    const billPdfUrl = `/api/bills/${bill.id}/pdf`;
    const link = document.createElement('a');
    link.href = billPdfUrl;
    link.download = `${bill.billNr}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading bill for:', bill.billNr);
  };

  const handleSeePayments = (bill: SupplierBill) => {
    setSelectedBillForPayments(bill);
    setIsPaymentsDialogOpen(true);
    console.log('Opening payments documents for:', bill.billNr);
  };

  const handleGoToProject = (bill: SupplierBill) => {
    // Navigate to the financials page of the specific project
    // We need to find the project ID based on the project name
    // For now, we'll use a mock project ID - in real implementation, this would come from a lookup
    const projectId = getProjectIdByName(bill.project);
    navigate(`/projects/${projectId}/financials`);
    console.log('Navigating to project financials for:', bill.project);
  };

  // Helper function to get project ID by name (mock implementation)
  const getProjectIdByName = (projectName: string): string => {
    // This would typically be a lookup from your data source
    // For now, returning a mock ID
    const projectMap: { [key: string]: string } = {
      "Office Building Renovation": "1",
      "Residential Complex": "2",
      // Add more project mappings as needed
    };
    return projectMap[projectName] || "1";
  };

  const getPaymentTransactions = (bill: SupplierBill) => {
    if (bill.paid === 0) return [];
    
    // For bills with payments, create realistic payment breakdown
    const transactions = [];
    let remainingAmount = bill.paid;
    let transactionId = 1;
    
    // If fully paid, create 1-3 payments
    if (bill.outstanding === 0) {
      if (bill.paid <= 5000) {
        // Single payment for smaller amounts
        transactions.push({
          id: transactionId++,
          amount: bill.paid,
          date: bill.billDate,
          method: 'Bank Transfer'
        });
      } else {
        // Split larger amounts into multiple payments
        const firstPayment = Math.floor(bill.paid * 0.6);
        const secondPayment = bill.paid - firstPayment;
        
        transactions.push({
          id: transactionId++,
          amount: firstPayment,
          date: bill.billDate,
          method: 'Bank Transfer'
        });
        
        if (secondPayment > 0) {
          // Add some days to the second payment
          const secondDate = new Date(bill.billDate);
          secondDate.setDate(secondDate.getDate() + 15);
          
          transactions.push({
            id: transactionId++,
            amount: secondPayment,
            date: secondDate.toISOString().split('T')[0],
            method: 'Check'
          });
        }
      }
    } else {
      // Partial payment - create 1-2 payments that add up to paid amount
      if (bill.paid <= 3000) {
        transactions.push({
          id: transactionId++,
          amount: bill.paid,
          date: bill.billDate,
          method: 'Bank Transfer'
        });
      } else {
        const firstPayment = Math.floor(bill.paid * 0.7);
        const secondPayment = bill.paid - firstPayment;
        
        transactions.push({
          id: transactionId++,
          amount: firstPayment,
          date: bill.billDate,
          method: 'Bank Transfer'
        });
        
        if (secondPayment > 0) {
          const secondDate = new Date(bill.billDate);
          secondDate.setDate(secondDate.getDate() + 10);
          
          transactions.push({
            id: transactionId++,
            amount: secondPayment,
            date: secondDate.toISOString().split('T')[0],
            method: 'Check'
          });
        }
      }
    }
    
    return transactions;
  };

  const filteredBills = bills.filter(bill => 
    bill.billNr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.billSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              {billColumns.billNr && <TableHead className="font-semibold text-sm w-[120px]">Bill Nr.</TableHead>}
              {billColumns.billSubject && <TableHead className="font-semibold text-sm w-[200px]">Bill Subject</TableHead>}
              {billColumns.project && <TableHead className="font-semibold text-sm w-[150px]">Project</TableHead>}
              {billColumns.billed && <TableHead className="font-semibold text-sm w-[120px] text-right">Billed</TableHead>}
              {billColumns.paid && <TableHead className="font-semibold text-sm w-[120px] text-right">Paid</TableHead>}
              {billColumns.outstanding && <TableHead className="font-semibold text-sm w-[120px] text-right">Outstanding</TableHead>}
              {billColumns.billDate && <TableHead className="font-semibold text-sm w-[120px]">Bill Date</TableHead>}
              {billColumns.dueDate && <TableHead className="font-semibold text-sm w-[120px]">Due Date</TableHead>}
              {billColumns.status && <TableHead className="font-semibold text-sm w-[120px]">Status</TableHead>}
              <TableHead className="font-semibold text-sm w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBills.map((bill, index) => (
              <>
                <TableRow 
                  key={bill.id} 
                  className={`hover:bg-slate-50 cursor-pointer transition-all duration-200 ${getRowShadowClass(bill.id, index)}`}
                >
                  {billColumns.billNr && (
                    <TableCell 
                      className="font-medium text-sm"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {bill.billNr}
                    </TableCell>
                  )}
                  {billColumns.billSubject && (
                    <TableCell 
                      className="font-medium text-sm"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {bill.billSubject}
                    </TableCell>
                  )}
                  {billColumns.project && (
                    <TableCell 
                      className="text-sm text-gray-600"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {bill.project}
                    </TableCell>
                  )}
                  {billColumns.billed && (
                    <TableCell 
                      className="text-right font-medium text-sm"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {formatCurrency(bill.billed)}
                    </TableCell>
                  )}
                  {billColumns.paid && (
                    <TableCell 
                      className="text-right text-sm text-gray-600"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <span>{formatCurrency(bill.paid)}</span>
                        {expandedRows.has(bill.id) ? (
                          <ChevronDown className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                  )}
                  {billColumns.outstanding && (
                    <TableCell 
                      className="text-right text-sm text-gray-600"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {formatCurrency(bill.outstanding)}
                    </TableCell>
                  )}
                  {billColumns.billDate && (
                    <TableCell 
                      className="text-sm text-gray-600"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {formatDate(bill.billDate)}
                    </TableCell>
                  )}
                  {billColumns.dueDate && (
                    <TableCell 
                      className="text-sm text-gray-600"
                      onClick={() => toggleRowExpansion(bill.id)}
                    >
                      {formatDate(bill.dueDate)}
                    </TableCell>
                  )}
                  {billColumns.status && (
                    <TableCell onClick={() => toggleRowExpansion(bill.id)}>
                      <div className="flex items-center">
                        {bill.outstanding === 0 ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <span className="text-green-600 font-medium text-sm">Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 text-orange-600 mr-2" />
                            <span className="text-orange-600 font-medium text-sm">Outstanding</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSeeBill(bill)}>
                          <Eye className="mr-2 h-4 w-4" />
                          See Bill
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadBill(bill)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download Bill
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSeePayments(bill)}>
                          <Receipt className="mr-2 h-4 w-4" />
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
                    <TableCell colSpan={billColumns.paid ? 10 : 9} className="p-0 bg-blue-50">
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
                              {getPaymentTransactions(bill).map((transaction) => (
                                <TableRow key={transaction.id} className="border-blue-100 hover:bg-white">
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{formatDate(transaction.date)}</TableCell>
                                  <TableCell className="text-xs text-gray-600 py-2 border-blue-100">{transaction.method}</TableCell>
                                  <TableCell className="text-xs text-green-600 font-medium py-2 text-right border-blue-100">{formatCurrency(transaction.amount)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="border-t-2 border-blue-200 bg-blue-25">
                                <TableCell className="text-xs font-semibold text-gray-700 py-2 border-blue-100" colSpan={2}>Total Payments:</TableCell>
                                <TableCell className="text-xs font-semibold text-green-600 py-2 text-right border-blue-100">{formatCurrency(bill.paid)}</TableCell>
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

      <PaymentsDocumentsDialog
        isOpen={isPaymentsDialogOpen}
        onClose={() => setIsPaymentsDialogOpen(false)}
        bill={selectedBillForPayments}
      />
    </>
  );
};
