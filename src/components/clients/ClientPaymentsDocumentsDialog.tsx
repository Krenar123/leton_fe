
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, FileText } from "lucide-react";

interface Payment {
  id: number;
  amount: number;
  date: string;
  method: string;
}

interface ClientBill {
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

interface ClientPaymentsDocumentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: ClientBill | null;
}

export const ClientPaymentsDocumentsDialog = ({
  isOpen,
  onClose,
  bill
}: ClientPaymentsDocumentsDialogProps) => {
  if (!bill) return null;

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

  // Mock payment data
  const payments: Payment[] = [
    { id: 1, amount: 2800, date: '2025-08-15', method: 'Bank Transfer Receipt' },
    { id: 2, amount: 1200, date: '2025-08-25', method: 'Check Payment Receipt' },
  ];

  const handleSeeInvoice = () => {
    const invoiceUrl = `/api/invoices/${bill.id}/pdf`;
    window.open(invoiceUrl, '_blank');
    console.log('Opening invoice PDF for:', bill.billNr);
  };

  const handleDownloadInvoice = () => {
    const invoiceUrl = `/api/invoices/${bill.id}/pdf`;
    const link = document.createElement('a');
    link.href = invoiceUrl;
    link.download = `${bill.billNr}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading invoice PDF for:', bill.billNr);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-800/40 backdrop-blur-lg border-white/20 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white">
            Payment Documents - {bill.billNr}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Three Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Invoice Information */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Invoice Information</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-slate-300">Invoice Subject:</span>
                  <div className="text-white mt-1 font-medium">{bill.billSubject}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-300">Project:</span>
                  <div className="text-white mt-1 font-medium">{bill.project}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-300">Client:</span>
                  <div className="text-white mt-1 font-medium">Client Name</div>
                </div>
              </div>
            </div>

            {/* Middle Column - Financial Overview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Financial Overview</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-medium text-slate-300">Invoiced:</span>
                  <div className="text-xl font-bold text-white">{formatCurrency(bill.billed)}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-300">Payments Received:</span>
                  <div className="text-xl font-bold text-emerald-400">{formatCurrency(bill.paid)}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-300">Outstanding:</span>
                  <div className={`text-xl font-bold ${bill.outstanding > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {formatCurrency(bill.outstanding)}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Invoice Document */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Invoice Document</h4>
              
              <div 
                className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 hover:border-white/50 cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-white/15"
                onClick={handleSeeInvoice}
              >
                <FileText className="w-8 h-8 text-red-400" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-white">{bill.billNr}.pdf</div>
                  <div className="text-xs text-slate-300">Invoice Document</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeeInvoice();
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadInvoice();
                    }}
                    className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Documents Table */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide">Payment Documents</h4>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 hover:bg-white/5 border-white/20">
                    <TableHead className="font-semibold text-sm text-slate-200">Document</TableHead>
                    <TableHead className="font-semibold text-sm text-slate-200">Date</TableHead>
                    <TableHead className="font-semibold text-sm text-slate-200">Type</TableHead>
                    <TableHead className="font-semibold text-sm text-right text-slate-200">Amount</TableHead>
                    <TableHead className="font-semibold text-sm text-center text-slate-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={payment.id} className="hover:bg-white/5 transition-colors border-white/10">
                      <TableCell className="font-medium text-sm">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-400" />
                          <span className="text-white">Payment Receipt {bill.billNr}-{String(index + 1).padStart(3, '0')}.pdf</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {formatDate(payment.date)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-300">
                        {payment.method}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-sm text-emerald-400">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                            onClick={() => console.log('View payment document')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                            onClick={() => console.log('Download payment document')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
