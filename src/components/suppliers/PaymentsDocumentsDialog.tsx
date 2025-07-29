import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from "lucide-react";

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

interface PaymentDocument {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: string;
}

interface PaymentsDocumentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bill: SupplierBill | null;
}

export const PaymentsDocumentsDialog = ({
  isOpen,
  onClose,
  bill
}: PaymentsDocumentsDialogProps) => {
  if (!bill) return null;

  // Generate mock payment documents for the bill
  const getPaymentDocuments = (): PaymentDocument[] => {
    if (bill.paid === 0) return [];

    const documents: PaymentDocument[] = [];
    
    // Generate payment documents based on the payment transactions
    if (bill.outstanding === 0) {
      // Fully paid
      if (bill.paid <= 5000) {
        documents.push({
          id: `payment-${bill.id}-1`,
          name: `Payment Receipt ${bill.billNr}-001.pdf`,
          date: bill.billDate,
          amount: bill.paid,
          type: "Bank Transfer Receipt"
        });
      } else {
        const firstPayment = Math.floor(bill.paid * 0.6);
        const secondPayment = bill.paid - firstPayment;
        
        documents.push({
          id: `payment-${bill.id}-1`,
          name: `Payment Receipt ${bill.billNr}-001.pdf`,
          date: bill.billDate,
          amount: firstPayment,
          type: "Bank Transfer Receipt"
        });
        
        if (secondPayment > 0) {
          const secondDate = new Date(bill.billDate);
          secondDate.setDate(secondDate.getDate() + 15);
          
          documents.push({
            id: `payment-${bill.id}-2`,
            name: `Payment Receipt ${bill.billNr}-002.pdf`,
            date: secondDate.toISOString().split('T')[0],
            amount: secondPayment,
            type: "Check Payment Receipt"
          });
        }
      }
    } else {
      // Partial payment
      if (bill.paid <= 3000) {
        documents.push({
          id: `payment-${bill.id}-1`,
          name: `Payment Receipt ${bill.billNr}-001.pdf`,
          date: bill.billDate,
          amount: bill.paid,
          type: "Bank Transfer Receipt"
        });
      } else {
        const firstPayment = Math.floor(bill.paid * 0.7);
        const secondPayment = bill.paid - firstPayment;
        
        documents.push({
          id: `payment-${bill.id}-1`,
          name: `Payment Receipt ${bill.billNr}-001.pdf`,
          date: bill.billDate,
          amount: firstPayment,
          type: "Bank Transfer Receipt"
        });
        
        if (secondPayment > 0) {
          const secondDate = new Date(bill.billDate);
          secondDate.setDate(secondDate.getDate() + 10);
          
          documents.push({
            id: `payment-${bill.id}-2`,
            name: `Payment Receipt ${bill.billNr}-002.pdf`,
            date: secondDate.toISOString().split('T')[0],
            amount: secondPayment,
            type: "Check Payment Receipt"
          });
        }
      }
    }
    
    return documents;
  };

  const paymentDocuments = getPaymentDocuments();

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

  const handleViewDocument = (paymentDoc: PaymentDocument) => {
    const documentUrl = `/api/payments/${paymentDoc.id}/pdf`;
    window.open(documentUrl, '_blank');
    console.log('Opening payment document:', paymentDoc.name);
  };

  const handleDownloadDocument = (paymentDoc: PaymentDocument) => {
    const documentUrl = `/api/payments/${paymentDoc.id}/pdf`;
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = paymentDoc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading payment document:', paymentDoc.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment Documents - {bill.billNr}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{bill.billSubject}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Project:</span> {bill.project}
              </div>
              <div>
                <span className="text-gray-600">Total Billed:</span> {formatCurrency(bill.billed)}
              </div>
              <div>
                <span className="text-gray-600">Total Paid:</span> {formatCurrency(bill.paid)}
              </div>
              <div>
                <span className="text-gray-600">Outstanding:</span> {formatCurrency(bill.outstanding)}
              </div>
            </div>
          </div>

          {paymentDocuments.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-sm">Document</TableHead>
                    <TableHead className="font-semibold text-sm">Date</TableHead>
                    <TableHead className="font-semibold text-sm">Type</TableHead>
                    <TableHead className="font-semibold text-sm text-right">Amount</TableHead>
                    <TableHead className="font-semibold text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentDocuments.map((paymentDoc) => (
                    <TableRow key={paymentDoc.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-red-600" />
                          {paymentDoc.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(paymentDoc.date)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {paymentDoc.type}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(paymentDoc.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDocument(paymentDoc)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadDocument(paymentDoc)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No payment documents available for this bill.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
